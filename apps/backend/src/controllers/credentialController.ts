import prisma from "@n8n/db";
import { credentialsPostSchema } from "@my-n8n/shared";


const createCredential = async (req:any, res:any) => {
    try {
        const { data, success } = credentialsPostSchema.safeParse(req.body);
        
        if (!success) {
            return res.status(404).json({
                message:"Incorrect data"
            })
        }

        const existingCredential = await prisma.Credential.findUnique({
            where: {
                title: data.title
            }
        })
    } catch (e) {
        
    }
}