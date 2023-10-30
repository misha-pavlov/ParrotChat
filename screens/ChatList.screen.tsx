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

type CustomParamListBase = ParamListBase & {
  params: {
    selectedUserId?: string;
  };
};

type ChatListPropsTypes = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<CustomParamListBase>;
};

const ChatList: FC<ChatListPropsTypes> = ({ navigation, route }) => {
  const selectedUserId = (route?.params as { selectedUserId?: string })
    ?.selectedUserId;
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
    navigation.navigate("Chat", { users: chatUsers });
  }, [selectedUserId, navigation, userData]);

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
