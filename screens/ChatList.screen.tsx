import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { FC, useEffect, useLayoutEffect } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector } from "react-redux";
import { Divider, FlatList, View } from "native-base";
import { CustomHeaderButton, DataItem, ScreenTitle } from "../components";
import { RootState } from "../store/store";
import { Chat } from "../types/chatTypes";
import { getUserInitials } from "../helpers/userHelpers";
import { colors } from "../config/colors";

type CustomParamListBase = {
  selectedUserId?: string;
};

type ChatListPropsTypes = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

const ChatList: FC<ChatListPropsTypes> = ({ navigation, route }) => {
  const selectedUserId = (route?.params as CustomParamListBase)?.selectedUserId;
  const userData = useSelector((state: RootState) => state.auth.userData);
  const userChats = useSelector((state: RootState) =>
    Object.values(state.chats.chatsData).sort(
      (a, b) => Number(new Date(b.updatedAt)) - Number(new Date(a.updatedAt))
    )
  );
  const storedUsers = useSelector(
    (state: RootState) => state.users.storedUsers
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="New chat"
            iconName="create-outline"
            onPress={() => navigation.navigate("NewChat")}
          />
        </HeaderButtons>
      ),
    });
  }, []);

  useEffect(() => {
    if (!selectedUserId) {
      return;
    }

    const chatUsers = [selectedUserId, userData?.userId];
    const navigationProps = { newChatData: { users: chatUsers } };
    navigation.navigate("Chat", navigationProps);
  }, [selectedUserId, navigation, userData, route]);

  return (
    <View px="20px" backgroundColor={colors.white} flex={1}>
      <ScreenTitle text="Chats" />
      <FlatList
        data={userChats}
        ItemSeparatorComponent={() => (
          <Divider height={0.3} backgroundColor={colors.lightGrey} my={2} />
        )}
        renderItem={({ item }: { item: Chat }) => {
          const otherUserId = item.users.find(
            (uid) => uid !== userData?.userId
          ) as string;
          const otherUser = storedUsers[otherUserId];
          const chatId = item.key;

          if (!otherUser) return null;

          const title = `${otherUser.firstName} ${otherUser.lastName}`;
          const subTitle = item.latestMessageText || 'New chat';

          return (
            <DataItem
              title={title}
              userId={otherUser.userId}
              subTitle={subTitle}
              userInitials={getUserInitials(otherUser)}
              image={otherUser.profilePicture}
              onPress={() => navigation.navigate("Chat", { chatId })}
            />
          );
        }}
      />
    </View>
  );
};

export default ChatList;
