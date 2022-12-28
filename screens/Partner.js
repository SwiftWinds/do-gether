import { Ionicons } from "@expo/vector-icons";
import to from "await-to-js";
import * as Clipboard from "expo-clipboard";
import {
  onSnapshot,
  doc,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";

import { auth, db } from "../config";

const WEB_API_KEY = "AIzaSyCJ2FY69u3jR8WMVLCT_TDrkKyqkUE2Y3k";

const copyInvitationUrl = async () => {
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
  const [error, response] = await to(
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
  );
  if (error) {
    alert(error.message);
    return;
  }
  const json = await response.json();
  await Clipboard.setStringAsync(json.shortLink);
  alert("Copied to Clipboard!");
};

const Partner = () => {
  const [hasPartner, setHasPartner] = useState(false);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const unsubHasPartner = onSnapshot(
      doc(db, `users/${auth.currentUser.uid}`),
      (doc) => {
        const { partner } = doc.data();
        setHasPartner(!!partner);
      },
      (error) => {
        console.log(error);
      }
    );

    const unsubPartnerTodos = onSnapshot(
      query(
        collection(db, `users/${auth.currentUser.uid}/todos`),
        orderBy("createdAt", "desc")
      ),
      (querySnapshot) => {
        const todos = [];
        querySnapshot.forEach((doc) => {
          const { title, status } = doc.data();
          todos.push({
            id: doc.id,
            title,
            status,
          });
        });
        setTodos(todos);
        console.log("todos: ", todos, "todos.length: ", todos.length);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubHasPartner();
      unsubPartnerTodos();
    };
  }, []);

  const showImage = (item) => {
    alert("Show image");
  };

  if (hasPartner) {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={todos}
          numColumns={1}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <Ionicons
                name={
                  {
                    unfinished: "md-square-outline",
                    finished: "md-alert-circle-outline",
                    verified: "md-checkmark-circle-outline",
                  }[item.status]
                }
                size={24}
                color="black"
                style={styles.todoIcon}
              />
              <Pressable
                style={styles.innerContainer}
                onPress={() => {
                  if (item.status === "finished") {
                    showImage(item);
                  }
                }}
              >
                <Text style={styles.itemHeading}>
                  {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                </Text>
              </Pressable>
            </View>
          )}
        />
      </View>
    );
  }

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
