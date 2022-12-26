import { useNavigation } from "@react-navigation/native";
import to from "await-to-js";
import { signInWithEmailAndPassword } from "firebase/auth";
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

export default function Login() {
  const backgroundImg = require("../assets/background.jpg");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const navigation = useNavigation();

  const validate = () => {
    if (!email || !password) {
      setErrorMsg("Please fill in all fields");
    } else {
      login();
    }
  };

  const login = async () => {
    // we cannot destructure userCredentials.user here because it will crash if userCredentials is undefined
    const [error, userCredentials] = await to(
      signInWithEmailAndPassword(auth, email, password)
    );
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    const { user } = userCredentials;
    console.log(user);
    navigation.navigate("Home");
  };

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
          placeholderTextColor="#bebebe"
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
          placeholderTextColor="#bebebe"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        <View style={AppStyles.rowContainer}>
          <InlineBtn onPress={() => navigation.navigate("ResetPassword")}>
            Forgot your password?
          </InlineBtn>
        </View>
        <View>
          <Text style={AppStyles.errorText}>{errorMsg}</Text>
        </View>
        <TouchableOpacity
          style={AppStyles.btn}
          underlayColor="#fff"
          onPress={validate}
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
