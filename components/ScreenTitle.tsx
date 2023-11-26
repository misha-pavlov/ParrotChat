import { View, Text } from "native-base";
import { colors } from "../config/colors";

const ScreenTitle = ({ text }: { text: string }) => {
  return (
    <View mt="10px">
      <Text
        fontSize={28}
        color={colors.textColor}
        letterSpacing={0.3}
        fontFamily="Quicksand-Bold"
      >
        {text}
      </Text>
    </View>
  );
};

export default ScreenTitle;
