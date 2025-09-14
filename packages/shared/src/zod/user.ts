import z from "zod"


export const signupSchema = z.object({
    email: z.string().email(),
    password:z.string()
})

export const signInSchema = z.object({
    email: z.string().email(),
    password:z.string()
})