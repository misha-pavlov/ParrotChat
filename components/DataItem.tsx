import { HStack, Pressable, VStack, Text } from "native-base";
import { FC } from "react";
import ProfileImage from "./ProfileImage";
import { colors } from "../config/colors";

type DataItemPropsType = {
  userId: string;
  title: string;
  subTitle: string;
  onPress: VoidFunction;
  image?: string;
  userInitials?: string;
};

const DataItem: FC<DataItemPropsType> = ({
  image,
  userId,
  title,
  onPress,
  subTitle,
  userInitials,
}) => {
  return (
    <Pressable onPress={onPress}>
      <HStack alignItems="center" space={4}>
        <ProfileImage
          size="md"
          uri={image}
          userId={userId}
          showEditButton={false}
          userInitials={userInitials}
        />

        <VStack>
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
      </HStack>
    </Pressable>
  );
};

export default DataItem;
