import express from "express"
import userRoutes from "./routes/user.js"
import credentialRoutes from "./routes/credential.js"
import workflowRoutes from "./routes/workflow.js"
import webhookRoutes from "./routes/webhook.js"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config();

const app = express()

const PORT = process.env.PORT || 8080;

app.use(
    cors({
      origin: (origin, callback) => callback(null, true),
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "stripe-signature",
      ],
      exposedHeaders: ["Authorization"],
    })
  );

app.get("/", (req,res) => {
    res.send("backend N8N")
})

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/credentials", credentialRoutes);
app.use("/api/v1/workflow", workflowRoutes);
app.use("/api/v1/webhook", webhookRoutes)    ;

app.listen(PORT, () => {
    console.log(`server is connected to ${PORT}`);
    
})