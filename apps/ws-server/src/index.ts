import { WebSocketServer } from "ws";
import { redis, config } from "@my-n8n/shared";

const socket = new WebSocketServer({ port: Number(config.wsServer.port) || 8082 });

socket.on("connection", (ws) => {
  console.log("Client connected");

  let sub: ReturnType<typeof redis.duplicate> | null = null;
  let subscribeChannel: string | null = null;

  ws.on("message", async (message) => {
    try {
      console.log("Message from client:", message);
      const data = JSON.parse(message.toString());

      if (data.type === "subscribe" && data.workflowId) {
        if (sub) {
          await sub.unsubscribe(subscribeChannel!);
          await sub.disconnect();
        }
        subscribeChannel = `workflow:${data.workflowId}:events`;
        sub = redis.duplicate();
        await sub.connect();
        await sub.subscribe(subscribeChannel, (message) => {
          if (ws.readyState === ws.OPEN) {
            ws.send(message);
          }
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", async () => {
    console.log("Client disconnected");
    if (sub && subscribeChannel) {
      await sub.unsubscribe(subscribeChannel);
      await sub.disconnect();
      console.log("Unsubscribed from channel:", subscribeChannel);
    }
  });
});

console.log(`WebSocket server started on port ${config.wsServer.port}`);

