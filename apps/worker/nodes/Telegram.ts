

export async function TelegramNode(config: any) {
    try {
        const { botToken, chatId } = config;
        const bot = new TelegramBot(botToken, { polling: true });
        await bot.sendMessage(chatId, message);
    } catch (error) {
        console.error(error);
        throw error;
    }
}