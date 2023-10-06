import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { child, getDatabase, ref, set } from "firebase/database";
import { LOGIN_IDS } from "../../config/constants";
import { getFirebaseApp } from "../firebaseHelper";

export const signUp = async (params: typeof LOGIN_IDS) => {
  const { email, password, firstName, lastName } = params;
  const app = getFirebaseApp();
  const auth = getAuth(app);

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = result.user;

    const userData = await createUser({
      firstName,
      lastName,
      email,
      userId: uid,
    });
    console.log("🚀 ~ file: authActions.ts:15 ~ signUp ~ userData:", userData);
  } catch (error) {
    const errorCode = (error as { code: string }).code;
    let message = "Something went wrong";

    if (errorCode === "auth/email-already-in-use") {
      message = "This email is already in use";
    }

    throw new Error(message);
  }
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
