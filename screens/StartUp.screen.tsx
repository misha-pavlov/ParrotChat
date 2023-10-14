import React, { useEffect } from "react";
import { View } from "native-base";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../config/colors";
import { ASYNC_STORAGE_KEYS } from "../config/constants";
import { useAppDispatch } from "../store/store";
import { authenticate, setDidTryAutoLogin } from "../store/authSlice";
import { getUserData } from "../utils/actions/userActions";

const StartUp = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const userJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.userData);

      if (!userJson) {
        dispatch(setDidTryAutoLogin());
        return;
      }

      const parsedData = JSON.parse(userJson);
      const { token, userId, expiryDate: expiryDateString } = parsedData;
      const expiryDate = new Date(expiryDateString);

      if (expiryDate <= new Date() || !token || !userId) {
        dispatch(setDidTryAutoLogin());
        return;
      }

      const userData = await getUserData(userId);
      dispatch(authenticate({ token, userData }));
    };

    tryLogin();
  }, []);

  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <ActivityIndicator size="large" color={colors.primaryGreen} />
    </View>
  );
};

export default StartUp;
