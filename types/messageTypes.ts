export type Message = {
    sendBy: string;
    sentAt: Date;
    text: string
}

export type StarredMessages = {
    messageId: string;
    chatId: string;
    starredAt: Date;
}