import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { FC, useLayoutEffect } from "react";
import { View, Text } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { CustomHeaderButton } from "../components";

type ChatListPropsTypes = {
  navigation: NavigationProp<ParamListBase>;
};

const NewChatScreen: FC<ChatListPropsTypes> = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item title="Close" onPress={navigation.goBack} />
        </HeaderButtons>
      ),
      headeTitle: 'New Chat'
    });
  }, []);

  return (
    <View>
      <Text
        style={{ color: "red" }}
        onPress={() => navigation.navigate("Chat")}
      >
        New Chat screen
      </Text>
    </View>
  );
};

export default NewChatScreen;
