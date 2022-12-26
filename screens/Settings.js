import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Button } from "react-native";

import { auth } from "../config";
import AppStyles from "../styles/AppStyles";

const Settings = () => {
  const navigation = useNavigation();

  const logout = async () => {
    await auth.signOut();
    navigation.navigate("Login");
  };

  return (
    <View style={AppStyles.imageContainer}>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default Settings;
