export type Chat = {
  key: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  latestMessageText: string;
  users: string[];
  isGroupChat?: boolean;
  chatName?: string;
  chatImage?: string;
};

export type UpdateChatData = {
  chatImage?: string;
}