import { Feather, FontAwesome } from "@expo/vector-icons";
import { Button } from "native-base";
import { useCallback, useEffect, useReducer, useState } from "react";
import { Alert } from "react-native";
import LoginInput from "./LoginInput";
import { colors } from "../config/colors";
import {
  LOGIN_IDS as IDS,
  INITIAL_SIGN_UP_FORM_STATE,
  LOGIN_IDS,
} from "../config/constants";
import { loginValidation } from "../utils/validation";
import { loginFormReducer } from "../utils/reducers/loginFormReducer";
import { signUp } from "../utils/actions/authActions";
import { useAppDispatch } from "../store/store";

const SignUpForm = () => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(
    loginFormReducer,
    INITIAL_SIGN_UP_FORM_STATE
  );
  const onChange = useCallback(
    (inputId: string, inputValue: string) => {
      const validationResult = loginValidation(inputId, inputValue);
      dispatchFormState({ inputId, validationResult, inputValue });
    },
    [dispatchFormState]
  );

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(undefined);
      await dispatch(signUp(formState.inputValues as typeof LOGIN_IDS));
    } catch (error) {
      setError((error as { message: string }).message);
    } finally {
      setIsLoading(false);
    }
  }, [formState.inputValues]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  return (
    <>
      <LoginInput
        label="First name"
        icon={{
          pack: FontAwesome,
          name: "user-o",
          size: 20,
          color: colors.grey,
        }}
        inputId={IDS.firstName}
        onChange={onChange}
        autoCapitalize="none"
        errorText={formState.inputValidities[IDS.firstName]}
      />

      <LoginInput
        label="Last name"
        icon={{
          pack: FontAwesome,
          name: "user-o",
          size: 20,
          color: colors.grey,
        }}
        inputId={IDS.lastName}
        onChange={onChange}
        autoCapitalize="none"
        errorText={formState.inputValidities[IDS.lastName]}
      />

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
        onPress={authHandler}
        isLoading={isLoading}
      >
        Sign up
      </Button>
    </>
  );
};

export default SignUpForm;
