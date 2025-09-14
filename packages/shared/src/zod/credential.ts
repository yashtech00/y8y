import z from "zod"


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const ResendSchema = z.object({
    title: z.string().min(1, "Title is required"),
    platform: z.literal("ResendEmail"),
    data: z.object({
        api_key: z.string().min(1, "API key is required"),
        resendDomainMail: z.string().regex(emailRegex, "Invalid email address").optional()
    })
})

export const TelegramSchema = z.object({
    title: z.string(),
    platform: z.literal("Telegram"),
    data: z.object({
        botToken: z.string().min(1, "Bot token is required"),
        chatId: z.string().min(1, "Chat ID is required")
    })
})

export const GeminiSchema = z.object({
    title: z.string(),
    platform: z.literal("Gemini"),
    data: z.object({
        api_key: z.string().min(1, "API key is required"),
    })
})

export const credentialsPostSchema = z.discriminatedUnion("platform", [
    ResendSchema,
    TelegramSchema,
    GeminiSchema,
  ]);
  
  export const credentialsUpdateSchema = z.discriminatedUnion("platform", [
    ResendSchema,
    TelegramSchema,
    GeminiSchema,
  ]);

  export type CredentialPostInput = z.infer<typeof credentialsPostSchema>
  export type CredentialUpdateInput = z.infer<typeof credentialsUpdateSchema>