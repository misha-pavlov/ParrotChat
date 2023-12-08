import { Button, Center, ScrollView, View, useToast } from "native-base";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { FC, useCallback, useMemo, useReducer } from "react";
import { useSelector } from "react-redux";
import { ActivityIndicator } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
// componens
import { DataItem, LoginInput, ProfileImage, ScreenTitle } from "../components";
// constants
import { colors } from "../config/colors";
import { LOGIN_IDS } from "../config/constants";
// utils
import { loginValidation } from "../utils/validation";
import { settingsReducer } from "../utils/reducers/settingsReducer";
import { updateUserData, userLogout } from "../utils/actions/authActions";
// store
import { RootState, useAppDispatch } from "../store/store";
import { updateUserDataRedux } from "../store/authSlice";
// helpers
import { getUserInitials } from "../helpers/userHelpers";
// types
import { StarredMessages } from "../types/messageTypes";

type SettingsPropsTypes = {
  navigation: NavigationProp<ParamListBase>;
};

const Settings: FC<SettingsPropsTypes> = ({ navigation }) => {
  const userData = useSelector((state: RootState) => state.auth.userData);
  const starredMessages = useSelector(
    (state: RootState) => state.messages.starredMessages
  );
  const dispatch = useAppDispatch();
  const toast = useToast();

  const sortedStarredMessages = useMemo(() => {
    let result: StarredMessages[] = [];

    const chats = Object.values(starredMessages);

    chats.forEach((chat) => {
      const chatMessages = Object.values(chat);
      result = result.concat(chatMessages);
    });

    return result;
  }, []);

  const firstName = userData?.firstName || "";
  const lastName = userData?.lastName || "";
  const email = userData?.email || "";
  const about = userData?.about || "";

  const INITIAL_SETTINGS_FORM_STATE = {
    inputValues: {
      [LOGIN_IDS.firstName]: firstName,
      [LOGIN_IDS.lastName]: lastName,
      [LOGIN_IDS.email]: email,
      [LOGIN_IDS.about]: about,
    },
    inputValidities: {
      [LOGIN_IDS.firstName]: undefined,
      [LOGIN_IDS.lastName]: undefined,
      [LOGIN_IDS.email]: undefined,
      [LOGIN_IDS.about]: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(
    settingsReducer,
    INITIAL_SETTINGS_FORM_STATE
  );

  const onChange = useCallback(
    (inputId: string, inputValue: string) => {
      const validationResult = loginValidation(inputId, inputValue);
      dispatchFormState({ inputId, validationResult, inputValue });
    },
    [dispatchFormState]
  );

  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;
    const userId = userData?.userId;

    try {
      if (userId) {
        await updateUserData(userId, updatedValues);
        dispatch(updateUserDataRedux({ newData: updatedValues }));
        toast.show({
          description: "Saved!",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [formState, userData, dispatch]);

  const hasChanges = useMemo(() => {
    const currentValues = formState.inputValues;
    return (
      currentValues.firstName !== firstName ||
      currentValues.lastName !== lastName ||
      currentValues.email !== email ||
      currentValues.about !== about
    );
  }, [formState, firstName, lastName, email, about]);

  if (userData === null) {
    return <ActivityIndicator />;
  }

  return (
    <View px="20px" backgroundColor={colors.white} flex={1}>
      <ScreenTitle text="Settings" />

      <ScrollView>
        <Center>
          <ProfileImage
            size="xl"
            userId={userData.userId}
            uri={userData.profilePicture}
            userInitials={getUserInitials(userData)}
          />
        </Center>

        <LoginInput
          label="First name"
          icon={{
            pack: FontAwesome,
            name: "user-o",
            size: 20,
            color: colors.grey,
          }}
          inputId={LOGIN_IDS.firstName}
          onChange={onChange}
          autoCapitalize="none"
          defaultValue={userData.firstName}
          errorText={formState.inputValidities[LOGIN_IDS.firstName]}
        />

        <LoginInput
          label="Last name"
          icon={{
            pack: FontAwesome,
            name: "user-o",
            size: 20,
            color: colors.grey,
          }}
          inputId={LOGIN_IDS.lastName}
          onChange={onChange}
          autoCapitalize="none"
          defaultValue={userData.lastName}
          errorText={formState.inputValidities[LOGIN_IDS.lastName]}
        />

        <LoginInput
          label="Email"
          icon={{
            pack: Feather,
            name: "mail",
            size: 20,
            color: colors.grey,
          }}
          inputId={LOGIN_IDS.email}
          onChange={onChange}
          keyboardType="email-address"
          autoCapitalize="none"
          defaultValue={userData.email}
          errorText={formState.inputValidities[LOGIN_IDS.email]}
        />

        <LoginInput
          label="About"
          icon={{
            pack: FontAwesome,
            name: "user-o",
            size: 20,
            color: colors.grey,
          }}
          inputId={LOGIN_IDS.about}
          onChange={onChange}
          autoCapitalize="none"
          defaultValue={userData.about}
          errorText={formState.inputValidities[LOGIN_IDS.about]}
        />

        <View mt={2}>
          <DataItem
            type="link"
            title="Starred messages"
            icon="star"
            userId=""
            onPress={() =>
              navigation.navigate("DataList", {
                title: "Starred messages",
                data: sortedStarredMessages,
                type: "messages",
              })
            }
          />
        </View>

        {hasChanges && (
          <Button
            backgroundColor={colors.primaryGreen}
            borderRadius={30}
            _pressed={{ opacity: 0.5 }}
            mt="20px"
            isDisabled={!formState.formIsValid}
            onPress={saveHandler}
          >
            Save
          </Button>
        )}

        <Button
          backgroundColor={colors.logoutRed}
          borderRadius={30}
          _pressed={{ opacity: 0.5 }}
          mt="20px"
          onPress={() => dispatch(userLogout())}
        >
          Logout
        </Button>
      </ScrollView>
    </View>
  );
};

export default Settings;
