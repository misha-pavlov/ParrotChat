export type Message = {
    sendBy: string;
    sentAt: string;
    text: string;
    replyId?: string;
}

export type StarredMessages = {
    messageId: string;
    chatId: string;
    starredAt: Date;
}