import prisma from "@n8n/db";
import { Resend } from "resend";
import Mustache from "mustache";
export async function SendResendEmail(config, credentialId, context) {
    try {
        const credential = await prisma.credentials.findUnique({
            where: { id: credentialId },
        });
        if (!credential) {
            throw new Error("Credential not found");
        }
        const data = typeof credential.data === "string" ? JSON.parse(credential.data) : credential.data;
        const { api_key, resendDomainMail } = data;
        const resend = new Resend(api_key);
        const email = await resend.emails.send({
            from: resendDomainMail || "noreply@yourdomain.com",
            to: context.email,
            subject: config.subject,
            html: Mustache.render(config.html, context),
        });
        return {
            success: true,
            message: "Email sent successfully",
            data: email
        };
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
//# sourceMappingURL=resend.js.map