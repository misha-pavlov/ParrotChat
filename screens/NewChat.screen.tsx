import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { FC, useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  HStack,
  Input,
  Center,
  FlatList,
  Divider,
} from "native-base";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { FontAwesome } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { CustomHeaderButton, DataItem } from "../components";
import { colors } from "../config/colors";
import { searchUsers } from "../utils/actions/userActions";
import { User } from "../types/userTypes";
import { RootState } from "../store/store";
import { getUserInitials } from "../helpers/userHelpers";

type ChatListPropsTypes = {
  navigation: NavigationProp<ParamListBase>;
};

const NewChatScreen: FC<ChatListPropsTypes> = ({ navigation }) => {
  const [users, setUsers] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noResultFound, setNoResultFound] = useState(false);
  const userAppData = useSelector((state: RootState) => state.auth.userData);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Close"
            onPress={navigation.goBack}
            style={{ marginLeft: 16 }}
          />
        </HeaderButtons>
      ),
      headeTitle: "New Chat",
    });
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!searchTerm || searchTerm === "") {
        setUsers(undefined);
        setNoResultFound(false);
        return;
      }

      setIsLoading(true);

      const usersResult = await searchUsers(searchTerm);

      if (userAppData?.userId) {
        delete usersResult[userAppData.userId];
      }

      setUsers(usersResult);

      if (Object.keys(usersResult).length === 0) {
        setNoResultFound(true);
      } else {
        setNoResultFound(false);
      }

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm, userAppData]);

  const userPressed = useCallback((userId: string) => {
    navigation.navigate("ChatList", { selectedUserId: userId });
  }, []);

  return (
    <View mx={4}>
      <HStack
        backgroundColor={colors.extraLightGrey}
        alignItems="center"
        h={30}
        my="8px"
        px="8px"
        py="5px"
        borderRadius={5}
        overflow="hidden"
      >
        <FontAwesome name="search" size={15} color={colors.lightGrey} />
        <Input
          placeholder="Search"
          borderColor={colors.extraLightGrey}
          ml="8px"
          fontSize={15}
          onChangeText={(text) => setSearchTerm(text)}
          _focus={{
            borderColor: colors.extraLightGrey,
            backgroundColor: colors.extraLightGrey,
          }}
        />
      </HStack>

      {isLoading && (
        <Center mt="60%">
          <ActivityIndicator size="large" color={colors.primaryGreen} />
        </Center>
      )}

      {!isLoading && !noResultFound && users && (
        <FlatList
          ItemSeparatorComponent={() => (
            <Divider height={0.3} backgroundColor={colors.lightGrey} my={2} />
          )}
          data={Object.keys(users)}
          renderItem={({ item }) => {
            const userData = users[item] as User;
            return (
              <DataItem
                title={`${userData.firstName} ${userData.lastName}`}
                subTitle={userData.about}
                image={userData.profilePicture}
                userId={userData.userId}
                userInitials={getUserInitials(userData)}
                onPress={() => userPressed(userData.userId)}
              />
            );
          }}
        />
      )}

      {!isLoading && !users && (
        <Center mt="60%">
          <FontAwesome name="users" size={55} color={colors.lightGrey} />
          <Text
            mt="20px"
            fontFamily="Quicksand-Regular"
            color={colors.textColor}
          >
            Enter a name to search for a user!
          </Text>
        </Center>
      )}

      {!isLoading && noResultFound && (
        <Center mt="60%">
          <FontAwesome name="question" size={55} color={colors.lightGrey} />
          <Text
            mt="20px"
            fontFamily="Quicksand-Regular"
            color={colors.textColor}
          >
            No users found!
          </Text>
        </Center>
      )}
    </View>
  );
};

export default NewChatScreen;
