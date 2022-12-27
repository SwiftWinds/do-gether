import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";

import { auth } from "../config";
import Partner from "./Partner";
import Settings from "./Settings";
import Todos from "./Todos";

const Home = () => {
  const Tab = createBottomTabNavigator();

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.navigate("Login");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Todos"
        component={Todos}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="list-ul" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Partner"
        component={Partner}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Home;
