import { Center, Text } from "native-base";
import { FC } from "react";
import { colors } from "../config/colors";

type MessageItemPropsType = {
  text: string;
  type: "myMessage" | "theirMessage";
};

const MessageItem: FC<MessageItemPropsType> = ({ text, type }) => {
  const isMyMessage = type === "myMessage";
  return (
    <Center
      backgroundColor={isMyMessage ? colors.lightGreen : colors.nearlyWhite}
      borderRadius={5}
      alignSelf={isMyMessage ? "flex-end" : "flex-start"}
      p={1}
      maxW="90%"
    >
      <Text>{text}</Text>
    </Center>
  );
};

export default MessageItem;
