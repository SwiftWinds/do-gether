import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { useFonts } from "expo-font";
import { Text } from "react-native";

import Detail from "./screens/Detail";
import AddTodo from "./screens/AddTodo";
import Home from "./screens/Home";
import Login from "./screens/Login";
import ResetPassword from "./screens/ResetPassword";
import Signup from "./screens/Signup";
import User from "./screens/User";
import VerifyEmail from "./screens/VerifyEmail";
import { MenuProvider } from "react-native-popup-menu";

const Stack = createStackNavigator();

//SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Gaegu: require("./assets/fonts/Gaegu-Regular.ttf"),
    "Gaegu-Bold": require("./assets/fonts/Gaegu-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <ActionSheetProvider>
      <MenuProvider>
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
            <Stack.Screen
              name="AddTodo"
              component={AddTodo}
              options={{ ...TransitionPresets.ModalTransition }}
            />
            <Stack.Screen name="User" component={User} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
          </Stack.Navigator>
        </NavigationContainer>
      </MenuProvider>
    </ActionSheetProvider>
  );
}
