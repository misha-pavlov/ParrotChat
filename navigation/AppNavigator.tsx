import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import MainNavigator from "./MainNavigator";

const AppNavigator = () => (
  <NativeBaseProvider>
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  </NativeBaseProvider>
);

export default AppNavigator;
