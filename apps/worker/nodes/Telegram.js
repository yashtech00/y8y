import Mustache from "mustache";
import prisma from "@n8n/db";
export async function SendTelegramMessage(config, credentialId, context) {
    try {
        const credential = await prisma.credentials.findUnique({
            where: { id: credentialId },
        });
        if (!credential) {
            throw new Error("Credential not found");
        }
        const data = typeof credential.data === "string" ? JSON.parse(credential.data) : credential.data;
        const { botToken, chatId } = data;
        const message = Mustache.render(config.message, context);
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        });
        const text = await res.text();
        let result = {};
        try {
            result = JSON.parse(text);
        }
        catch (error) {
            throw new Error("Failed to parse response");
        }
        if (result.ok) {
            return {
                success: true,
                message: "Message sent successfully"
            };
        }
        return {
            success: true,
            message
        };
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
//# sourceMappingURL=Telegram.js.map