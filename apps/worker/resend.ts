import prisma from "@n8n/db";
import { Resend } from "resend";


export async function SendResendEmail(config: any, credentialId: string, context: any) { 
    try {
        const credential = await prisma.credentials.findUnique({
            where: { id: credentialId },
        });

        if (!credential) {
            throw new Error("Credential not found");
        }

        const data = typeof credential.data === "string" ? JSON.parse(credential.data) : credential.data;
        const { api_key, resendDomainMail } = data as { api_key: string, resendDomainMail: string };

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