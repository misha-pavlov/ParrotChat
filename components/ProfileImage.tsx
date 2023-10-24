import { Avatar, Pressable } from "native-base";
import { ThemeComponentSizeType } from "native-base/lib/typescript/components/types";
import { FC, useCallback, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import { colors } from "../config/colors";
import { launchImagePicker, uploadImage } from "../utils/imagePickerHelper";
import { updateUserData } from "../utils/actions/authActions";
import { useAppDispatch } from "../store/store";
import { updateUserDataRedux } from "../store/authSlice";

type ProfileImagePropsTypes = {
  userId: string;
  userInitials: string;
  size: ThemeComponentSizeType<"Avatar">;
  uri?: string;
};

const ProfileImage: FC<ProfileImagePropsTypes> = ({
  userInitials,
  userId,
  size,
  uri,
}) => {
  const [image, setImage] = useState(uri);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const pickImage = useCallback(async () => {
    try {
      const tempUri = await launchImagePicker();

      if (!tempUri) return;

      setIsLoading(true);
      const uploadedUri = await uploadImage(tempUri);
      setIsLoading(false);

      if (!uploadedUri) {
        throw new Error("Could not upload image");
      }

      const newData = { profilePicture: uploadedUri };
      await updateUserData(userId, newData);
      dispatch(updateUserDataRedux({ newData }));
      setImage(uploadedUri);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [userId]);

  return (
    <Pressable _pressed={{ opacity: 0.5 }} onPress={pickImage}>
      {isLoading ? (
        <ActivityIndicator
          // 'as string' just for comparing
          size={["md", "sm", "xs"].includes(size as string) ? "small" : "large"}
          color={colors.primaryGreen}
        />
      ) : (
        <Avatar
          bg={colors.lightGrey}
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
      )}
    </Pressable>
  );
};

export default ProfileImage;
