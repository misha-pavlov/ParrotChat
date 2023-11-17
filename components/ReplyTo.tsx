import { FC } from "react";
import { HStack, Pressable, Text, View } from "native-base";
import { User } from "../types/userTypes";
import { colors } from "../config/colors";
import { AntDesign } from "@expo/vector-icons";

type ReplyToPropsType = {
  text: string;
  user: User;
  onCancel: VoidFunction;
};

const ReplyTo: FC<ReplyToPropsType> = ({ text, user, onCancel }) => {
  const name = `${user.firstName} ${user.lastName}`;

  return (
    <HStack
      p={2}
      borderLeftWidth={4}
      alignItems="center"
      borderLeftColor={colors.primaryBlue}
      backgroundColor={colors.extraLightGrey}
    >
      <View flex={1} mr={2}>
        <Text
          numberOfLines={1}
          color={colors.primaryBlue}
          fontFamily="Quicksand-Medium"
          letterSpacing={0.3}
        >
          {name}
        </Text>
        <Text numberOfLines={1}>{text}</Text>
      </View>

      <Pressable _pressed={{ opacity: 0.5 }} onPress={onCancel}>
        <AntDesign
          name="closecircleo"
          size={24}
          color={colors.primaryBlue}
        />
      </Pressable>
    </HStack>
  );
};

export default ReplyTo;
