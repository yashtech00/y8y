import { redis } from "@my-n8n/shared";


export async function enqueueExecution(executionId: string, workflowId: string, payload: any) {
    try {
        await redis.xAdd("workflow:executions", '*', {
            executionId,
            workflowId,
            payload
        }, {
            TRIM: {
                strategy: "MAXLEN",
                threshold: 100,
                strategyModifier:'~'
            }
        })
    } catch (e) {
        console.log(e);
    }
    
}