import {
  DataSnapshot,
  child,
  get,
  getDatabase,
  push,
  ref,
} from "firebase/database";
import { getFirebaseApp } from "../firebaseHelper";

// TODO: change on chat type
export const createChat = async (userId: string, chatData: any) => {
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
