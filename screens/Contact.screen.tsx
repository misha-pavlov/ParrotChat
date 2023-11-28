import { View, Text, Center } from "native-base";
import { useSelector } from "react-redux";
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { FC, useEffect, useState } from "react";
import { RootState } from "../store/store";
import { DataItem, ProfileImage, ScreenTitle } from "../components";
import { getUserInitials, getUserName } from "../helpers/userHelpers";
import { colors } from "../config/colors";
import { getUserChats } from "../utils/actions/userActions";

type CustomParamListBase = {
  uid: string;
};

type ContactPropsTypes = {
  navigation: NavigationProp<ParamListBase> & {
    push: (screenName: string, params: Record<string, unknown>) => void;
  };
  route: RouteProp<ParamListBase>;
};

const Contact: FC<ContactPropsTypes> = ({ route, navigation }) => {
  const storredUsers = useSelector(
    (state: RootState) => state.users.storedUsers
  );
  const storredChats = useSelector((state: RootState) => state.chats.chatsData);
  const currentUser = storredUsers[(route.params as CustomParamListBase).uid];
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
    </View>
  );
};

export default Contact;
