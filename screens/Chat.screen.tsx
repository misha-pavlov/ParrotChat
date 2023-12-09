import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  StyleSheet,
  FlatList as ReactNativeFlatList,
} from "react-native";
import {
  FlatList,
  HStack,
  IconButton,
  Image,
  Input,
  KeyboardAvoidingView,
  View,
} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { useSelector } from "react-redux";
import AwesomeAlert from "react-native-awesome-alerts";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import backgroundImage from "../assets/images/droplet.jpeg";
import { colors } from "../config/colors";
import { RootState } from "../store/store";
import {
  createChat,
  sendImageMessage,
  sendTextMessage,
} from "../utils/actions/chatActions";
import {
  Bubble,
  CustomHeaderButton,
  MessageItem,
  ReplyTo,
} from "../components";
import { getUserName } from "../helpers/userHelpers";
import {
  launchImagePicker,
  openCamera,
  uploadImage as uploadImageHelper,
} from "../utils/imagePickerHelper";

const INITIAL_VALUE = "";

type CustomParamListBase = {
  newChatData: { users: string[]; chatName?: string; isGroupChat?: boolean };
  chatId?: string;
};

type ChatPropsTypes = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

const Chat: FC<ChatPropsTypes> = ({ route, navigation }) => {
  const params = route?.params as CustomParamListBase;
  // states
  const [messageText, setMessageText] = useState(INITIAL_VALUE);
  const [chatUsers, setChatUsers] = useState<string[]>([]);
  const [chatId, setChatId] = useState(params?.chatId);
  const [errorBannerText, setErrorBannerText] = useState("");
  const [replyingTo, setReplyingTo] = useState<
    { text: string; sentBy: string; key: string } | undefined
  >();
  const [tempImageUri, setTempImageUri] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // refs
  const flatListRef = useRef<ReactNativeFlatList>(null);
  // selectors
  const userChats = useSelector((state: RootState) => state.chats.chatsData);
  const chatData = (chatId && userChats[chatId]) || params?.newChatData || {};
  const storedUsers = useSelector(
    (state: RootState) => state.users.storedUsers
  );
  const userData = useSelector((state: RootState) => state.auth.userData);
  const chatMessages = useSelector((state: RootState) => {
    if (!chatId) return [];

    const chatMessagesData = state.messages.messagesData[chatId];

    if (!chatMessagesData) return [];

    const messagesList = [];
    for (const key in chatMessagesData) {
      const message = chatMessagesData[key];
      messagesList.push({ key, ...message });
    }

    return messagesList;
  });

  const userId = userData?.userId;

  const getChatTitleFromName = useMemo(() => {
    if (!chatData?.users) return;

    const otherUserId = chatData.users.find(
      (uid) => uid !== userData?.userId
    ) as string;
    const otherUserData = storedUsers[otherUserId];

    return getUserName(otherUserData);
  }, [userData, storedUsers, chatData]);

  useEffect(() => {
    if (!chatData) return;

    navigation.setOptions({
      headerTitle: chatData.chatName ?? getChatTitleFromName,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          {chatId && (
            <Item
              title="Chat settings"
              iconName="settings-outline"
              onPress={() =>
                chatData?.isGroupChat
                  ? navigation.navigate("ChatSettings", { chatId })
                  : navigation.navigate("Contact", {
                      uid: chatData.users.find(
                        (uid) => uid !== userData?.userId
                      ),
                    })
              }
            />
          )}
        </HeaderButtons>
      ),
    });

    setChatUsers(chatData.users);
  }, [chatData, navigation]);

  const onChangeText = useCallback((value: string) => {
    setMessageText(value);
  }, []);

  const onSendMessage = useCallback(async () => {
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

      if (id && userId) {
        await sendTextMessage(
          id,
          userData,
          messageText,
          chatUsers,
          replyingTo?.key
        );
      }
      setMessageText(INITIAL_VALUE);
      setReplyingTo(undefined);
    } catch (error) {
      console.error(error);
      setErrorBannerText("Message failed to send!");
      setTimeout(() => setErrorBannerText(""), 5000);
    }
  }, [messageText, chatId, params, userData, replyingTo]);

  const pickImage = useCallback(async () => {
    try {
      const tempUri = await launchImagePicker();

      if (!tempUri) return;

      setTempImageUri(tempUri);
    } catch (error) {
      console.error(error);
    }
  }, [tempImageUri]);

  const takePhoto = useCallback(async () => {
    try {
      const tempUri = await openCamera();

      if (!tempUri) return;

      setTempImageUri(tempUri);
    } catch (error) {
      console.error(error);
    }
  }, [tempImageUri]);

  const uploadImage = useCallback(async () => {
    setIsLoading(true);

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

      const uploadUrl = await uploadImageHelper(tempImageUri, true);
      setIsLoading(false);

      if (id && userId) {
        await sendImageMessage(
          id,
          userData,
          uploadUrl,
          chatUsers,
          replyingTo?.key
        );
      }

      setReplyingTo(undefined);
      setTimeout(() => setTempImageUri(""), 500);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }, [tempImageUri, isLoading, chatId, userId, replyingTo]);

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
          {!chatId && <Bubble text="This is new chat!" type="system" />}

          {errorBannerText !== "" && (
            <Bubble text={errorBannerText} type="error" />
          )}

          {chatId && userId && (
            <FlatList
              ref={flatListRef}
              onContentSizeChange={() =>
                flatListRef.current &&
                flatListRef.current.scrollToEnd({ animated: false })
              }
              onLayout={() =>
                flatListRef.current && flatListRef.current.scrollToEnd()
              }
              data={chatMessages}
              p={4}
              renderItem={({ item }) => {
                const message = item;
                const isOwnMessage = message.sendBy === userId;
                let messageType: "myMessage" | "theirMessage" | "info" =
                  isOwnMessage ? "myMessage" : "theirMessage";
                const sender = message.sendBy && storedUsers[message.sendBy];
                const name = sender && getUserName(sender);

                if (message?.type) {
                  messageType = message.type;
                }

                return (
                  <View
                    mb={
                      chatMessages[chatMessages.length - 1].key === message.key
                        ? 5
                        : 2
                    }
                  >
                    <MessageItem
                      text={message.text}
                      type={messageType}
                      messageId={message.key}
                      userId={userId}
                      chatId={chatId}
                      date={message.sentAt}
                      imageUrl={message?.imageUrl}
                      replyingTo={
                        message?.replyId
                          ? chatMessages.find((i) => i.key === message.replyId)
                          : undefined
                      }
                      setReply={() =>
                        setReplyingTo({
                          key: message.key,
                          text: message.text,
                          sentBy: message.sendBy,
                        })
                      }
                      name={
                        !chatData?.isGroupChat || isOwnMessage
                          ? undefined
                          : name
                      }
                    />
                  </View>
                );
              }}
            />
          )}

          {replyingTo && (
            <ReplyTo
              text={replyingTo.text}
              user={storedUsers[replyingTo.sentBy]}
              onCancel={() => setReplyingTo(undefined)}
            />
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
            onPress={pickImage}
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
              onPress={takePhoto}
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

      <AwesomeAlert
        show={tempImageUri !== ""}
        title="Send image?"
        closeOnTouchOutside
        closeOnHardwareBackPress={false}
        showCancelButton
        showConfirmButton
        cancelText="Cancel"
        confirmText="Send image"
        confirmButtonColor={colors.primaryGreen}
        cancelButtonColor={colors.red}
        titleStyle={styles.popupTitleStyle}
        onCancelPressed={() => setTempImageUri("")}
        onConfirmPressed={uploadImage}
        onDismiss={() => setTempImageUri("")}
        customView={
          <View>
            {isLoading && (
              <ActivityIndicator size="small" color={colors.primaryGreen} />
            )}
            {!isLoading && tempImageUri !== "" && (
              <Image
                w={200}
                h={200}
                alt="Selected image"
                source={{ uri: tempImageUri }}
              />
            )}
          </View>
        }
      />
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
  popupTitleStyle: {
    fontFamily: "Quicksand-Medium",
    letterSpacing: 0.3,
    color: colors.textColor,
  },
});

export default Chat;
