import { useNavigation } from "@react-navigation/native";
import to from "await-to-js";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from "react-native";

import InlineBtn from "../components/InlineBtn";
import { auth } from "../config";
import AppStyles from "../styles/AppStyles";

export default function ResetPassword() {
  const backgroundImg = require("../assets/background.jpg");

  const [email, setEmail] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const navigation = useNavigation();

  const resetPassword = async () => {
    const [error] = await to(sendPasswordResetEmail(auth, email));
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    navigation.navigate("Login");
  };

  return (
    <ImageBackground style={AppStyles.imageContainer} source={backgroundImg}>
      <View style={AppStyles.backgroundCover}>
        <Text style={[AppStyles.lightText, AppStyles.header]}>
          Reset your password
        </Text>
        <Text style={AppStyles.errorMsg}>{errorMsg}</Text>
        <TextInput
          style={[
            AppStyles.textInput,
            AppStyles.lightTextInput,
            AppStyles.lightText,
          ]}
          placeholder="Email"
          placeholderTextColor="#bebebe"
          onChangeText={setEmail}
          value={email}
        />
        <TouchableOpacity style={AppStyles.btn} underlayColor="#fff">
          <Text
            style={[AppStyles.lightText, AppStyles.loginBtnText]}
            onPress={resetPassword}
          >
            Reset password
          </Text>
        </TouchableOpacity>
        <View style={AppStyles.rowContainer}>
          <Text style={AppStyles.lightText}>Don't have an account yet? </Text>
          <InlineBtn onPress={() => navigation.navigate("Signup")}>
            Sign up
          </InlineBtn>
        </View>
      </View>
    </ImageBackground>
  );
}
