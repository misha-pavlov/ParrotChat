import { Feather } from "@expo/vector-icons";
import { Button } from "native-base";
import { useCallback, useEffect, useReducer, useState } from "react";
import { Alert } from "react-native";
import LoginInput from "./LoginInput";
import { colors } from "../config/colors";
import { loginValidation } from "../utils/validation";
import {
  LOGIN_IDS as IDS,
  INITIAL_SIGN_IN_FORM_STATE,
  LOGIN_IDS,
} from "../config/constants";
import { loginFormReducer } from "../utils/reducers/loginFormReducer";
import { useAppDispatch } from "../store/store";
import { signIn } from "../utils/actions/authActions";

const SignInForm = () => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(
    loginFormReducer,
    INITIAL_SIGN_IN_FORM_STATE
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
      await dispatch(
        signIn(
          formState.inputValues as Pick<typeof LOGIN_IDS, "email" | "password">
        )
      );
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
        Sign in
      </Button>
    </>
  );
};

export default SignInForm;
