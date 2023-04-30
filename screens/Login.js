import { useNavigation } from "@react-navigation/native";
import to from "await-to-js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as Font from "expo-font";

import InlineBtn from "../components/InlineBtn";
import { auth } from "../config";
import AppStyles from "../styles/AppStyles";

const CustomText = (props) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        "custom-font": require("../assets/fonts/Gaegu-Regular.ttf"),
      });

      setFontLoaded(true);
    }
    loadFont();
  }, []);
  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <Text style={{ ...props.style, fontFamily: "custom-font" }}>
      {props.children}
    </Text>
  );
};

export default function Login({ route }) {
  const pawDog = require("../assets/pawDog.png");

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
    <View style={[styles.container]}>
      <CustomText style={styles.title}>Dogether</CustomText>
      <View style={styles.roundedContainer}>
        <TextInput
          style={[styles.textInput]}
          autoCapitalize="none"
          placeholder="Email"
          placeholderTextColor="#bebebe"
          returnKeyType="next"
          keyboardType="email-address"
          onChangeText={setEmail}
          onSubmitEditing={passwordInputRef?.current?.focus}
          value={email}
        />
      </View>
      <View style={styles.roundedContainer}>
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
      </View>
      <View style={AppStyles.rowContainer}>
        <InlineBtn onPress={() => navigation.navigate("ResetPassword")}>
          Forgot password?
        </InlineBtn>
      </View>
      <View>
        <Text style={AppStyles.errorText}>{errorMsg}</Text>
      </View>
      <TouchableOpacity
        style={styles.roundedBtn}
        underlayColor="0000"
        onPress={validate}
      >
        <Text style={[AppStyles.lightText, AppStyles.loginBtnText]}>Login</Text>
      </TouchableOpacity>
      <View style={AppStyles.rowContainer}>
        <Text style={AppStyles.lightText}>Don't have an account yet? </Text>
        <InlineBtn onPress={() => navigation.navigate("Signup")}>
          Sign up
        </InlineBtn>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 60,
    color: "#815226",
    letterSpacing: -2,
    alignSelf: "center",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 80,
    //flex: 1,
  },
  //text style for input aligned to left with color black with opacity 47%
  textInput: {
    fontSize: 20,
    alignSelf: "center",
    alignItems: "flex-start",
    textAlign: "left",
    justifyContent: "center",
    color: "black",
    opacity: 0.47,
  },
  roundedContainer: {
    margin: 10,
    borderRadius: 40,
    backgroundColor: "#FFF3EE",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: "9%",
    width: "90%",
    //flex: 0,
  },

  roundedBtn: {
    margin: 10,
    borderRadius: 40,
    backgroundColor: "#A58263",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: "8%",
    width: "50%",
  },

  container: {
    backgroundColor: "#FFE4D3",
    paddingTop: 100,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    //justifyContent: "center",
    flexDirection: "column",
    height: "100%",
  },
  innerContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginLeft: 10,
    flex: 1,
  },
  itemHeading: {
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 22,
  },
  formContainer: {
    flexDirection: "row",
    height: 80,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 100,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: "#788eec",
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  todoIcon: {
    marginTop: 5,
    fontSize: 20,
    //marginLeft: 14,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "white",
  },
  footerButton: {
    height: 40,
    borderRadius: 5,
    backgroundColor: "#788eec",
    width: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
});
