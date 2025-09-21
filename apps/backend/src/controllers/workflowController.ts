import prisma from "@n8n/db";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import type { Response } from "express";
import { createWorkflowSchema, updateWorkflowSchema } from "@my-n8n/shared";
import { enqueueExecution } from "../redis/enqueue.js";


const createWorkflow = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const validation = createWorkflowSchema.safeParse(req.body);
        
        if (!validation.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: validation.error.format(),
            });
            return;
        }

        const newWorkflow = validation.data;

        let webhookRecord = null;

        if(newWorkflow.triggerType === "Webhook" && newWorkflow.webhook) {
            webhookRecord = await prisma.webhook.create({
                data: {
                    title: newWorkflow.webhook.title,
                    method: newWorkflow.webhook.method,
                    secret: newWorkflow.webhook.secret,
                }
            })
        }

        const workflow = await prisma.workflow.create({
            data: {
                title: newWorkflow.title,
                nodes: newWorkflow.nodes,
                connections: newWorkflow.connections,
                webhook: webhookRecord?.id,
                triggerType: newWorkflow.triggerType,
                enabled: newWorkflow.enabled,
                userId: req.userId!,
            },
        })

        res.status(200).json({
            message: "Workflow created successfully",
            workflow,
        })

    } catch (error:any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
        return;
    }
};

const runManualWorkflow = async(req:AuthRequest,res:Response):Promise<void> => {
    try {
        const {id} = req.params;
        const workflow = await prisma.workflow.findUnique({
            where: {
                id,
            },
        })

        if (!workflow) {
            res.status(404).json({
                message: "Workflow not found",
            })
            return;
        }
        if (!workflow || workflow.userId !== req.userId) {
            res.status(403).json({ message: "Not allowed to run this workflow" });
            return;
          }
      
          if (workflow.triggerType !== "Manual") {
            res.status(400).json({ message: "This workflow is not manual" });
            return;
          }

        const totalTasks = Object.keys(workflow.nodes).length;

        const execution = await prisma.execution.create({
            data: {
                workflowId: id,
                totalTasks,
                output: {triggerPayload: {}},
            },
        })
        await enqueueExecution(execution.id, id!, req.body ?? {});

        res.status(200).json({
            message: "Workflow executed successfully",
            execution,
        })
        
    } catch (error:any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
        return;
    }
}

const getAllWorkflows = async (req: AuthRequest, res: Response) => {
    try {
        const workflows = await prisma.workflow.findMany({
            where: {
                userId: req.userId!,
            },
        })
        res.status(200).json({
            message: "Workflows retrieved successfully",
            workflows,
        })
    } catch (error:any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

const getWorkflowById = async (req: AuthRequest, res: Response) => {
    try {
        const {id} = req.params;
        const workflow = await prisma.workflow.findUnique({
            where: {
                id,
            },
        })

        if (!workflow) {
            res.status(404).json({
                message: "Workflow not found",
            })
            return;
        }
        
        res.status(200).json({
            message: "Workflow retrieved successfully",
            workflow,
        })
    }catch(error:any){
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

const updateWorkflow = async (req: AuthRequest, res: Response) => {
    try {
        const {id} = req.params;
        const validation = updateWorkflowSchema.safeParse(req.body);
        if(!validation.success){
            res.status(400).json({
                message: "Validation failed",
                errors: validation.error.format(),
            })
            return;
        }

        const updatedWorkflow = await prisma.workflow.update({
            where: {
                id,
            },
            data: validation.data,
        })

        res.status(200).json({
            message: "Workflow updated successfully",
            updatedWorkflow,
        })
    } catch (error:any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}



export const workflowController = {
    createWorkflow,
    runManualWorkflow,
    getAllWorkflows,
    getWorkflowById,
    updateWorkflow,
   
}