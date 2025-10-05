import { redis } from "@my-n8n/shared";


export async function publishEvent(workflowId:string, payload:any){
    try {
        const channel = `workflow:${workflowId}:events`;

        await redis.publish(channel, JSON.stringify({...payload,ts:Date.now()}));
    } catch (e) {
        console.error("Error publishing event:", e);
        
    }
}