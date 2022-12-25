import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import InlineBtn from "../components/InlineBtn";
import AppStyles from "../styles/AppStyles";

export default function Login() {
  const backgroundImg = require("../assets/background.jpg");

  const [email, setEmail] = useState("");

  const navigation = useNavigation();

  return (
    <ImageBackground style={AppStyles.container} source={backgroundImg}>
      <View style={AppStyles.backgroundCover}>
        <Text style={[AppStyles.lightText, AppStyles.header]}>
          Reset your password
        </Text>
        <TextInput
          style={[
            AppStyles.textInput,
            AppStyles.lightTextInput,
            AppStyles.lightText,
          ]}
          placeholder="Email"
          placeholderTextColor={"#bebebe"}
          onChangeText={setEmail}
          value={email}
        />
        <TouchableOpacity style={AppStyles.btn} underlayColor="#fff">
          <Text
            style={[AppStyles.lightText, AppStyles.loginBtnText]}
            onPress={() => navigation.navigate("Home")}
          >
            Reset password
          </Text>
        </TouchableOpacity>
        <View style={AppStyles.rowContainer}>
          <Text style={AppStyles.lightText}>Don't have an account yet? </Text>
          <InlineBtn>Sign up</InlineBtn>
        </View>
      </View>
    </ImageBackground>
  );
}
