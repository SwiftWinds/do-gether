import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Detail from "./screens/Detail";
import Home from "./screens/Home";
import Login from "./screens/Login";
import ResetPassword from "./screens/ResetPassword";
import Signup from "./screens/Signup";
import VerifyEmail from "./screens/VerifyEmail";

const Stack = createStackNavigator();

export default function App() {
  return (
    <ActionSheetProvider>
      <NavigationContainer
        linking={{
          prefixes: ["https://dogether.gg", "dogether://"],
          config: {
            screens: {
              Login: "login",
              Signup: "signup",
              VerifyEmail: "verify-email",
              ResetPassword: "reset-password",
              Home: "home",
              Detail: {
                path: "detail/:item",
                stringify: {
                  item: (item) => item.id,
                },
              },
            },
          },
        }}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Detail" component={Detail} />
        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}
