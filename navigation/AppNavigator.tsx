import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./MainNavigator";

const AppNavigator = () => (
  <NavigationContainer>
    <MainNavigator />
  </NavigationContainer>
);

export default AppNavigator;
