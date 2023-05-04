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
  Image,
  style,
  ImageBackground,
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
  const pinkPickert = require("../assets/pink_picker.png");
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
      query(
        collection(db, `users/${partnerUid}/todos`),
        orderBy("createdAt", "desc")
      ),
      (querySnapshot) => {
        const todos = [];
        querySnapshot.forEach((doc) => {
          const { title, status, proof } = doc.data();
          todos.push({
            id: doc.id,
            title,
            status,
            proof,
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
  if(hasPartner){
    return(
      <View style={styles.container}>
        <ImageBackground source={bulletin} style={styles.bulletin}>
          <View style={styles.boardContainer}>
            {todos.map((item) => {
              return <ImageBackground
              source={colors.get(item.color)}
              style={styles.postit}
            />
            })}
          </View>
        </ImageBackground>
      </View>
    );
  }

  // if (hasPartner) {
  //   return (
  //     <>
  //       <View style={styles.container}>
  //         <View style={styles.header}>
  //           <Text style={styles.title}>Partner</Text>
  //         </View>
  //         <View style={styles.innerContainer}>
  //           <FlatList
  //             data={todos}
  //             numColumns={1}
  //             keyExtractor={(item) => item.id}
  //             renderItem={({ item }) => (
  //               <Pressable
  //                 onPress={() => {
  //                   if (item.status === "finished") {
  //                     showImage(item);
  //                   }
  //                 }}
  //                 style={styles.innerContainer}
  //               >
  //                 <Ionicons
  //                   name={
  //                     {
  //                       unfinished: "md-square-outline",
  //                       finished: "md-alert-circle-outline",
  //                       verified: "md-checkmark-circle-outline",
  //                     }[item.status]
  //                   }
  //                   size={24}
  //                   color="black"
  //                   style={styles.todoIcon}
  //                 />
  //                 <View style={styles.innerContainer}>
  //                   <Text style={styles.itemHeading}>
  //                     {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
  //                   </Text>
  //                 </View>
  //               </Pressable>
  //             )}
  //           />
  //         </View>
  //         <Button title="Leave partnership" onPress={leavePartnership} />
  //       </View>
  //       <ImageView
  //         images={images}
  //         imageIndex={imageIndex}
  //         visible={visible}
  //         onRequestClose={() => setIsVisible(false)}
  //         // footer has verify proof button
  //         FooterComponent={({ imageIndex }) => (
  //           <View style={styles.footerContainer}>
  //             <TouchableOpacity
  //               style={styles.footerButton}
  //               onPress={() => {
  //                 updateDoc(
  //                   doc(
  //                     db,
  //                     `users/${partnerUid}/todos/${images[imageIndex].id}`
  //                   ),
  //                   {
  //                     status: "verified",
  //                   }
  //                 );
  //                 // close modal if no more images, else show next image
  //                 if (imageIndex === images.length - 1) {
  //                   setIsVisible(false);
  //                 }
  //               }}
  //             >
  //               <Text style={styles.footerText}>Verify proof</Text>
  //             </TouchableOpacity>
  //           </View>
  //         )}
  //       />
  //     </>
  //   );
  // }

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
    backgroundColor: "#FFE4D3",
    paddingTop: 50,
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
  bulletin:{
    height:625,
    width:625,
  },

  boardContainer:{
    marginHorizontal: "auto",
    width: 400,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  postit:{
    flex: 1,
    minWidth: 100,
    marginxWidth: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
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
