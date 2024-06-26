import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Center,
  Divider,
  ScrollView,
  Text,
  View,
  useToast,
} from "native-base";
import { RootState } from "../store/store";
import { DataItem, LoginInput, ProfileImage, ScreenTitle } from "../components";
import { colors } from "../config/colors";
import { settingsReducer } from "../utils/reducers/settingsReducer";
import { validateLength } from "../utils/validation";
import {
  addUsersToChat,
  removeUserFromChat,
  updateChatData,
} from "../utils/actions/chatActions";
import { getUserName } from "../helpers/userHelpers";
import { User } from "../types/userTypes";

type CustomParamListBase = {
  chatId: string;
  selectedUsers?: string[];
};

type ChatSettingsPropsTypes = {
  navigation: NavigationProp<ParamListBase> & { popToTop: VoidFunction };
  route: RouteProp<ParamListBase>;
};

const ChatSettings: FC<ChatSettingsPropsTypes> = ({ route, navigation }) => {
  const chatId = (route?.params as CustomParamListBase).chatId;
  const selectedUsers = (route?.params as CustomParamListBase).selectedUsers;
  const chatData = useSelector(
    (state: RootState) => state.chats.chatsData[chatId] || {}
  );
  const userData = useSelector((state: RootState) => state.auth.userData);
  const storredUsers = useSelector(
    (state: RootState) => state.users.storedUsers
  );
  const starredMessages = useSelector((state: RootState) =>
    chatId ? state.messages.starredMessages[chatId] || {} : {}
  );

  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const initialState = {
    inputValues: {
      chatName: chatData?.chatName || "",
    },
    inputValidities: {
      chatName: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(
    settingsReducer,
    initialState
  );

  useEffect(() => {
    if (!selectedUsers) return;

    const abortController = new AbortController();
    const updateChatUsers = async () => {
      const selectedUsersData: User[] = [];

      selectedUsers.forEach((uid) => {
        if (uid === userData?.userId) return;

        if (!storredUsers[uid]) {
          console.log("No user data found");
          return;
        }

        selectedUsersData.push(storredUsers[uid]);
      });

      if (userData) {
        await addUsersToChat(userData, selectedUsersData, chatData);
      }
    };

    updateChatUsers();

    return () => {
      abortController.abort();
    };
  }, [selectedUsers]);

  const onChange = useCallback(
    (inputId: string, inputValue: string) => {
      const validationResult = validateLength(
        inputId,
        inputValue,
        5,
        50,
        false
      );
      dispatchFormState({ inputId, validationResult, inputValue });
    },
    [dispatchFormState]
  );

  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;
    const userId = userData?.userId;

    try {
      setIsLoading(true);

      if (userId) {
        await updateChatData(chatId, userId, updatedValues);
        toast.show({
          description: "Saved!",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [formState, userData]);

  const hasChanges = useMemo(() => {
    const currentValues = formState.inputValues;
    return currentValues.chatName !== chatData?.chatName;
  }, [formState, chatData]);

  const leaveChat = useCallback(async () => {
    try {
      setIsLoading(true);

      if (userData && chatData) {
        await removeUserFromChat(userData, userData, chatData);
      }

      navigation.popToTop();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [navigation, isLoading]);

  if (!chatData?.users) return null;

  return (
    <View px="20px" backgroundColor={colors.white} flex={1}>
      <ScreenTitle text="Chat Settings" />

      <ScrollView>
        <Center>
          <ProfileImage
            size="lg"
            uri={chatData?.chatImage}
            chatId={chatData.key}
            userId={userData?.userId}
          />
        </Center>

        <LoginInput
          inputId="chatName"
          label="Chat name"
          autoCapitalize="none"
          defaultValue={chatData?.chatName}
          onChange={onChange}
          errorText={formState.inputValidities["chatName"]}
        />

        <View width="100%" mt="10px">
          <Text
            my={2}
            color={colors.textColor}
            fontFamily="Quicksand-Bold"
            letterSpacing={0.3}
          >
            {chatData.users.length} Participants
          </Text>

          {userData?.userId && (
            <DataItem
              title="Add users"
              icon="plus"
              userId={userData?.userId}
              type="button"
              onPress={() =>
                navigation.navigate("NewChat", {
                  existingUsers: chatData.users,
                  chatId,
                  isGroupChat: true,
                })
              }
            />
          )}

          <Divider h="1px" backgroundColor={colors.lightGrey} mt={2} mb={2} />

          {chatData.users.slice(0, 4).map((uid, index, array) => {
            const currentUser = storredUsers[uid];
            const isMe = uid === userData?.userId;
            return (
              <Fragment key={uid}>
                <DataItem
                  image={currentUser?.profilePicture}
                  title={getUserName(currentUser)}
                  subTitle={currentUser.about}
                  type={!isMe ? "link" : undefined}
                  userId={uid}
                  onPress={
                    !isMe
                      ? () => navigation.navigate("Contact", { uid, chatId })
                      : undefined
                  }
                />
                {index !== array.length - 1 && (
                  <Divider
                    h="1px"
                    backgroundColor={colors.lightGrey}
                    mt={2}
                    mb={2}
                  />
                )}
              </Fragment>
            );
          })}

          {chatData.users.length > 4 && (
            <>
              <Divider
                h="1px"
                backgroundColor={colors.lightGrey}
                mt={2}
                mb={2}
              />
              <DataItem
                type="link"
                title="View all"
                icon="search1"
                userId=""
                onPress={() =>
                  navigation.navigate("DataList", {
                    title: "Participants",
                    data: chatData.users,
                    type: "users",
                    chatId,
                  })
                }
              />
            </>
          )}
        </View>

        {hasChanges && (
          <Button
            backgroundColor={colors.primaryGreen}
            borderRadius={30}
            _pressed={{ opacity: 0.5 }}
            mt="20px"
            isDisabled={!formState.formIsValid}
            onPress={saveHandler}
            isLoading={isLoading}
          >
            Save
          </Button>
        )}

        <View>
          <Divider h="1px" backgroundColor={colors.lightGrey} mt={2} mb={2} />
          <DataItem
            type="link"
            title="Starred messages"
            icon="star"
            userId=""
            onPress={() =>
              navigation.navigate("DataList", {
                title: "Starred messages",
                data: Object.values(starredMessages),
                type: "messages",
              })
            }
          />
        </View>
      </ScrollView>

      <Button
        backgroundColor={colors.red}
        borderRadius={30}
        _pressed={{ opacity: 0.5 }}
        onPress={leaveChat}
        isLoading={isLoading}
        mb={10}
      >
        Leave chat
      </Button>
    </View>
  );
};

export default ChatSettings;
