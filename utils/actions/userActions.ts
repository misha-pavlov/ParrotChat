import {
  child,
  endAt,
  get,
  getDatabase,
  orderByChild,
  push,
  query,
  ref,
  remove,
  startAt,
} from "firebase/database";
import { getFirebaseApp } from "../firebaseHelper";

export const getUserData = async (userId: string) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `users/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.val();
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = async (queryText: string) => {
  const searchTerm = queryText.toLowerCase();

  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, "users");

    const queryRef = query(
      userRef,
      orderByChild("firstLast"),
      startAt(searchTerm),
      endAt(searchTerm + "\uf8ff")
    );
    const snapshot = await get(queryRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }

    return {};
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserChats = async (userId: string) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userChatsRef = child(dbRef, `userChats/${userId}`);
    const snapshot = await get(userChatsRef);
    return snapshot.val();
  } catch (error) {
    console.error(error);
  }
};

export const deleteUserChat = async (userId: string, key: string) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const chatRef = child(dbRef, `userChats/${userId}/${key}`);
    await remove(chatRef);
  } catch (error) {
    console.error(error);
  }
};

export const addUserChat = async (userId: string, chatId: string) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const chatRef = child(dbRef, `userChats/${userId}`);
    await push(chatRef, chatId);
  } catch (error) {
    console.error(error);
  }
};