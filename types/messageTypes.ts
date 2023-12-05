export type Message = {
  sendBy: string;
  sentAt: string;
  text: string;
  replyId?: string;
  imageUrl?: string;
  type?: "info";
};

export type StarredMessages = {
  messageId: string;
  chatId: string;
  starredAt: Date;
};
