import { Input, Text, View } from "native-base";
import { FC } from "react";
import { KeyboardTypeOptions } from "react-native";
import { colors } from "../config/colors";

type LoginInputPropsTypes = {
  inputId: string;
  onChange: (inputId: string, inputValue: string) => void;

  label?: string;
  icon?: {
    pack: any;
    size: number;
    color: string;
    name: string;
  };
  // boolean just for type match
  errorText?: [string] | boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
};

const LoginInput: FC<LoginInputPropsTypes> = ({
  label,
  icon,
  errorText,
  onChange,
  inputId,
  autoCapitalize,
  secureTextEntry,
  keyboardType,
}) => (
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
      onChangeText={(value) => onChange(inputId, value)}
      autoCapitalize={autoCapitalize}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
    />
    {errorText && (
      <View marginY="5px">
        <Text color={colors.red} fontSize={13}>
          {Array.isArray(errorText) && errorText.length && errorText[0]}
        </Text>
      </View>
    )}
  </>
);

export default LoginInput;
