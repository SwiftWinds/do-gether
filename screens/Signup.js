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

export default function Signup() {
  const backgroundImg = require("../assets/background.jpg");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationMsg, setValidationMsg] = useState("");

  const navigation = useNavigation();

  const validate = () => {
    if (password !== confirmPassword) {
      setValidationMsg("Passwords do not match");
    } else {
      setValidationMsg("");
    }
  };

  return (
    <ImageBackground style={AppStyles.container} source={backgroundImg}>
      <View style={AppStyles.backgroundCover}>
        <Text style={[AppStyles.lightText, AppStyles.header]}>
          Create a Dogether account
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
        <View>
          <Text style={AppStyles.errorText}>{validationMsg}</Text>
        </View>
        <TouchableOpacity
          style={AppStyles.btn}
          underlayColor="#fff"
          onPress={validate}
        >
          <Text style={[AppStyles.lightText, AppStyles.loginBtnText]}>
            Sign up
          </Text>
        </TouchableOpacity>
        <View style={AppStyles.rowContainer}>
          <Text style={AppStyles.lightText}>Already have an account? </Text>
          <InlineBtn onPress={() => navigation.navigate("Login")}>
            Log in
          </InlineBtn>
        </View>
      </View>
    </ImageBackground>
  );
}
