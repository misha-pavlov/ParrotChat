import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Chat, ChatList, ChatSettings, Settings } from "../screens";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerTitle: "" }}>
      <Tab.Screen
        name="ChatList"
        component={ChatList}
        options={{
          tabBarLabel: "Chats",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
    <Stack.Screen
      name="Home"
      component={TabNavigator}
      options={{ headerTitle: "Chat List", headerShown: false }}
    />
    <Stack.Screen
      name="ChatSettings"
      component={ChatSettings}
      options={{
        headerTitle: "Chat Settings",
        headerBackTitle: "Back",
      }}
    />
    <Stack.Screen
      name="Chat"
      component={Chat}
      options={{
        headerTitle: "",
        headerBackTitle: "Back",
      }}
    />
  </Stack.Navigator>
);

export default MainNavigator;
