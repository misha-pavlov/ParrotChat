import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Chat, ChatList, ChatSettings, Settings } from "../screens";
import NewChatScreen from "../screens/NewChat.screen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerTitle: "", headerShadowVisible: false }}
    >
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
    <Stack.Group>
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
    </Stack.Group>

    <Stack.Group screenOptions={{ presentation: "modal" }}>
      <Stack.Screen name="NewChat" component={NewChatScreen} />
    </Stack.Group>
  </Stack.Navigator>
);

export default MainNavigator;
