import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { FC, useLayoutEffect } from "react";
import { View, Text } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { CustomHeaderButton } from "../components";

type ChatListPropsTypes = {
  navigation: NavigationProp<ParamListBase>;
};

const ChatList: FC<ChatListPropsTypes> = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="New chat"
            iconName="create-outline"
            onPress={() => navigation.navigate('NewChat')}
          />
        </HeaderButtons>
      ),
    });
  }, []);

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
