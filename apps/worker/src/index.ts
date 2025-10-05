import { redis } from "@my-n8n/shared";
import prisma from "@n8n/db";


type XReadMessage = {
    id: string,
    message:Record<string, string>
}

type XReadeStream = {
    name: string,
    message:XReadMessage[]
}

const GROUP = "workflowGroup"
const CONSUMER = `workflow-${process.pid}`



async function processExecution(message: XReadMessage) {

    const { executionId, workflowId } = message.message;
    try {

        const workflow = await prisma.workflow.findUnique({
            where: {
                id: workflowId
            }
        })

        if (!workflow){
            console.error("Workflow not found");
            await redis.xAck("workflow:executions", GROUP, message.id);
            return;
        }

        const execution = await prisma.execution.findUnique({
            where: {
                id:executionId
            }
        })

        if (!execution){
            console.error("Execution not found");
            await redis.xAck("workflow:executions", GROUP, message.id);
            return;
        }

        const triggerPayload = (execution?.output as any)?.triggerPayload ?? {};
        
        await prisma.execution.update({
            where: {
                id:executionId
            },
            data: {
                status: "RUNNING"
            }
        })

        await publishEvent(workflowId, { type: "execution_started", executionId, workflowId, totalTasks: execution.totalTasks ?? 0 })
        
        const nodes = workflow.nodes as Record<string, any>;
        const connections = workflow.connections as Record<string, any>;

        
        
    } catch (e) {
        
    }
}





async function main() {
    await redis.connect();
    console.log("Worker started, waiting for jobs...");

    await redis.xGroupCreate("workflow:executions", GROUP,"0", { MKSTREAM: true }).catch(() => { }) 

    while (true) {
        try {
            const jobs = await redis.xReadGroup(
                GROUP,
                CONSUMER,
                { key: "workflow:executions",id:">" },
                { COUNT: 10, BLOCK: 1000 })
            if(jobs && Array.isArray(jobs)){
            for(const job of jobs){
                await Promise.all(jobs.map((m) => {
                    processExecution(m)
                }))
            }      
        }
    } catch (error) {
        console.error("Error processing job:", error);
    }

    
    }

    
}

main();