import "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeBaseProvider, extendTheme } from "native-base";
import { LogBox } from "react-native";
import { Provider } from "react-redux";
import AppNavigator from "./navigation/AppNavigator";
import { store } from "./store/store";

LogBox.ignoreLogs(["AsyncStorage has been extracted"]);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const theme = extendTheme({
  fontConfig: {
    Quicksand: {
      400: {
        normal: "Quicksand-Regular",
      },
      500: {
        normal: "Quicksand-Medium",
      },
      700: {
        normal: "Quicksand-Bold",
      },
    },
  },

  // Make sure values below matches any of the keys in `fontConfig`
  fonts: {
    heading: "Quicksand",
    body: "Quicksand",
    mono: "Quicksand",
  },
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          "Quicksand-Regular": require("./assets/fonts/Quicksand-Regular.ttf"),
          "Quicksand-Medium": require("./assets/fonts/Quicksand-Medium.ttf"),
          "Quicksand-Bold": require("./assets/fonts/Quicksand-Bold.ttf"),
        });
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.error(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <SafeAreaProvider onLayout={onLayoutRootView}>
          <AppNavigator />
        </SafeAreaProvider>
      </NativeBaseProvider>
    </Provider>
  );
}
