import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Detail from "./screens/Detail";
import Home from "./screens/Home";
import Login from "./screens/Login";
import ResetPassword from "./screens/ResetPassword";
import Signup from "./screens/Signup";
import User from "./screens/User";
import VerifyEmail from "./screens/VerifyEmail";
import * as Font from "expo-font";

const Stack = createStackNavigator();

export default function App() {
  return (
    <ActionSheetProvider>
      <NavigationContainer
        linking={{
          prefixes: ["https://dogether.tech", "dogether://"],
          config: {
            screens: {
              Home: {
                screens: {
                  Todos: "todos",
                  Partner: "partner",
                  Settings: "settings",
                },
              },
              Detail: {
                path: "detail/:item",
                stringify: {
                  item: (item) => item.id,
                },
                parse: {
                  item: (item) => ({ id: item }),
                },
              },
              User: {
                path: "user/:uid",
                parse: {
                  uid: (uid) => uid,
                },
              },
              Login: {
                path: "login",
                stringify: {
                  redirectTo: () => undefined,
                },
                parse: {
                  redirectTo: (redirectTo) => ({ uid: redirectTo }),
                },
              },
              Signup: "signup",
              VerifyEmail: "verify-email",
              ResetPassword: "reset-password",
            },
          },
        }}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Detail" component={Detail} />
          <Stack.Screen name="User" component={User} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}
