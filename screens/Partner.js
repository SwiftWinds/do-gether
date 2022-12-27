import * as Clipboard from "expo-clipboard";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { auth } from "../config";

const WEB_API_KEY = "AIzaSyCJ2FY69u3jR8WMVLCT_TDrkKyqkUE2Y3k";

const copyInvitationUrl = async () => {
  try {
    const payload = {
      dynamicLinkInfo: {
        domainUriPrefix: "https://dogether.page.link",
        link: `https://dogether-78b6f.web.app/user/${auth.currentUser.uid}`,
        androidInfo: {
          androidPackageName: "gg.dogether.app",
        },
        socialMetaTagInfo: {
          socialTitle: `New invite from ${auth.currentUser.displayName}`,
          socialDescription: `${auth.currentUser.displayName} is using Dogether to stay accountable and motivated. Join them on their journey!`,
          // socialImageLink: "<image-url>",
        },
      },
    };

    const url = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${WEB_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    await Clipboard.setStringAsync(json.shortLink);
    alert("Copied to Clipboard!");
  } catch (error) {
    alert(error.message);
  }
};
const Partner = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Oops! You don't have a partner yet!</Text>
      <TouchableOpacity style={styles.button} onPress={copyInvitationUrl}>
        <Text>Share link</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Partner;
const styles = StyleSheet.create({
  message: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "e5e5e5",
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  innerContainer: {
    alignItems: "flex-start",
    flexDirection: "column",
    marginLeft: 45,
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
    marginLeft: 14,
  },
});
