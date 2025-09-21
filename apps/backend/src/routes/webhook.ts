import prisma from "@n8n/db";
import express from "express"
import { enqueueExecution } from "../redis/enqueue.js";

const webhookRouter = express.Router();

webhookRouter.all("/webhook/:webhookId", async (req, res) => {
    const {webhookId} = req.params;
    
    try {
        const webhook = await prisma.webhook.findUnique({
            where: {
                id: webhookId,
            },
        })

        if (!webhook) {
            return res.status(404).json({
                message: "Webhook not found",
            })
        }

        if (webhook.secret) {
            const authHeader = req.headers.authorization;
            if(authHeader !== webhook.secret){
                return res.status(401).json({
                    message: "Unauthorized",
                })
            }
        }
        
        const totalTasks = Object.keys(webhook.workflow?.nodes ?? {}).length;
        const execution = await prisma.execution.create({
            data: {
                workflowId: webhook.workflowId,
                totalTasks,
                output: {triggerPayload: req.body ?? {}},
            },
        })
        await enqueueExecution(execution.id, webhook.workflow?.id!, req.body ?? {});
        return res.status(200).json({
            message: "Webhook executed successfully",
            executionId:execution.id,
        })

    } catch (e) {
        return res.status(500).json({
            message: "Internal server error",
        })
    }
})

export default webhookRouter
