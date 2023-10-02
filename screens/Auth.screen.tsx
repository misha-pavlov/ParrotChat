import {
  Text,
  View,
  Image,
  Center,
  ScrollView,
  KeyboardAvoidingView,
} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Platform } from "react-native";
import { SignUpForm, SignInForm } from "../components";
import { colors } from "../config/colors";
import logo from "../assets/images/logo.png";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <SafeAreaView>
      <View paddingX={4}>
        <ScrollView>
          <KeyboardAvoidingView
            flex={1}
            behavior={Platform.select({ ios: "height", android: undefined })}
            justifyContent="center"
            keyboardVerticalOffset={-100}
          >
            <Center>
              <Image
                source={logo}
                w="60%"
                resizeMode="contain"
                alt="App logo"
              />
            </Center>

            {isSignUp ? <SignUpForm /> : <SignInForm />}
            <Text
              onPress={() => setIsSignUp((prevValue) => !prevValue)}
              marginY="15px"
              color={colors.primaryBlue}
              textAlign="center"
              fontFamily="Quicksand-Medium"
            >{`Switch to ${isSignUp ? "sign in" : "sign up"}`}</Text>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Auth;
