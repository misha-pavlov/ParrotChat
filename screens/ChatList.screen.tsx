import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { FC, useEffect, useLayoutEffect } from "react";
import { View, Text } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector } from "react-redux";
import { CustomHeaderButton } from "../components";
import { RootState } from "../store/store";

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
    <View>
      <Text
        style={{ color: "red" }}
        onPress={() => navigation.navigate("Chat")}
      >
        Chat
      </Text>
    </View>
  );
};

export default ChatList;
