import {Platform } from "@n8n/db"
import z from "zod"

const nodeSchema = z.object({
    id: z.string(),
    type: z.enum([Platform.ResendEmail,Platform.Telegram,Platform.Gemini]),
    config:z.record(z.string(),z.any()),
    credentialId: z.string().optional(),
    position: z.object({
       x: z.number(),
       y: z.number()
   }).optional()
})

const webhookSchema = z.object({
   
    title: z.string(),
    method: z.enum(["GET", "POST", "PUT", "DELETE"]),
    secret: z.string().optional(),
  
})


export const createWorkflowSchema = z.object({
    title: z.string().min(1, "Title is required"),
    nodes: z.record(z.string(), nodeSchema),
    connections: z.record(z.string(),z.array(z.string())),
    webhook: webhookSchema.optional(),
    triggerType: z.enum(["Manual", "Webhook"]),
    enabled: z.boolean().optional()
    
})

export const updateWorkflowSchema = createWorkflowSchema.partial();


