import { HStack, Pressable, VStack, Text, View } from "native-base";
import { FC } from "react";
import { Ionicons } from "@expo/vector-icons";
import ProfileImage from "./ProfileImage";
import { colors } from "../config/colors";

type DataItemPropsType = {
  userId: string;
  title: string;
  subTitle: string;
  onPress?: VoidFunction;
  image?: string;
  userInitials?: string;
  type?: "checkbox" | "link";
  isChecked?: boolean;
};

const DataItem: FC<DataItemPropsType> = ({
  image,
  userId,
  title,
  onPress,
  subTitle,
  userInitials,
  type,
  isChecked,
}) => {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <HStack alignItems="center" space={4}>
        <ProfileImage
          size="md"
          uri={image}
          userId={userId}
          showEditButton={false}
          userInitials={userInitials}
        />

        <VStack flex={1}>
          <Text
            numberOfLines={1}
            fontFamily="Quicksand-Medium"
            letterSpacing={0.3}
            fontSize={16}
          >
            {title}
          </Text>
          <Text
            numberOfLines={1}
            fontFamily="Quicksand-Regular"
            letterSpacing={0.3}
            color={colors.grey}
          >
            {subTitle}
          </Text>
        </VStack>

        {type === "checkbox" && (
          <View
            borderWidth={1}
            borderRadius={50}
            borderColor={isChecked ? "transparent" : colors.lightGrey}
            backgroundColor={isChecked ? colors.primaryGreen : colors.white}
          >
            <Ionicons name="checkmark" size={18} color={colors.white} />
          </View>
        )}

        {type === "link" && (
          <View>
            <Ionicons
              name="chevron-forward-outline"
              size={18}
              color={colors.grey}
            />
          </View>
        )}
      </HStack>
    </Pressable>
  );
};

export default DataItem;
