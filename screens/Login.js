import { useNavigation } from "@react-navigation/native";
import to from "await-to-js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

import InlineBtn from "../components/InlineBtn";
import { auth } from "../config";
import AppStyles from "../styles/AppStyles";

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
      <Text style={styles.title}>Dogether</Text>
      {/* Add a dog image such that the dog is positioned exactly above the email input placeholder text and the dog's paws are overflowing into the email input */}
      <View style={styles.imageContainer}>
        <Image source={pawDog} style={styles.pawDog} />
      </View>
      <View style={styles.roundedContainer}>
        <TextInput
          style={[styles.textInput]}
          autoCapitalize="none"
          placeholder="Email"
          placeholderTextColor="#000000"
          returnKeyType="next"
          keyboardType="email-address"
          onChangeText={setEmail}
          onSubmitEditing={passwordInputRef?.current?.focus}
          value={email}
        />
      </View>
      <View style={styles.roundedContainer}>
        <TextInput
          style={[styles.textInput]}
          placeholder="Password"
          placeholderTextColor="#000000"
          returnKeyType="go"
          secureTextEntry
          onChangeText={setPassword}
          onSubmitEditing={validate}
          value={password}
          ref={passwordInputRef}
        />
      </View>
      <View style={styles.forgotPass}>
        <InlineBtn onPress={() => navigation.navigate("ResetPassword")}>
          <Text
            style={[
              { color: "#A58263", fontFamily: "Gaegu-Bold", fontSize: 20 },
              AppStyles.darkText,
            ]}
          >
            Forgot password?
          </Text>
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
        <Text
          style={
            (AppStyles.darkText,
            {
              fontFamily: "Gaegu-Bold",
              fontSize: 20,
              marginRight: 5,
              color: "#A58263",
              letterSpacing: -2,
            })
          }
        >
          Don't have an account?
        </Text>
        <InlineBtn onPress={() => navigation.navigate("Signup")}>
          <Text
            style={{
              fontSize: 20,
              color: "#815226",
              fontFamily: "Gaegu-Bold",
              letterSpacing: -2,
            }}
          >
            Sign up
          </Text>
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
    fontFamily: "Gaegu",
    //flex: 1,
  },
  //text style for input aligned to left with color black with opacity 47%
  textInput: {
    fontFamily: "Gaegu",
    fontSize: 24,
    textAlign: "left",
    color: "black",
    opacity: 0.47,
  },
  forgotPass: {
    alignSelf: "flex-end",
    fontFamily: "Gaegu-Bold",
    marginTop: 8,
    marginBottom: 20,
    marginRight: 25,
    fontSize: 20,
    textAlign: "right",
    color: "black",
  },
  roundedContainer: {
    paddingLeft: 30,
    margin: 10,
    borderRadius: 40,
    backgroundColor: "#FFF3EE",
    flexDirection: "row",
    height: "9%",
    width: "90%",
    //flex: 0,
  },

  roundedBtn: {
    marginTop: 20,
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
    paddingTop: 175,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
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
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 255,
    left: 50,
    zIndex: 1,
  },
  pawDog: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});
