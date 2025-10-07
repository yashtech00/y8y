export const PlatformProp = {
    ResendEmail: "ResendEmail",
    Telegram: "Telegram",
    Gemini: "Gemini",
    Form: "Form",
    Slack: "Slack"
} as const;

export type PlatformProp = typeof PlatformProp[keyof typeof PlatformProp];

export interface Platform {
    name: string;
    description: string;
    icon: string;
    requiresAuth: boolean;
}