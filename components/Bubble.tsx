import { Center, Text } from "native-base";
import { FC } from "react";
import { colors } from "../config/colors";

type BubblePropsType = {
  text: string;
  type: "system" | "error";
};

const Bubble: FC<BubblePropsType> = ({ text, type }) => (
  <Center
    position="absolute"
    backgroundColor={type === "system" ? colors.lightGrey : colors.red}
    w="90%"
    top={4}
    left={4}
    right={4}
    borderRadius={5}
  >
    <Text {...(type === "error" && { color: colors.white })}>{text}</Text>
  </Center>
);

export default Bubble;
