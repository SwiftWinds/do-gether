import { useNavigation } from "@react-navigation/native";
import to from "await-to-js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect, useRef } from "react";
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

export default function Login({ route }) {
  const backgroundImg = require("../assets/background.jpg");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const passwordInputRef = useRef(null);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          navigation.navigate("Home");
        } else {
          navigation.navigate("VerifyEmail");
        }
      }
    });
    return unsubscribe;
  }, []);

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
    setEmail("");
    setPassword("");
    setErrorMsg("");
    const { redirectTo } = route.params ?? {};
    console.log("redirectTo:", redirectTo);
    if (redirectTo) {
      navigation.navigate(redirectTo.screen, redirectTo.params);
    } else {
      navigation.navigate("Home");
    }
  };

  return (
    <ImageBackground style={AppStyles.imageContainer} source={backgroundImg}>
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
          autoCapitalize="none"
          placeholder="Email"
          placeholderTextColor="#bebebe"
          returnKeyType="next"
          keyboardType="email-address"
          onChangeText={setEmail}
          onSubmitEditing={passwordInputRef?.current?.focus}
          value={email}
        />
        <TextInput
          style={[
            AppStyles.textInput,
            AppStyles.lightTextInput,
            AppStyles.lightText,
          ]}
          placeholder="Password"
          placeholderTextColor="#DCDCDC"
          returnKeyType="go"
          secureTextEntry
          onChangeText={setPassword}
          onSubmitEditing={validate}
          value={password}
          ref={passwordInputRef}
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
