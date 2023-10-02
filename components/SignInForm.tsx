import { Feather } from "@expo/vector-icons";
import { Button } from "native-base";
import { useCallback, useReducer } from "react";
import LoginInput from "./LoginInput";
import { colors } from "../config/colors";
import { loginValidation } from "../utils/validation";
import {
  LOGIN_IDS as IDS,
  INITIAL_SIGN_IN_FORM_STATE,
} from "../config/constants";
import { loginFormReducer } from "../utils/reducers/loginFormReducer";

const SignInForm = () => {
  const [formState, dispatchFormState] = useReducer(
    loginFormReducer,
    INITIAL_SIGN_IN_FORM_STATE
  );
  const onChange = useCallback(
    (inputId: string, inputValue: string) => {
      const validationResult = loginValidation(inputId, inputValue);
      dispatchFormState({ inputId, validationResult });
    },
    [dispatchFormState]
  );

  return (
    <>
      <LoginInput
        label="Email"
        icon={{
          pack: Feather,
          name: "mail",
          size: 20,
          color: colors.grey,
        }}
        inputId={IDS.email}
        onChange={onChange}
        keyboardType="email-address"
        autoCapitalize="none"
        errorText={formState.inputValidities[IDS.email]}
      />

      <LoginInput
        label="Password"
        icon={{
          pack: Feather,
          name: "lock",
          size: 20,
          color: colors.grey,
        }}
        inputId={IDS.password}
        onChange={onChange}
        autoCapitalize="none"
        secureTextEntry
        errorText={formState.inputValidities[IDS.password]}
      />

      <Button
        backgroundColor={colors.primaryGreen}
        borderRadius={30}
        _pressed={{ opacity: 0.5 }}
        mt="20px"
        isDisabled={!formState.formIsValid}
      >
        Sign in
      </Button>
    </>
  );
};

export default SignInForm;
