import { Button, View } from "native-base";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useCallback, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { ActivityIndicator } from "react-native";
import { LoginInput, ScreenTitle } from "../components";
import { colors } from "../config/colors";
import { LOGIN_IDS } from "../config/constants";
import { loginValidation } from "../utils/validation";
import { RootState } from "../store/store";
import { settingsReducer } from "../utils/reducers/settingsReducer";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector((state: RootState) => state.auth.userData);

  const INITIAL_SETTINGS_FORM_STATE = {
    inputValues: {
      [LOGIN_IDS.firstName]: userData?.firstName || "",
      [LOGIN_IDS.lastName]: userData?.lastName || "",
      [LOGIN_IDS.email]: userData?.email || "",
      [LOGIN_IDS.about]: "",
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

  const saveHandler = useCallback(() => {}, []);

  if (userData === null) {
    return <ActivityIndicator />;
  }

  return (
    <View px="20px" backgroundColor={colors.white} flex={1}>
      <ScreenTitle text="Settings" />

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
        errorText={formState.inputValidities[LOGIN_IDS.about]}
      />

      {isLoading ? (
        <View mt="20px">
          <ActivityIndicator color={colors.primaryGreen} />
        </View>
      ) : (
        <Button
          backgroundColor={colors.primaryGreen}
          borderRadius={30}
          _pressed={{ opacity: 0.5 }}
          mt="20px"
          isDisabled={!formState.formIsValid}
          onPress={saveHandler}
        >
          Sign in
        </Button>
      )}
    </View>
  );
};

export default Settings;
