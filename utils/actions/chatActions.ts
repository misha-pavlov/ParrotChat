import {
  child,
  get,
  getDatabase,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { getFirebaseApp } from "../firebaseHelper";
import { Chat, UpdateChatData } from "../../types/chatTypes";
import { Message } from "../../types/messageTypes";
import { User } from "../../types/userTypes";
import { deleteUserChat, getUserChats } from "./userActions";

export const createChat = async (
  userId: string,
  chatData: Pick<Chat, "users">
) => {
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

export const sendTextMessage = async (
  chatId: string,
  senderId: string,
  messageText: string,
  replyId?: string
) => {
  await sendMessage(chatId, senderId, messageText, undefined, replyId);
};

export const sendImageMessage = async (
  chatId: string,
  senderId: string,
  imageUrl: string,
  replyId?: string
) => {
  await sendMessage(chatId, senderId, "Image", imageUrl, replyId);
};

export const sendInfoMessage = async (
  chatId: string,
  senderId: string,
  messageText: string
) => {
  await sendMessage(
    chatId,
    senderId,
    messageText,
    undefined,
    undefined,
    "info"
  );
};

export const starMessage = async (
  messageId: string,
  chatId: string,
  userId: string
) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const childRef = child(
      dbRef,
      `userStarredMessages/${userId}/${chatId}/${messageId}`
    );

    const snapshot = await get(childRef);

    if (snapshot.exists()) {
      // Starred item exists - Un-star
      await remove(childRef);
    } else {
      // Item does not exists
      const starMessageData = {
        messageId,
        chatId,
        starredAt: new Date().toISOString(),
      };
      await set(childRef, starMessageData);
    }
  } catch (error) {
    console.error(error);
  }
};

const sendMessage = async (
  chatId: string,
  senderId: string,
  messageText: string,
  imageUrl?: string,
  replyId?: string,
  type?: "info"
) => {
  const app = getFirebaseApp();
  const dbRef = ref(getDatabase(app));
  const messagesRef = child(dbRef, `messages/${chatId}`);

  const messageData: Message = {
    sendBy: senderId,
    sentAt: new Date().toISOString(),
    text: messageText,
  };

  if (replyId) {
    messageData.replyId = replyId;
  }

  if (imageUrl) {
    messageData.imageUrl = imageUrl;
  }

  if (type) {
    messageData.type = type;
  }

  await push(messagesRef, messageData);

  const chatRef = child(dbRef, `chats/${chatId}`);
  await update(chatRef, {
    updatedBy: senderId,
    updatedAt: new Date().toISOString(),
    latestMessageText: messageText,
  });
};

export const updateChatData = async (
  chatId: string,
  userId: string,
  chatData: UpdateChatData
) => {
  const app = getFirebaseApp();
  const dbRef = ref(getDatabase(app));
  const chatRef = child(dbRef, `chats/${chatId}`);

  await update(chatRef, {
    ...chatData,
    updatedAt: new Date().toISOString(),
    updatedBy: userId,
  });
};

export const removeUserFromChat = async (
  userLoggedInData: User,
  userToRemoveData: User,
  chatData: Chat
) => {
  const userToRemoveId = userToRemoveData.userId;
  const newUsers = chatData.users.filter((uid) => uid !== userToRemoveId);
  await updateChatData(chatData.key, userLoggedInData.userId, {
    users: newUsers,
  });

  const userChats = await getUserChats(userToRemoveId);

  for (const key in userChats) {
    const currentChatId = userChats[key];

    if (currentChatId === chatData.key) {
      await deleteUserChat(userToRemoveId, key);
      break;
    }
  }

  const messageText = `${userLoggedInData.firstName} removed ${userToRemoveData.firstName} from the chat`;
  await sendInfoMessage(chatData.key, userLoggedInData.userId, messageText);
};
