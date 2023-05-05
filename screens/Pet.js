import { useActionSheet } from "@expo/react-native-action-sheet";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import to from "await-to-js";
import * as ImagePicker from "expo-image-picker";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  querySnapshot,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Pressable,
  Image,
  ImageBackground,
} from "react-native";

import { db, auth, storage } from "../config";
import alert from "../utils/alert";
import toYYYYMMDD from "../utils/date";

const Pet = () => {
  const sitDogNeutral = require("../assets/sitDogNeutral.png");
  const sitDogSad = require("../assets/sitDogSad.png");
  const sitDogTongue = require("../assets/sitDogTongue.png");
  const dogHouse = require("../assets/dogHouse.png");
  const yellowHealth = require("../assets/healthYellow.png");
  const navigation = useNavigation();
  const redHealth = require("../assets/redHealth.png");



  return (
    <View style={styles.fullBackground}>
      <ImageBackground
        source={dogHouse}
        resizeMode="cover"
        style={styles.fullBackground}
      >
        <Image source={sitDogSad} style={styles.dog}></Image>
        <View style={styles.dogMenu}>
            <Image source={redHealth} style={styles.health}></Image>
        </View>
      </ImageBackground>
    </View>

    // <View style={{ flex: 1 }}>
    //   <View style={styles.formContainer}>
    //     <TextInput
    //       style={styles.input}
    //       placeholder="Add a new todo"
    //       placeholderTextColor="#aaaaaa"
    //       onChangeText={(text) => setAddData(text)}
    //       value={addData}
    //       underlineColorAndroid="transparent"
    //       autoCapitalize="none"
    //       onSubmitEditing={addTodo}
    //     />
    //     <TouchableOpacity style={styles.button} onPress={addTodo}>
    //       <Text style={styles.buttonText}>Add</Text>
    //     </TouchableOpacity>
    //   </View>
    //   <FlatList
    //     data={todos}
    //     numColumns={1}
    //     keyExtractor={(item) => item.id}
    //     renderItem={({ item }) => (
    //       <View style={styles.container}>
    //         <Ionicons
    //           name={
    //             {
    //               unfinished: "md-square-outline",
    //               finished: "md-hourglass-outline",
    //               verified: "md-checkmark-circle-outline",
    //             }[item.status]
    //           }
    //           size={24}
    //           color="black"
    //           onPress={() => {
    //             if (item.status === "unfinished") {
    //               askForImage(item);
    //             } else {
    //               toggleTodo(item);
    //             }
    //           }}
    //           style={styles.todoIcon}
    //         />
    //         <Pressable
    //           style={styles.innerContainer}
    //           onPress={() => navigation.navigate("Detail", { item })}
    //         >
    //           <Text style={styles.itemHeading}>
    //             {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
    //           </Text>
    //         </Pressable>
    //         <FontAwesome
    //           name="trash-o"
    //           size={24}
    //           color="red"
    //           onPress={() => deleteTodo(item)}
    //           style={styles.deleteIcon}
    //         />
    //       </View>
    //     )}
    //   />
    //   <Text style={styles.footerText}>Streak: {streak}</Text>
    //   <BottomSheet
    //     ref={bottomSheetRef}
    //     index={1}
    //     snapPoints={snapPoints}
    //     onChange={handleSheetChanges}
    //   >
    //     <View style={styles.contentContainer}>
    //       <Text>Awesome 🎉</Text>
    //     </View>
    //   </BottomSheet>
    //   {/* Facing issues, see: https://stackoverflow.com/questions/75300503/attempting-to-run-js-driven-animation-on-animated-node-that-has-been-moved-to-n */}
    //   {/* <FAB
    //     icon={(props) => <Icon name="plus" {...props} />}
    //     style={styles.fab}
    //   /> */}
    // </View>
  );
};

export default Pet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 30,
    alignSelf: "center",
  },
  fullBackground: {
    flex: 1,
    zIndex: 0,
  },
  dogMenu:{
    marginTop:40,
    height: 300,
    width: 600,
    backgroundColor: "#FFE4D3",
    zIndex:2,
  },
  dog: {
    width: 300,
    height: 300,
    alignSelf: "center",
    zIndex: 1,
    marginTop:150,
  },
  postit1: {
    width: 400,
    height: 400,
    alignSelf: "center",
    marginRight: 20,
    marginLeft: 15,
    zIndex: 2,
  },
  postit2: {
    width: 400,
    height: 400,
    alignSelf: "center",
    marginRight: 20,
    marginLeft: 15,
    zIndex: 1,
    marginTop: -400,
  },
  health:{
    width:300,
    height:100,
    marginLeft: 30,
    alignSelf: "flex-start",
    sIndex: 4,
  },
  dogImage: {
    marginTop: 50,
    width: 120,
    height: 120,
    alignSelf: "center",
    resizeMode: "contain",
    zIndex: 3,
  },
  fireImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    zIndex: 3,
  },
  fireContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    width: 154,
    height: 154,
    position: "absolute",
    bottom: 80,
    left: 215,
    resizeMode: "contain",
  },
  container: {
    backgroundColor: "e5e5e5",
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
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
  tasksText: {
    fontFamily: "Gaegu",
    fontSize: 30,
    textAlign: "center",
    color: "black",
    marginLeft: 40,
    marginTop: 170,
  },
  streaksText: {
    fontFamily: "Gaegu",
    fontSize: 20,
    marginTop: 40,
    textAlign: "left",
    color: "black",
    position: "absolute",
    bottom: 5,
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
  },
  todoIcon: {
    marginTop: 5,
    fontSize: 20,
    marginLeft: 14,
  },
});
