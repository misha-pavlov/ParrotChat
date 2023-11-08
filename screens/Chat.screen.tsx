import { ImageBackground, Platform, StyleSheet } from "react-native";
import {
  Center,
  HStack,
  IconButton,
  Input,
  KeyboardAvoidingView,
  Text,
} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { useSelector } from "react-redux";
import backgroundImage from "../assets/images/droplet.jpeg";
import { colors } from "../config/colors";
import { RootState } from "../store/store";
import { createChat, sendTextMessage } from "../utils/actions/chatActions";

const INITIAL_VALUE = "";

type CustomParamListBase = {
  newChatData: { users: string[] };
  chatId?: string;
};

type ChatPropsTypes = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

const Chat: FC<ChatPropsTypes> = ({ route, navigation }) => {
  const params = route?.params as CustomParamListBase;
  const [messageText, setMessageText] = useState(INITIAL_VALUE);
  const [chatUsers, setChatUsers] = useState<string[]>([]);
  const [chatId, setChatId] = useState(params?.chatId);

  const userChats = useSelector((state: RootState) => state.chats.chatsData);
  const chatData = (chatId && userChats[chatId]) || params?.newChatData;

  const storedUsers = useSelector(
    (state: RootState) => state.users.storedUsers
  );
  const userData = useSelector((state: RootState) => state.auth.userData);
  const messagesData = useSelector(
    (state: RootState) => state.messages.messagesData
  );

  const getChatTitleFromName = useMemo(() => {
    const otherUserId = chatData.users.find(
      (uid) => uid !== userData?.userId
    ) as string;
    const otherUserData = storedUsers[otherUserId];

    return `${otherUserData.firstName} ${otherUserData.lastName}`;
  }, [userData, storedUsers, chatData]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: getChatTitleFromName,
    });

    setChatUsers(chatData.users);
  }, [chatData, getChatTitleFromName, navigation]);

  const onChangeText = useCallback((value: string) => {
    setMessageText(value);
  }, []);

  const onSendMessage = useCallback(async () => {
    console.log("messageText = ", messageText.trim());

    try {
      let id = chatId;
      const userId = userData?.userId;

      if (!id) {
        // no chat id create the chat
        if (userId) {
          id = await createChat(userId, params.newChatData);
          setChatId(id);
        }
      }

      if (chatId && userId) {
        await sendTextMessage(chatId, userId, messageText);
      }
    } catch (error) {
      console.error(error);
    }

    setMessageText(INITIAL_VALUE);
  }, [messageText, chatId, params, userData]);

  return (
    <SafeAreaView
      edges={["right", "left", "bottom"]}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        flex={1}
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={100}
        position="relative"
      >
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
        >
          {!chatId && (
            <Center
              position="absolute"
              backgroundColor={colors.lightGrey}
              w="90%"
              top={4}
              left={4}
              right={4}
              borderRadius={5}
            >
              <Text>This is new chat!</Text>
            </Center>
          )}
        </ImageBackground>

        <HStack
          justifyContent="space-around"
          alignItems="center"
          paddingY="8px"
          paddingX="12px"
        >
          <IconButton
            icon={<Feather name="plus" size={24} color={colors.primaryBlue} />}
            onPress={() => console.log("image")}
          />

          <Input
            flex={1}
            borderRadius={50}
            borderColor={colors.lightGrey}
            marginX={15}
            paddingX={12}
            _focus={styles._focus}
            value={messageText}
            onChangeText={onChangeText}
            onSubmitEditing={onSendMessage}
          />

          {messageText === INITIAL_VALUE ? (
            <IconButton
              icon={
                <Feather name="camera" size={24} color={colors.primaryBlue} />
              }
              onPress={() => console.log("camera")}
            />
          ) : (
            <IconButton
              icon={<Feather name="send" size={20} color={colors.white} />}
              onPress={onSendMessage}
              backgroundColor={colors.primaryBlue}
              borderRadius="full"
              p="8px"
              w={35}
              _pressed={styles._pressed}
            />
          )}
        </HStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  _focus: {
    backgroundColor: "transparent",
    borderColor: colors.lightGrey,
  },
  _pressed: {
    opacity: 0.5,
  },
});

export default Chat;
