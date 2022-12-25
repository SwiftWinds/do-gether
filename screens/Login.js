import { View, Text, ImageBackground, TextInput, TouchableOpacity, Button } from "react-native";
import React, { useState } from "react";

import InlineBtn from "../components/InlineBtn";
import AppStyles from "../styles/AppStyles";

export default function Login() {
  const backgroundImg = require("../assets/background.jpg");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ImageBackground style={AppStyles.container} source={backgroundImg}>
      <View style={AppStyles.backgroundCover}>
        <Text style={[AppStyles.lightText, AppStyles.header]}>Login</Text>
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
        <View style={AppStyles.rowContainer}>
          <InlineBtn>Forgot your password?</InlineBtn>
        </View>
        <TouchableOpacity style={AppStyles.btn} underlayColor="#fff">
          <Text style={AppStyles.lightText}>Login</Text>
        </TouchableOpacity>
        <View style={AppStyles.rowContainer}>
          <Text style={AppStyles.lightText}>Don't have an account yet? </Text>
          <InlineBtn>Sign up</InlineBtn>
        </View>
      </View>
    </ImageBackground>
  );
}
