import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./MainNavigator";
import { Auth } from "../screens";

const AppNavigator = () => {
  const isAuth = false;

  return (
      <NavigationContainer>
        {isAuth ? <MainNavigator /> : <Auth />}
      </NavigationContainer>
  );
};

export default AppNavigator;
