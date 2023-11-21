export type Message = {
    sendBy: string;
    sentAt: string;
    text: string;
    replyId?: string;
    imageUrl?: string;
}

export type StarredMessages = {
    messageId: string;
    chatId: string;
    starredAt: Date;
}