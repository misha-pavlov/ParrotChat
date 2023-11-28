import { ParamListBase, RouteProp } from "@react-navigation/native";
import { FC, useCallback, useMemo, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Center, ScrollView, View, useToast } from "native-base";
import { ActivityIndicator } from "react-native";
import { RootState } from "../store/store";
import { LoginInput, ProfileImage, ScreenTitle } from "../components";
import { colors } from "../config/colors";
import { settingsReducer } from "../utils/reducers/settingsReducer";
import { validateLength } from "../utils/validation";
import { updateChatData } from "../utils/actions/chatActions";

type CustomParamListBase = {
  chatId: string;
};

type ChatSettingsPropsTypes = {
  route: RouteProp<ParamListBase>;
};

const ChatSettings: FC<ChatSettingsPropsTypes> = ({ route }) => {
  const chatId = (route?.params as CustomParamListBase).chatId;
  const chatData = useSelector(
    (state: RootState) => state.chats.chatsData[chatId]
  );
  const userData = useSelector((state: RootState) => state.auth.userData);

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

  const onChange = useCallback(
    (inputId: string, inputValue: string) => {
      const validationResult = validateLength(inputId, inputValue, 5, 50, false);
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
          errorText={formState.inputValidities['chatName']}
        />

        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primaryGreen} />
        ) : (
          hasChanges && (
            <Button
              backgroundColor={colors.primaryGreen}
              borderRadius={30}
              _pressed={{ opacity: 0.5 }}
              mt="20px"
              isDisabled={!formState.formIsValid}
              onPress={saveHandler}
            >
              Save
            </Button>
          )
        )}
      </ScrollView>
    </View>
  );
};

export default ChatSettings;
