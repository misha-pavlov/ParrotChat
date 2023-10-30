import { Button, Center, ScrollView, View, useToast } from "native-base";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useCallback, useMemo, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { ActivityIndicator } from "react-native";
import { LoginInput, ProfileImage, ScreenTitle } from "../components";
import { colors } from "../config/colors";
import { LOGIN_IDS } from "../config/constants";
import { loginValidation } from "../utils/validation";
import { RootState, useAppDispatch } from "../store/store";
import { settingsReducer } from "../utils/reducers/settingsReducer";
import { updateUserData, userLogout } from "../utils/actions/authActions";
import { updateUserDataRedux } from "../store/authSlice";
import { getUserInitials } from "../helpers/userHelpers";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector((state: RootState) => state.auth.userData);
  const dispatch = useAppDispatch();
  const toast = useToast();

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
      setIsLoading(true);

      if (userId) {
        await updateUserData(userId, updatedValues);
        dispatch(updateUserDataRedux({ newData: updatedValues }));
        toast.show({
          description: "Saved!",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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

        {isLoading ? (
          <View mt="20px">
            <ActivityIndicator color={colors.primaryGreen} />
          </View>
        ) : (
          hasChanges && (
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
          )
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
