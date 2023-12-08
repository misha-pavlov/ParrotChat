import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { Divider, FlatList, View } from "native-base";
import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { colors } from "../config/colors";
import { RootState } from "../store/store";
import { DataItem } from "../components";
import { getUserName } from "../helpers/userHelpers";

type CustomParamListBase = {
  title: string;
  data: any[];
  type: "users" | "messages";
  chatId: string;
};

type DataListPropsTypes = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

const DataList: FC<DataListPropsTypes> = ({ route, navigation }) => {
  const { title, data, type, chatId } = route.params as CustomParamListBase;

  const userData = useSelector((state: RootState) => state.auth.userData);
  const storredUsers = useSelector(
    (state: RootState) => state.users.storedUsers
  );
  const messagesData = useSelector(
    (state: RootState) => state.messages.messagesData
  );

  useEffect(() => {
    navigation.setOptions({ headerTitle: title });
  }, [title]);

  return (
    <View px="20px" backgroundColor={colors.white} flex={1}>
      <FlatList
        data={data}
        keyExtractor={(item) => item?.messageId || item}
        renderItem={(itemData) => {
          let key, onPress, image, title, subTitle, itemType;

          if (type === "users") {
            const uid = itemData.item;
            const currentUser = storredUsers[uid];

            if (!currentUser) return null;

            const isLoggedInUser = uid === userData?.userId;

            key = uid;
            image = currentUser?.profilePicture;
            title = getUserName(currentUser);
            subTitle = currentUser.about;
            itemType = isLoggedInUser ? undefined : ("link" as "link");
            onPress = isLoggedInUser
              ? undefined
              : () => navigation.navigate("Contact", { uid, chatId });
          } else if (type === "messages") {
            const starData = itemData.item;
            const { chatId, messageId } = starData;
            const messagesForChat = messagesData[chatId];

            if (!messagesForChat) return null;

            const messageData = messagesForChat[messageId];
            const sender =
              messageData.sendBy && storredUsers[messageData.sendBy];
            const name = sender && getUserName(sender);

            key = messageId;
            title = name;
            subTitle = messageData.text;
            itemType = undefined;
          }

          return (
            <DataItem
              key={key}
              onPress={onPress}
              image={image}
              title={title || ""}
              subTitle={subTitle}
              type={itemType}
              userId=""
            />
          );
        }}
        ItemSeparatorComponent={() => (
          <Divider h="1px" backgroundColor={colors.lightGrey} mt={2} mb={2} />
        )}
      />
    </View>
  );
};

export default DataList;
