import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { child, getDatabase, ref, set } from "firebase/database";
import { AnyAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOGIN_IDS, ASYNC_STORAGE_KEYS } from "../../config/constants";
import { getFirebaseApp } from "../firebaseHelper";
import { authenticate } from "../../store/authSlice";
import { getUserData } from "./userActions";

export const signUp = (params: typeof LOGIN_IDS) => {
  return async (dispatch: (action: AnyAction) => AnyAction) => {
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

      dispatch(authenticate({ token: accessToken, userData }));
      saveDataToStorage(accessToken, uid, expiryDate);
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
  return async (dispatch: (action: AnyAction) => AnyAction) => {
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

      dispatch(authenticate({ token: accessToken, userData }));
      saveDataToStorage(accessToken, uid, expiryDate);
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

type CreateUserParamsType = {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
};

const createUser = async (params: CreateUserParamsType) => {
  const { firstName, lastName, email, userId } = params;
  const firstLast = `${firstName} ${lastName}`;
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
