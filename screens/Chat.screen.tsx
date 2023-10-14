import { ImageBackground, Platform, StyleSheet } from "react-native";
import { HStack, IconButton, Input, KeyboardAvoidingView } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import backgroundImage from "../assets/images/droplet.jpeg";
import { colors } from "../config/colors";

const INITIAL_VALUE = "";

const Chat = () => {
  const [messageText, setMessageText] = useState(INITIAL_VALUE);

  const onChangeText = useCallback((value: string) => {
    setMessageText(value);
  }, []);

  const onSendMessage = useCallback(() => {
    console.log("messageText = ", messageText.trim());
    setMessageText(INITIAL_VALUE);
  }, [messageText]);

  return (
    <SafeAreaView
      edges={["right", "left", "bottom"]}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        flex={1}
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={100}
      >
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
        ></ImageBackground>

        <HStack
          justifyContent="space-around"
          alignItems="center"
          paddingY="8px"
          paddingX="12px"
        >
          <IconButton
            icon={<Feather name="plus" size={24} color={colors.primaryBlue} />}
            onPress={() => console.log("image")}
          />

          <Input
            flex={1}
            borderRadius={50}
            borderColor={colors.lightGrey}
            marginX={15}
            paddingX={12}
            _focus={styles._focus}
            value={messageText}
            onChangeText={onChangeText}
            onSubmitEditing={onSendMessage}
          />

          {messageText === INITIAL_VALUE ? (
            <IconButton
              icon={
                <Feather name="camera" size={24} color={colors.primaryBlue} />
              }
              onPress={() => console.log("camera")}
            />
          ) : (
            <IconButton
              icon={<Feather name="send" size={20} color={colors.white} />}
              onPress={onSendMessage}
              backgroundColor={colors.primaryBlue}
              borderRadius="full"
              p="8px"
              w={35}
              _pressed={styles._pressed}
            />
          )}
        </HStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  _focus: {
    backgroundColor: "transparent",
    borderColor: colors.lightGrey,
  },
  _pressed: {
    opacity: 0.5,
  },
});

export default Chat;