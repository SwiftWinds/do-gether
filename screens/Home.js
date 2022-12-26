import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import Partner from "./Partner";
import Settings from "./Settings";
import Todos from "./Todos";

const Home = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Todos" component={Todos} />
      <Tab.Screen name="Partner" component={Partner} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default Home;
