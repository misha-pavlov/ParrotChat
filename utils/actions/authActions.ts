import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  child,
  get,
  getDatabase,
  push,
  ref,
  set,
  update,
} from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { LOGIN_IDS, ASYNC_STORAGE_KEYS } from "../../config/constants";
import { getFirebaseApp } from "../firebaseHelper";
import { authenticate, logout } from "../../store/authSlice";
import { getUserData } from "./userActions";
import { AppDispatch } from "../../store/store";
import { getUserName } from "../../helpers/userHelpers";
import { User } from "../../types/userTypes";

let timer: NodeJS.Timeout;

export const signUp = (params: typeof LOGIN_IDS) => {
  return async (dispatch: AppDispatch) => {
    const { email, password, firstName, lastName } = params;
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // @ts-ignore according type stsTokenManager doesn't exist, but acually it does
      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;

      const expiryDate = new Date(expirationTime);
      const userData = await createUser({
        firstName,
        lastName,
        email,
        userId: uid,
      });
      const timeNow = new Date();
      const millisecondsUntilExpiry = Number(expiryDate) - Number(timeNow);

      dispatch(authenticate({ token: accessToken, userData }));
      saveDataToStorage(accessToken, uid, expiryDate);
      await storePushToken(userData);

      timer = setTimeout(() => {
        dispatch(userLogout(userData));
      }, millisecondsUntilExpiry);
    } catch (error) {
      const errorCode = (error as { code: string }).code;
      let message = "Something went wrong";

      if (errorCode === "auth/email-already-in-use") {
        message = "This email is already in use";
      }

      throw new Error(message);
    }
  };
};

export const signIn = (
  params: Pick<typeof LOGIN_IDS, "email" | "password">
) => {
  return async (dispatch: AppDispatch) => {
    const { email, password } = params;
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // @ts-ignore according type stsTokenManager doesn't exist, but acually it does
      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;

      const expiryDate = new Date(expirationTime);
      const userData = await getUserData(uid);
      const timeNow = new Date();
      const millisecondsUntilExpiry = Number(expiryDate) - Number(timeNow);

      dispatch(authenticate({ token: accessToken, userData }));
      saveDataToStorage(accessToken, uid, expiryDate);
      await storePushToken(userData);

      timer = setTimeout(() => {
        dispatch(userLogout(userData));
      }, millisecondsUntilExpiry);
    } catch (error) {
      const errorCode = (error as { code: string }).code;
      let message = "Something went wrong";

      if (errorCode === "auth/invalid-login-credentials") {
        message = "The username or password was incorrect";
      }

      throw new Error(message);
    }
  };
};

export const userLogout = (userData: User) => {
  return async (dispatch: AppDispatch) => {
    try {
      await removePushToken(userData);
    } catch (error) {
      console.error(error);
    }
    AsyncStorage.clear();
    clearTimeout(timer);
    dispatch(logout());
  };
};

export const updateUserData = async (userId: string, newData: any) => {
  if (newData.firstName && newData.lastName) {
    const firstLast = getUserName(newData as User).toLowerCase();
    newData.firstLast = firstLast;
  }

  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `users/${userId}`);
  await update(childRef, newData);
};

type CreateUserParamsType = {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
};

const createUser = async (params: CreateUserParamsType) => {
  const { firstName, lastName, email, userId } = params;
  const firstLast = getUserName(params as User).toLowerCase();
  const userData = {
    firstName,
    lastName,
    firstLast,
    email,
    userId,
    signUpDate: new Date().toISOString(),
  };

  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `users/${userId}`);
  await set(childRef, userData);

  return userData;
};

const saveDataToStorage = (token: string, userId: string, expiryDate: Date) =>
  AsyncStorage.setItem(
    ASYNC_STORAGE_KEYS.userData,
    JSON.stringify({
      token,
      userId,
      expiryDate,
    })
  );

const storePushToken = async (userData: User) => {
  if (!Device.isDevice) return;

  if (Constants?.expoConfig?.extra) {
    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;

    const tokenData = { ...userData.pushTokens } || {};
    const tokenArray = Object.values(tokenData);

    if (tokenArray.includes(token)) return;

    tokenArray.push(token);

    for (let i = 0; i < tokenArray.length; i++) {
      const tok = tokenArray[i];
      tokenData[i] = tok;
    }

    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `users/${userData.userId}/pushTokens`);

    try {
      await set(userRef, tokenData);
    } catch (error) {
      console.error(error);
    }
  }
};

const removePushToken = async (userData: User) => {
  if (!Device.isDevice) return;

  if (Constants?.expoConfig?.extra) {
    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;

    const tokenData = await getUserPushTokens(userData.userId);

    for (const key in tokenData) {
      if (tokenData[key] === token) {
        delete tokenData[key];
        break;
      }
    }

    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `users/${userData.userId}/pushTokens`);

    try {
      await set(userRef, tokenData);
    } catch (error) {
      console.error(error);
    }
  }
};

export const getUserPushTokens = async (userId: string) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `users/${userId}/pushTokens`);
    const snapshot = await get(userRef);

    if (!snapshot || !snapshot.exists) return {};

    return snapshot.val() || {};
  } catch (error) {
    console.error(error);
  }
};
