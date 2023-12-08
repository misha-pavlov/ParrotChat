import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  HStack,
  Input,
  Center,
  FlatList,
  Divider,
  Pressable,
} from "native-base";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { FontAwesome } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList as ReactNativeFlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { CustomHeaderButton, DataItem, ProfileImage } from "../components";
import { colors } from "../config/colors";
import { searchUsers } from "../utils/actions/userActions";
import { User } from "../types/userTypes";
import { RootState, useAppDispatch } from "../store/store";
import { getUserInitials, getUserName } from "../helpers/userHelpers";
import { setStoredUsers } from "../store/userSlice";

type CustomParamListBase = {
  isGroupChat?: boolean;
  chatId?: string;
  existingUsers?: string[];
};

type NewChatPropsTypes = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

const NewChat: FC<NewChatPropsTypes> = ({ navigation, route }) => {
  const [users, setUsers] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noResultFound, setNoResultFound] = useState(false);
  const [chatName, setChatName] = useState("");
  const [selectedUsers, setSelectedUSers] = useState<string[]>([]);

  const userAppData = useSelector((state: RootState) => state.auth.userData);
  const storredUsers = useSelector(
    (state: RootState) => state.users.storedUsers
  );
  const dispatch = useAppDispatch();
  const selectedUsersFlatListRef = useRef<ReactNativeFlatList>(null);

  const chatId = (route.params as CustomParamListBase)?.chatId;
  const existingUsers = (route.params as CustomParamListBase)?.existingUsers;
  const isGroupChat = (route.params as CustomParamListBase)?.isGroupChat;
  const isNewChat = !chatId;
  const isGroupChatDisabled = (isNewChat && chatName === "") || !selectedUsers.length;

  useEffect(() => {
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
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          {isGroupChat && (
            <Item
              title={isNewChat ? "Create" : "Add"}
              disabled={isGroupChatDisabled}
              color={isGroupChatDisabled ? colors.lightGrey : undefined}
              onPress={() =>
                navigation.navigate(isNewChat ? "ChatList" : "ChatSettings", {
                  selectedUsers,
                  chatName,
                  chatId
                })
              }
            />
          )}
        </HeaderButtons>
      ),
      headerTitle: isGroupChat ? "Add Participants" : "New Chat",
    });
  }, [selectedUsers, chatName]);

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
        dispatch(setStoredUsers({ users: usersResult }));
      }

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm, userAppData, dispatch, setStoredUsers]);

  const userPressed = useCallback(
    (userId: string) => {
      if (isGroupChat) {
        const newSelectedUsers = selectedUsers.includes(userId)
          ? selectedUsers.filter((id) => id !== userId)
          : selectedUsers.concat(userId);
        setSelectedUSers(newSelectedUsers);
      } else {
        navigation.navigate("ChatList", { selectedUserId: userId });
      }
    },
    [isGroupChat, selectedUsers]
  );

  return (
    <View mx={4}>
      {isGroupChat && (
        <>
          {isNewChat && (
            <View py={2}>
              <View w="100%" flexDirection="row" borderRadius={2}>
                <Input
                  placeholder="Enter a name for your chat"
                  autoCorrect={false}
                  autoComplete={undefined}
                  color={colors.textColor}
                  w="100%"
                  fontFamily="Quicksand-Regular"
                  letterSpacing={0.3}
                  borderColor={colors.extraLightGrey}
                  onChangeText={(text) => setChatName(text)}
                  _focus={{
                    borderColor: colors.extraLightGrey,
                    backgroundColor: colors.extraLightGrey,
                  }}
                />
              </View>
            </View>
          )}

          <View>
            <FlatList
              mt={isNewChat ? 0 : 2}
              ref={selectedUsersFlatListRef}
              data={selectedUsers}
              horizontal
              keyExtractor={(item) => item}
              onContentSizeChange={() =>
                selectedUsersFlatListRef.current?.scrollToEnd()
              }
              ItemSeparatorComponent={() => <View ml={2} />}
              renderItem={({ item }) => {
                const userData = storredUsers[item];
                return (
                  <Pressable
                    _pressed={{ opacity: 0.5 }}
                    onPress={() => userPressed(item)}
                  >
                    <ProfileImage
                      size="md"
                      userId={item}
                      uri={userData?.profilePicture}
                      userInitials={getUserInitials(userData)}
                      showEditButton={false}
                      showRemoveButton
                    />
                  </Pressable>
                );
              }}
            />
          </View>
        </>
      )}

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

            if (existingUsers && existingUsers?.includes(item)) {
              return null;
            }

            return (
              <DataItem
                title={getUserName(userData)}
                subTitle={userData.about}
                image={userData.profilePicture}
                userId={userData.userId}
                userInitials={getUserInitials(userData)}
                onPress={() => userPressed(userData.userId)}
                type={isGroupChat ? "checkbox" : undefined}
                isChecked={selectedUsers.includes(item)}
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

export default NewChat;
