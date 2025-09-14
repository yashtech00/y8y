import { signupSchema } from "../service/type.js";
import prisma from "../service/db.js";

const signUp = async (req:any, res:any) => {
    try {
        const { data, success } = signupSchema.safeParse(req.body);
        
        if (!success) {
            return res.status(404).json({
                message:"Incorrect email or password"
            })
        }

        const existingUser = await prisma.User.find(email)



        
    } catch (e) {
        
    }
}