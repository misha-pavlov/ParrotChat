import { Avatar, Pressable } from "native-base";
import { ThemeComponentSizeType } from "native-base/lib/typescript/components/types";
import { FC, useCallback, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../config/colors";
import { launchImagePicker, uploadImage } from "../utils/imagePickerHelper";

type ProfileImagePropsTypes = {
  userInitials: string;
  size: ThemeComponentSizeType<"Avatar">;
  uri?: string;
};

const ProfileImage: FC<ProfileImagePropsTypes> = ({
  userInitials,
  size,
  uri,
}) => {
  const [image, setImage] = useState(uri);
  const pickImage = useCallback(async () => {
    try {
      const tempUri = await launchImagePicker();

      if (!tempUri) return;

      const uploadedUri = await uploadImage(tempUri);

      if (!uploadedUri) {
        throw new Error("Could not upload image");
      }

      setImage(uploadedUri);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <Pressable _pressed={{ opacity: 0.5 }} onPress={pickImage}>
      <Avatar
        bg="cyan.500"
        source={{
          uri: image,
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
    </Pressable>
  );
};

export default ProfileImage;
