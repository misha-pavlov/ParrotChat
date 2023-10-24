import { Avatar, Center } from "native-base";
import { ThemeComponentSizeType } from "native-base/lib/typescript/components/types";
import { FC } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../config/colors";

type ProfileImagePropsTypes = {
  userInitials: string;
  size: ThemeComponentSizeType<"Avatar">;
};

const ProfileImage: FC<ProfileImagePropsTypes> = ({ userInitials, size }) => {
  return (
    <Avatar
      bg="cyan.500"
      source={{
        uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      }}
      size={size}
    >
      {userInitials}
      <Avatar.Badge
        bg={colors.lightGrey}
        borderWidth={1}
        borderColor={colors.lightGrey}
        alignItems="center"
        justifyContent="center"
      >
        <FontAwesome name="pencil" size={15} color="black" />
      </Avatar.Badge>
    </Avatar>
  );
};

export default ProfileImage;