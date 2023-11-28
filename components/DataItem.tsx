import { HStack, Pressable, VStack, Text, View } from "native-base";
import { FC } from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import ProfileImage from "./ProfileImage";
import { colors } from "../config/colors";

const imageSize = 40;

type DataItemPropsType = {
  userId: string;
  title: string;
  subTitle?: string;
  onPress?: VoidFunction;
  image?: string;
  icon?: string;
  userInitials?: string;
  type?: "checkbox" | "link" | "button";
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
  icon,
  isChecked,
}) => {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <HStack alignItems="center" space={4}>
        {!icon && (
          <ProfileImage
            size="md"
            uri={image}
            userId={userId}
            showEditButton={false}
            userInitials={userInitials}
          />
        )}

        {icon && (
          <View
            backgroundColor={colors.extraLightGrey}
            borderRadius={50}
            alignItems="center"
            justifyContent="center"
            width={`${imageSize}px`}
            height={`${imageSize}px`}
          >
            <AntDesign
              name={icon as any}
              size={20}
              color={colors.primaryBlue}
            />
          </View>
        )}

        <VStack flex={1}>
          <Text
            numberOfLines={1}
            fontFamily="Quicksand-Medium"
            letterSpacing={0.3}
            fontSize={16}
            color={type === "button" ? colors.primaryBlue : colors.textColor}
          >
            {title}
          </Text>

          {subTitle && (
            <Text
              numberOfLines={1}
              fontFamily="Quicksand-Regular"
              letterSpacing={0.3}
              color={colors.grey}
            >
              {subTitle}
            </Text>
          )}
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
