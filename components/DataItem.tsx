import { HStack, Pressable, VStack, Text } from "native-base";
import { FC } from "react";
import ProfileImage from "./ProfileImage";
import { colors } from "../config/colors";

type DataItemPropsType = {
  image?: string;
  userId: string;
  title: string;
  subTitle: string;
};

const DataItem: FC<DataItemPropsType> = ({
  image,
  userId,
  title,
  subTitle,
}) => {
  return (
    <Pressable>
      <HStack alignItems="center" space={4}>
        <ProfileImage
          uri={image}
          size="md"
          userId={userId}
          showEditButton={false}
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
