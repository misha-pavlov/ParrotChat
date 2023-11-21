import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import uuid from "react-native-uuid";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { getFirebaseApp } from "./firebaseHelper";

const checkMediaPermissions = async () => {
  if (Platform.OS !== "web") {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      return Promise.reject("We need permission to access your photos.");
    }
  }

  return Promise.resolve();
};

export const launchImagePicker = async () => {
  await checkMediaPermissions();

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
};

export const uploadImage = async (uri: string, isChatImage = false) => {
  const app = getFirebaseApp();
  const blob: Blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };

    xhr.onerror = function (e) {
      console.error(e);
      reject(new TypeError("Network request failed!"));
    };

    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send();
  });

  const pathFolder = isChatImage ? 'chatImages' : "profilePics";
  const storageRef = ref(getStorage(app), `${pathFolder}/${uuid.v4()}`);

  await uploadBytesResumable(storageRef, blob);

  // @ts-ignore - because blob actually has close function
  blob.close();

  return getDownloadURL(storageRef);
};
