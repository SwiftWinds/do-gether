import { View, Text, ImageBackground, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import InlineBtn from "../components/InlineBtn";
import AppStyles from "../styles/AppStyles";

export default function Signup() {
  const backgroundImg = require("../assets/background.jpg");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationMsg, setValidationMsg] = useState("");

  return (
    <ImageBackground style={AppStyles.container} source={backgroundImg}>
      <View style={AppStyles.backgroundCover}>
        <Text style={[AppStyles.lightText, AppStyles.header]}>Create a Dogether account</Text>
        <TextInput
          style={[
            AppStyles.textInput,
            AppStyles.lightTextInput,
            AppStyles.lightText,
          ]}
          placeholder="Username"
          placeholderTextColor={"#bebebe"}
          onChangeText={setUsername}
          value={username}
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
        <TextInput
          style={[
            AppStyles.textInput,
            AppStyles.lightTextInput,
            AppStyles.lightText,
          ]}
          placeholder="Confirm Password"
          placeholderTextColor={"#bebebe"}
          secureTextEntry={true}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        <TouchableOpacity style={AppStyles.btn} underlayColor="#fff">
          <Text style={[AppStyles.lightText, AppStyles.loginBtnText]}>Login</Text>
        </TouchableOpacity>
        <View style={AppStyles.rowContainer}>
          <Text style={AppStyles.lightText}>Already have an account? </Text>
          <InlineBtn>Sign up</InlineBtn>
        </View>
      </View>
    </ImageBackground>
  );
}
