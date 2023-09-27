import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import { FC } from "react";
import { View, Text } from "react-native";

type ChatListPropsTypes = {
  navigation: StackNavigationHelpers;
};

const ChatList: FC<ChatListPropsTypes> = ({ navigation }) => {
  return (
    <View>
      <Text style={{ color: "red" }} onPress={() => navigation.navigate('ChatSettings')}>ChatList</Text>
    </View>
  );
};

export default ChatList;
