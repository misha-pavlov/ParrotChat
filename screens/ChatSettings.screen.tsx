import { ParamListBase, RouteProp } from "@react-navigation/native";
import { FC } from "react";
import { useSelector } from "react-redux";
import { Center, ScrollView, View, Text } from "native-base";
import { RootState } from "../store/store";
import { ProfileImage, ScreenTitle } from "../components";
import { colors } from "../config/colors";

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
          <Text>{chatData?.chatName}</Text>
        </Center>
      </ScrollView>
    </View>
  );
};

export default ChatSettings;
