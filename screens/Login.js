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
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  return (
    <ImageBackground style={AppStyles.container} source={backgroundImg}>
      <View style={AppStyles.backgroundCover}>
        <Text style={[AppStyles.lightText, AppStyles.header]}>
          Log in to Dogether
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
        <TextInput
          style={[
            AppStyles.textInput,
            AppStyles.lightTextInput,
            AppStyles.lightText,
          ]}
          placeholder="Password"
          placeholderTextColor={"#bebebe"}
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
        />
        <View style={AppStyles.rowContainer}>
          <InlineBtn onPress={() => navigation.navigate("ResetPassword")}>Forgot your password?</InlineBtn>
        </View>
        <TouchableOpacity
          style={AppStyles.btn}
          underlayColor="#fff"
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={[AppStyles.lightText, AppStyles.loginBtnText]}>
            Log in
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
