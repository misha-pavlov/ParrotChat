import {
  child,
  getDatabase,
  push,
  ref,
  update,
} from "firebase/database";
import { getFirebaseApp } from "../firebaseHelper";
import { Chat } from "../../types/chatTypes";

export const createChat = async (userId: string, chatData: Pick<Chat, 'users'>) => {
  const newChatData = {
    ...chatData,
    createdBy: userId,
    updatedBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const app = getFirebaseApp();
  const dbRef = ref(getDatabase(app));
  const newChat = await push(child(dbRef, "chats"), newChatData);

  const chatUsers = newChatData.users;
  for (let i = 0; i < chatUsers.length; i++) {
    const userId = chatUsers[i];
    await push(child(dbRef, `userChats/${userId}`), newChat.key);
  }

  return newChat.key || undefined;
};

export const sendTextMessage = async (chatId: string, senderId: string, messageText: string) => {
  const app = getFirebaseApp();
  const dbRef = ref(getDatabase(app));
  const messagesRef = child(dbRef, `messages/${chatId}`);

  const messageData = {
    sendBy: senderId,
    sentAt: new Date().toISOString(),
    text: messageText
  }
  await push(messagesRef, messageData);

  const chatRef = child(dbRef, `chats/${chatId}`);
  await update(chatRef, { updatedBy: senderId, updatedAt: new Date().toISOString(), latestMessageText: messageText })
}
