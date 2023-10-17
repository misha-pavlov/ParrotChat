import { View } from "native-base";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useCallback, useReducer } from "react";
import { LoginInput, ScreenTitle } from "../components";
import { colors } from "../config/colors";
import { INITIAL_SETTINGS_FORM_STATE, LOGIN_IDS } from "../config/constants";
import { loginValidation } from "../utils/validation";
import { loginFormReducer } from "../utils/reducers/loginFormReducer";

const Settings = () => {
  const [formState, dispatchFormState] = useReducer(
    loginFormReducer,
    INITIAL_SETTINGS_FORM_STATE
  );

  const onChange = useCallback(
    (inputId: string, inputValue: string) => {
      const validationResult = loginValidation(inputId, inputValue);
      dispatchFormState({ inputId, validationResult, inputValue });
    },
    [dispatchFormState]
  );

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
    </View>
  );
};

export default Settings;
