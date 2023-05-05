import { Ionicons } from "@expo/vector-icons";
import ImageView from "@staltz/react-native-image-viewing";
import to from "await-to-js";
import * as Clipboard from "expo-clipboard";
import { onAuthStateChanged } from "firebase/auth";
import {
  onSnapshot,
  doc,
  updateDoc,
  collection,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  Button,
  ImageBackground
} from "react-native";

import { auth, db } from "../config";

const WEB_API_KEY = "AIzaSyCJ2FY69u3jR8WMVLCT_TDrkKyqkUE2Y3k";

const Partner = () => {
  const [visible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const redPinkPicker = require("../assets/redPink_picker.png");
  const redPicker = require("../assets/red_picker.png");
  const orangePicker = require("../assets/orange_picker.png");
  const yellowPicker = require("../assets/yellow_picker.png");
  const greenPicker = require("../assets/green_picker.png");
  const bluePicker = require("../assets/blue_picker.png");
  const purplePicker = require("../assets/purple_picker.png");
  const pinkPicker = require("../assets/pink_picker.png");
  const brownPicker = require("../assets/brown_picker.png");
  const bulletin = require("../assets/bullentinBoard.png");

  const colors = new Map([
    ["redPink", redPinkPicker],
    ["red", redPicker],
    ["orange", orangePicker],
    ["yellow", yellowPicker],
    ["green", greenPicker],
    ["blue", bluePicker],
    ["purple", purplePicker],
    ["pink", pinkPicker],
    ["brown", brownPicker],
  ]);
  const [user, setUser] = useState(null);
  const [hasPartner, setHasPartner] = useState(false);
  const [partnerUid, setPartnerUid] = useState(null);
  const [todos, setTodos] = useState([]);
  const images = useMemo(() => {
    const images = [];
    console.log("todos", todos);
    todos.forEach((todo) => {
      if (todo.status === "finished") {
        images.push({
          uri: todo.proof,
          id: todo.id,
        });
      }
    });
    console.log("images", images);
    return images;
  }, [todos]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("user:", user);
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubPartner = onSnapshot(
      doc(db, `users/${user?.uid}`),
      (doc) => {
        const partnerUid = doc.get("partner");
        setHasPartner(!!partnerUid);
        setPartnerUid(partnerUid);
      },
      (error) => {
        console.log(error);
      }
    );

    return unsubPartner;
  }, [user]);

  useEffect(() => {
    if (!partnerUid) {
      return;
    }

    const unsubPartnerTodos = onSnapshot(
      query(collection(db, `users/${partnerUid}/todos`), orderBy("index")),
      (querySnapshot) => {
        console.log("partnerUid", partnerUid);
        const todos = [];
        querySnapshot.forEach((doc) => {
          const { title, status, proof, color } = doc.data();
          todos.push({
            id: doc.id,
            title,
            status,
            proof,
            color,
          });
        });
        setTodos(todos);
        console.log("todos: ", todos, "todos.length: ", todos.length);
      },
      (error) => {
        console.log(error);
      }
    );

    return unsubPartnerTodos;
  }, [partnerUid]);

  const copyInvitationUrl = async () => {
    const payload = {
      dynamicLinkInfo: {
        domainUriPrefix: "https://dogether.page.link",
        link: `https://dogether.tech/user/${user?.uid}`,
        androidInfo: {
          androidPackageName: "tech.dogether.app",
        },
        socialMetaTagInfo: {
          socialTitle: `New invite from ${user?.displayName}`,
          socialDescription: `${user?.displayName} is using Dogether to stay accountable and motivated. Join them on their journey!`,
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

  const leavePartnership = async () => {
    const batch = writeBatch(db);

    batch.update(doc(db, `users/${user?.uid}`), {
      partner: null,
    });

    batch.update(doc(db, `users/${partnerUid}`), {
      partner: null,
    });

    const [error] = await to(batch.commit());
    if (error) {
      alert(error.message);
      return;
    }

    alert("Left partnership!");
  };

  const showImage = (item) => {
    const index = images.findIndex((image) => image.uri === item.proof);
    setImageIndex(index);
    setIsVisible(true);
    console.log("viewing image: ", images[index]);
  };

  const Item = ({ item }) => {
    return <View style={styles.postit}>{item.color}</View>;
  };
  if (hasPartner) {
    return (
      <>
        <View style={styles.container}>
          <ImageBackground source={bulletin} style={styles.bulletin}>
            <View style={styles.boardContainer}>
              {todos.map((item) => {
                console.log("item.color", item);
                console.log("colors.get(item.color)", colors.get(item.color));
                return (
                  <View style={styles.postits}>
                    <Pressable
                      onPress={() => {
                        if (item.status === "finished") {
                          showImage(item);
                        }
                      }}
                    >
                      <ImageBackground
                        source={colors.get(item.color)}
                        style={styles.postitPic}
                      >
                        {item.status === "verified" ? (
                          <View style={styles.checkMark}>
                            <Ionicons
                              name="checkmark-outline"
                              size={40}
                              color="#009936"
                            ></Ionicons>
                          </View>
                        ) : null}
                        {item.status === "finished" ? (
                          <View style={styles.checkMark}>
                            <Ionicons
                              name="alert"
                              size={40}
                              color="#CF4C4F"
                            ></Ionicons>
                          </View>
                        ) : null}
                      </ImageBackground>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </ImageBackground>
        </View>
        <ImageView
          images={images}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
          style={{ height: 100 }}
          // footer has verify proof button
          FooterComponent={({ imageIndex }) => (
            <View style={styles.footerContainer}>
              <TouchableOpacity
                style={styles.footerButton}
                onPress={() => {
                  updateDoc(
                    doc(
                      db,
                      `users/${partnerUid}/todos/${images[imageIndex].id}`
                    ),
                    {
                      status: "verified",
                    }
                  );
                  // close modal if no more images, else show next image
                  if (imageIndex === images.length - 1) {
                    setIsVisible(false);
                  }
                }}
              >
                <Text style={styles.footerText}>Verify proof</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </>
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
  title: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "e5e5e5",
    paddingTop: 30,
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
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
  bulletin: {
    height: 625,
    width: 625,
    zIndex: 0,
  },
  checkMark: {
    alignSelf: "center",
    marginTop: 15,
    width: 40,
    height: 40,
  },
  boardContainer: {
    marginHorizontal: "auto",
    width: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
    marginLeft: 200,
    marginRight: 200,
    paddingTop: 130,
  },
  postits: {
    flex: 1,
    minWidth: 80,
    height: 60,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 25,
    zIndex: 1,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  postitPic: {
    width: 60,
    height: 60,
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