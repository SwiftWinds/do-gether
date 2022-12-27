import { useNavigation } from "@react-navigation/native";
import to from "await-to-js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
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

export default function Signup() {
  const backgroundImg = require("../assets/background.jpg");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const navigation = useNavigation();

  const validate = () => {
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
    } else if (!email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields");
    } else {
      setErrorMsg("");
      signUp();
    }
  };

  const signUp = async () => {
    // we cannot destructure userCredentials.user here because it will crash if userCredentials is undefined
    const [error, userCredentials] = await to(
      createUserWithEmailAndPassword(auth, email, password)
    );
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    const { user } = userCredentials;
    console.log(user);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrorMsg("");
    await sendEmailVerification(user);
    navigation.navigate("VerifyEmail");
  };

  return (
    <ImageBackground style={AppStyles.imageContainer} source={backgroundImg}>
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
          autoCapitalize="none"
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
        <TextInput
          style={[
            AppStyles.textInput,
            AppStyles.lightTextInput,
            AppStyles.lightText,
          ]}
          placeholder="Confirm password"
          placeholderTextColor="#bebebe"
          secureTextEntry
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        <View>
          <Text style={AppStyles.errorText}>{errorMsg}</Text>
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
