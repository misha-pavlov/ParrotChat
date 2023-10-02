import { Input, Text, View } from "native-base";
import { FC } from "react";
import { colors } from "../config/colors";

type LoginInputPropsTypes = {
  label?: string;
  icon?: {
    pack: any;
    size: number;
    color: string;
    name: string;
  };
  errorText?: string;
};

const LoginInput: FC<LoginInputPropsTypes> = ({ label, icon, errorText }) => (
  <>
    {label && (
      <Text fontFamily="Quicksand-Bold" paddingY={2} color={colors.textColor}>
        {label}
      </Text>
    )}
    <Input
      _focus={{
        background: colors.nearlyWhite,
        borderColor: colors.lightGrey,
      }}
      size="lg"
      backgroundColor={colors.nearlyWhite}
      InputLeftElement={
        icon && (
          <View pl={3}>
            <icon.pack
              name={icon.name}
              size={icon.size || 15}
              color={icon.color}
            />
          </View>
        )
      }
      color={colors.textColor}
      fontFamily="Quicksand-Regular"
    />
    {errorText && (
      <View marginY="5px">
        <Text color={colors.red} fontSize={13}>
          {errorText}
        </Text>
      </View>
    )}
  </>
);

export default LoginInput;
