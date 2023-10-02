import { Feather, FontAwesome } from "@expo/vector-icons";
import { Button } from "native-base";
import LoginInput from "./LoginInput";
import { colors } from "../config/colors";

const SignUpForm = () => (
  <>
    <LoginInput
      label="First name"
      icon={{
        pack: FontAwesome,
        name: "user-o",
        size: 20,
        color: colors.grey,
      }}
    />

    <LoginInput
      label="Last name"
      icon={{
        pack: FontAwesome,
        name: "user-o",
        size: 20,
        color: colors.grey,
      }}
    />

    <LoginInput
      label="Email"
      icon={{
        pack: Feather,
        name: "mail",
        size: 20,
        color: colors.grey,
      }}
    />

    <LoginInput
      label="Password"
      icon={{
        pack: Feather,
        name: "lock",
        size: 20,
        color: colors.grey,
      }}
    />

    <Button
      backgroundColor={colors.primaryGreen}
      borderRadius={30}
      _pressed={{ opacity: 0.5 }}
      mt="20px"
    >
      Sign up
    </Button>
  </>
);

export default SignUpForm;
