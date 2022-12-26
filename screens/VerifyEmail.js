import { useNavigation } from "@react-navigation/native";
import { sendEmailVerification } from "firebase/auth";
import React from "react";
import { View, Text, Button } from "react-native";

import { auth } from "../config";
import AppStyles from "../styles/AppStyles";

const VerifyEmail = () => {
  const navigation = useNavigation();

  const recheckStatus = async () => {
    await auth.currentUser.reload();
    if (auth.currentUser.emailVerified) {
      navigation.navigate("Home");
    }
  };

  return (
    <View style={AppStyles.container}>
      <Text>Confirm your email address</Text>
      <Button
        title="Resend email"
        onPress={() => sendEmailVerification(auth.currentUser)}
      />
      <Button title="Recheck status" onPress={recheckStatus} />
    </View>
  );
};

export default VerifyEmail;
