// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

export const getFirebaseApp = () => {
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyA50fTz5_tGe6V5-7Axl8NgsN1JliHi0Uc",
    authDomain: "parrotchat-e401c.firebaseapp.com",
    projectId: "parrotchat-e401c",
    storageBucket: "parrotchat-e401c.appspot.com",
    messagingSenderId: "465373067723",
    appId: "1:465373067723:web:37d9c5cb2d631bc4be9e4e",
    measurementId: "G-F946HFGDK0",
  };

  // Initialize Firebase
  return initializeApp(firebaseConfig);
};
