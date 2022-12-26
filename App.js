import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import Detail from "./screens/Detail";
import Home from "./screens/Home";
import Login from "./screens/Login";
import ResetPassword from "./screens/ResetPassword";
import Signup from "./screens/Signup";

const Stack = createStackNavigator();

//<StatusBar style="auto" />
export default function App() {
  return (
    <ActionSheetProvider>
      <NavigationContainer
        linking={{
          config: {
            screens: {
              Login: "login",
              Signup: "signup",
              ResetPassword: "reset-password",
              Home: "home",
              Detail: "detail/:id",
            },
          },
        }}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Detail" component={Detail} />
        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}
