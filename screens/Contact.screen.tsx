import { View, Text, Center, Button } from "native-base";
import { useSelector } from "react-redux";
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { FC, useCallback, useEffect, useState } from "react";
import { RootState } from "../store/store";
import { DataItem, ProfileImage, ScreenTitle } from "../components";
import { getUserInitials, getUserName } from "../helpers/userHelpers";
import { colors } from "../config/colors";
import { getUserChats } from "../utils/actions/userActions";
import { removeUserFromChat } from "../utils/actions/chatActions";

type CustomParamListBase = {
  uid: string;
  chatId?: string;
};

type ContactPropsTypes = {
  navigation: NavigationProp<ParamListBase> & {
    push: (screenName: string, params: Record<string, unknown>) => void;
  };
  route: RouteProp<ParamListBase>;
};

const Contact: FC<ContactPropsTypes> = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector((state: RootState) => state.auth.userData);
  const storredUsers = useSelector(
    (state: RootState) => state.users.storedUsers
  );
  const storredChats = useSelector((state: RootState) => state.chats.chatsData);
  const currentUser = storredUsers[(route.params as CustomParamListBase).uid];
  const chatId = (route.params as CustomParamListBase)?.chatId;
  const chatData = chatId && storredChats[chatId];

  const [commonChats, setCommonChats] = useState<string[]>([]);

  useEffect(() => {
    const getCommonUserChats = async () => {
      const currentUserChats: Record<string, string> = await getUserChats(
        currentUser.userId
      );
      setCommonChats(
        Object.values(currentUserChats).filter(
          (cid: string) => storredChats[cid] && storredChats[cid]?.isGroupChat
        )
      );
    };

    getCommonUserChats();
  }, []);

  const removeFromChat = useCallback(async () => {
    try {
      setIsLoading(true);

      if (userData && chatData) {
        await removeUserFromChat(userData, currentUser, chatData);
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [navigation, isLoading]);

  return (
    <View px="20px">
      <Center my="20px">
        <ProfileImage
          size="lg"
          showEditButton={false}
          userId={currentUser.userId}
          uri={currentUser?.profilePicture}
          userInitials={getUserInitials(currentUser)}
        />

        <ScreenTitle text={getUserName(currentUser)} />

        {currentUser?.about && (
          <Text
            numberOfLines={2}
            fontFamily="Quicksand-Medium"
            fontSize={16}
            letterSpacing={0.3}
            color={colors.grey}
          >
            {currentUser.about}
          </Text>
        )}
      </Center>

      {commonChats.length > 0 && (
        <>
          <Text
            fontFamily="Quicksand-Bold"
            letterSpacing={0.3}
            color={colors.textColor}
            my={2}
          >
            {commonChats.length}
            {commonChats.length === 1 ? " Group " : " Groups "}
            in common
          </Text>

          {commonChats.map((cid) => {
            const chatData = storredChats[cid];
            return (
              <DataItem
                type="link"
                image={chatData?.chatImage}
                key={chatData.key}
                userId={currentUser.userId}
                title={chatData?.chatName || ""}
                subTitle={chatData.latestMessageText}
                onPress={() => navigation.push("Chat", { chatId: cid })}
              />
            );
          })}
        </>
      )}

      {chatData && chatData?.isGroupChat && (
        <Button
          backgroundColor={colors.red}
          borderRadius={30}
          _pressed={{ opacity: 0.5 }}
          mt="20px"
          onPress={removeFromChat}
          isLoading={isLoading}
        >
          Remove from chat
        </Button>
      )}
    </View>
  );
};

export default Contact;
