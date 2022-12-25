import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./screens/Home";
import Detail from "./screens/Detail";
import ResetPassword from "./screens/ResetPassword";

import Login from "./screens/Login";

const Stack = createStackNavigator();

//<StatusBar style="auto" />
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Detail" component={Detail} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
