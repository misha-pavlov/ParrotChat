import { Ionicons } from "@expo/vector-icons";
import { HeaderButton } from "react-navigation-header-buttons";
import { colors } from "../config/colors";

const CustomHeaderButton = (props: any) => (
  <HeaderButton
    {...props}
    IconComponent={Ionicons}
    iconSize={23}
    color={props.color ?? colors.primaryBlue}
  />
);

export default CustomHeaderButton;
