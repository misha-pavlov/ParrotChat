import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import MainNavigator from "./MainNavigator";
import { Auth, StartUp } from "../screens";
import { RootState } from "../store/store";

const AppNavigator = () => {
  const isAuth = useSelector((state: RootState) => {
    const token = state.auth.token;
    return token !== null && token !== "";
  });
  const didTryAutoLogin = useSelector(
    (state: RootState) => state.auth.didTryAutoLogin
  );

  return (
    <NavigationContainer>
      {isAuth && <MainNavigator />}
      {!isAuth && didTryAutoLogin && <Auth />}
      {!isAuth && !didTryAutoLogin && <StartUp />}
    </NavigationContainer>
  );
};

export default AppNavigator;
