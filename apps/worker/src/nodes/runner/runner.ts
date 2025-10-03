import { SendResendEmail } from "../resend.js";
import { runGeminiNode } from "../gemini/index.js";
import { SendTelegramMessage } from "../Telegram.js";


export async function runner(node:any,context:Record<string,any>,workFlowId?:string) {
    try {
        switch (node.type) {
            case "ResendEmail":
                return await SendResendEmail(node.config,node.credentialsId,context);
            case "Telegram":
                return await SendTelegramMessage(node.config, node.credentialsId, context);
            case "Gemini":
                return await runGeminiNode(node.config, node.credentialsId, workFlowId);
            default:
                    throw new Error(`Unknown node type: ${node.type}`);
        }
    } catch (error:any) {
        console.error(`Node ${node.type} failed:`, error);
        throw new Error(`Some error happened in ${node.type}: ${error.message}`);
    }
}