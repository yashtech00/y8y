import { redis } from "@my-n8n/shared";
import prisma from "@n8n/db";
import { runner } from "./nodes/runner/runner.js";
import { publishEvent } from "./publish.js";


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
                id: workflowId!
            }
        })

        if (!workflow){
            console.error("Workflow not found");
            await redis.xAck("workflow:executions", GROUP, message.id);
            return;
        }

        const execution = await prisma.execution.findUnique({
            where: {
                id:executionId!
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
                id:executionId!
            },
            data: {
                status: "RUNNING"
            }
        })

        await publishEvent(workflowId!, { type: "execution_started", executionId, workflowId, totalTasks: execution.totalTasks ?? 0 })
        
        const nodes = workflow.nodes as Record<string, any>;
        const connections = workflow.connections as Record<string, any>;

        let context: Record<string, any> = {
            $json: { body: triggerPayload },
            $node:{}
        };

        let tasksDone = 0;

        
        const indegree: Record<string, number> = {};
        Object.keys(nodes).forEach((n) => (indegree[n] = 0));
        Object.values(connections).forEach((targets) => {
            targets.forEach(
                (t:string) => (indegree[t] = (indegree[t] || 0) + 1)
            );
        });
        

        const queue: string[] = Object.keys(indegree).filter((n) => indegree[n] === 0);
        let executionFailed = false;
        while(queue.length > 0){
            const nodeId = queue.shift()!;
            const node = nodes[nodeId];

            await publishEvent(workflowId!, { type: "node_started", executionId, workflowId, nodeId })

            try {
                const result = await runner(node, context, executionId);
                
                context.$node[nodeId] = result;

                tasksDone++;

                await prisma.execution.update({
                    where: {
                        id: executionId!
                    },
                    data: {
                        taskDone: tasksDone,
                        logs:{...(execution!.logs as any),[nodeId]:"Sussess"},
                    },
                })

                await publishEvent(workflowId!, { type: "node_succeeded", executionId, workflowId, nodeId })

                const nextNodes = connections[nodeId] || [];
                nextNodes.forEach((n:string) => {
                    if (indegree[n] !== undefined) {
                        indegree[n]--;
                        if (indegree[n] === 0) {
                            queue.push(n);
                        }
                    }
                });
                
                
            } catch (e:any) {
                console.error("Error processing node:", e.message);

                const msg = e.message;

                await prisma.execution.update({
                    where: {
                        id: executionId!
                    },
                    data: {
                        logs:{...(execution!.logs as any),[nodeId]:`Error: ${msg}`},
                    },
                })
                await publishEvent(workflowId!, { type: "node_failed", executionId, workflowId, nodeId, message: msg })
                executionFailed = true;
                break;
            }
            
        }

        if(executionFailed){
            await prisma.execution.update({
                where: {
                    id: executionId!
                },
                data: {
                    status: "FAILED",
                },
            })
            await publishEvent(workflowId!  , { type: "execution_failed", executionId, workflowId })
        }else{
            await prisma.execution.update({
                where: {
                    id: executionId!
                },
                data: {
                    status: "SUCCESS",
                },
            })
            await publishEvent(workflowId!, { type: "execution_succeeded", executionId, workflowId })
        }

        await redis.xAck("workflow:executions", GROUP, message.id);

        
    } catch (e:any) {
        console.error("Error processing execution:", e.message);
        
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
                await Promise.all(jobs.map((m:any) => {
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