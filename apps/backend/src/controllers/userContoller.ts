import { signupSchema } from "@my-n8n/shared";
import prisma from "../service/db.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const signUp = async (req:any, res:any) => {
    try {
        const { data, success } = signupSchema.safeParse(req.body);
        
        if (!success) {
            return res.status(404).json({
                message:"Incorrect email or password"
            })
        }

        const existingUser = await prisma.User.findUnique({
            where: {
                email: data.email
            }
        })

        if (existingUser) {
            return res.status(404).json({
                message:"User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.User.create({
            data: {
                email: data.email,
                password: hashedPassword
            }
        })

        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET!)

        return res.status(200).header("Authorization", `Bearer ${token}`).json({
            message:"User created successfully",
            user
        })
    } catch (e) {
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

const signIn = async (req: any, res: any) => {
    try {
        const { data, success } = signupSchema.safeParse(req.body);
        
        if (!success) {
            return res.status(404).json({
                message:"Incorrect email or password"
            })
        }

        const user = await prisma.User.findUnique({
            where: {
                email: data.email
            }
        })

        if (!user) {
            return res.status(404).json({
                message:"User not found"
            })
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password)

        if (!isPasswordValid) {
            return res.status(404).json({
                message:"Incorrect email or password"
            })
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET!)

        return res.status(200).header("Authorization", `Bearer ${token}`).json({
            message:"User signed in successfully",
            user
        })
    } catch (e) {
        return res.status(500).json({
            message:"Internal server error"
        })
    }   
}

const verify = async (req: any, res: any) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(404).json({
                message:"Unauthorized"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!)

        return res.status(200).json({
            message:"User verified successfully",
            decoded
        })
    } catch (e) {
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const userController = {
    signUp,
    signIn,
    verify
}