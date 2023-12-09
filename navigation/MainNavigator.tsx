import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { child, get, getDatabase, off, onValue, ref } from "firebase/database";
import { ActivityIndicator, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { StackActions, useNavigation } from "@react-navigation/native";
import {
  Chat,
  ChatList,
  ChatSettings,
  Contact,
  DataList,
  NewChat,
  Settings,
} from "../screens";
import { RootState, useAppDispatch } from "../store/store";
import { getFirebaseApp } from "../utils/firebaseHelper";
import { Chat as ChatType } from "../types/chatTypes";
import { setChatData } from "../store/chatSlice";
import { colors } from "../config/colors";
import { setStoredUsers } from "../store/userSlice";
import { setChatMessages, setStarredMessages } from "../store/messagesSlice";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerTitle: "", headerShadowVisible: false }}
    >
      <Tab.Screen
        name="ChatList"
        component={ChatList}
        options={{
          tabBarLabel: "Chats",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
    <Stack.Group>
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{ headerTitle: "Chat List", headerShown: false }}
      />
      <Stack.Screen
        name="ChatSettings"
        component={ChatSettings}
        options={{
          headerTitle: "",
          headerBackTitle: "Back",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          headerTitle: "",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="Contact"
        component={Contact}
        options={{
          headerTitle: "Contact info",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="DataList"
        component={DataList}
        options={{
          headerTitle: "",
          headerBackTitle: "Back",
        }}
      />
    </Stack.Group>

    <Stack.Group screenOptions={{ presentation: "modal" }}>
      <Stack.Screen name="NewChat" component={NewChat} />
    </Stack.Group>
  </Stack.Navigator>
);

const MainNavigator = () => {
  const userData = useSelector((state: RootState) => state.auth.userData);
  const storedUsers = useSelector(
    (state: RootState) => state.users.storedUsers
  );

  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const notificationListener: React.MutableRefObject<Notifications.Subscription | null> =
    useRef(null);
  const responseListener: React.MutableRefObject<Notifications.Subscription | null> =
    useRef(null);
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // Handle recived notification
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { data } = response.notification.request.content;
        const chatId: string = data.chatId;

        if (chatId) {
          const pushAction = StackActions.push("Chat", { chatId });
          navigation.dispatch(pushAction);
        } else {
          console.log("No chat id");
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current as Notifications.Subscription
      );
      Notifications.removeNotificationSubscription(
        responseListener.current as Notifications.Subscription
      );
    };
  }, []);

  useEffect(() => {
    console.log("Subscribe to user chats");
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userChatsRef = child(dbRef, `userChats/${userData?.userId}`);
    const refs = [userChatsRef];

    onValue(userChatsRef, (querySnapshot) => {
      const chatIdData = querySnapshot.val() || {};
      const chatIds = Object.values(chatIdData);
      const chatsData: { [key: string]: ChatType } = {};
      let chatsFoundCount = 0;

      for (let i = 0; i < chatIds.length; i++) {
        const chatId = chatIds[i];
        const chatRef = child(dbRef, `chats/${chatId}`);
        refs.push(chatRef);

        onValue(chatRef, (chatSnapshot) => {
          chatsFoundCount++;
          const data = chatSnapshot.val();

          if (!data.users.includes(userData?.userId)) {
            return;
          }

          const key = chatSnapshot.key;

          data.users.forEach((uid: string) => {
            if (storedUsers[uid]) return;

            const userRef = child(dbRef, `users/${uid}`);
            get(userRef).then((userSnapshot) => {
              const userSnapshotData = userSnapshot.val();
              dispatch(setStoredUsers({ users: { userSnapshotData } }));
            });

            refs.push(userRef);
          });

          if (data && key) {
            chatsData[key] = { ...data, key };
          }

          if (chatsFoundCount >= chatIds.length) {
            setIsLoading(false);
            dispatch(setChatData({ chatsData }));
          }
        });

        const messagesRef = child(dbRef, `messages/${chatId}`);
        refs.push(messagesRef);

        onValue(messagesRef, (messagesSnapshot) => {
          const messagesData = messagesSnapshot.val();
          dispatch(setChatMessages({ chatId, messagesData }));
        });

        if (chatsFoundCount === 0) {
          setIsLoading(false);
        }
      }
    });

    const userStarredMessagesRef = child(
      dbRef,
      `userStarredMessages/${userData?.userId}`
    );
    refs.push(userStarredMessagesRef);

    onValue(userStarredMessagesRef, (querySnapshot) => {
      const starredMessages = querySnapshot.val() ?? {};
      dispatch(setStarredMessages({ starredMessages }));
    });

    () => {
      console.log("Unsubscribe to user chats");
      refs.forEach((ref) => off(ref));
    };
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.primaryGreen} />;
  }

  return <StackNavigator />;
};

export default MainNavigator;

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    if (Constants?.expoConfig?.extra) {
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.eas.projectId,
        })
      ).data;
    }
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return token;
}
