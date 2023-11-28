import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { FC, useEffect, useLayoutEffect } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector } from "react-redux";
import { Divider, FlatList, Pressable, View, Text } from "native-base";
import { CustomHeaderButton, DataItem, ScreenTitle } from "../components";
import { RootState } from "../store/store";
import { Chat } from "../types/chatTypes";
import { getUserInitials, getUserName } from "../helpers/userHelpers";
import { colors } from "../config/colors";

type CustomParamListBase = {
  selectedUserId?: string;
  chatName?: string;
  selectedUsers?: string[];
};

type ChatListPropsTypes = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

const ChatList: FC<ChatListPropsTypes> = ({ navigation, route }) => {
  const selectedUserId = (route?.params as CustomParamListBase)?.selectedUserId;
  const selectedUsers = (route?.params as CustomParamListBase)?.selectedUsers;
  const chatName = (route?.params as CustomParamListBase)?.chatName;

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
    if (!selectedUserId && !selectedUsers) {
      return;
    }

    let chatData;
    let navigationProps;

    if (selectedUserId) {
      chatData = userChats.find(
        (uc) => !uc.isGroupChat && uc.users.includes(selectedUserId)
      );
    }

    if (chatData) {
      navigationProps = { chatId: chatData.key };
    } else {
      const chatUsers = selectedUsers || [selectedUserId];

      if (!chatUsers.includes(userData?.userId)) {
        chatUsers.push(userData?.userId);
      }

      navigationProps = {
        newChatData: {
          users: chatUsers,
          isGroupChat: !!selectedUsers,
          chatName,
        },
      };

      if (chatName) {
        navigationProps.newChatData.chatName = chatName;
      }
    }

    navigation.navigate("Chat", navigationProps);
  }, [selectedUserId, navigation, userData, route, selectedUsers, chatName]);

  return (
    <View px="20px" backgroundColor={colors.white} flex={1}>
      <ScreenTitle text="Chats" />

      <Pressable
        _pressed={{ opacity: 0.5 }}
        onPress={() => navigation.navigate("NewChat", { isGroupChat: true })}
      >
        <Text color={colors.primaryBlue} fontSize={17} mb={1}>
          New group
        </Text>
      </Pressable>

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
          const isGroupChat = item?.isGroupChat;

          if (!otherUser) return null;

          const title = isGroupChat ? item?.chatName : getUserName(otherUser);
          const subTitle = item.latestMessageText || "New chat";

          return (
            <DataItem
              title={title || ""}
              userId={otherUser.userId}
              subTitle={subTitle}
              userInitials={
                isGroupChat ? undefined : getUserInitials(otherUser)
              }
              image={isGroupChat ? item?.chatImage : otherUser.profilePicture}
              onPress={() => navigation.navigate("Chat", { chatId })}
            />
          );
        }}
      />
    </View>
  );
};

export default ChatList;
