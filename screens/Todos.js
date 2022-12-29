import { useActionSheet } from "@expo/react-native-action-sheet";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import to from "await-to-js";
import * as ImagePicker from "expo-image-picker";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Pressable,
} from "react-native";

import { db, auth, storage } from "../config";
import alert from "../utils/alert";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [addData, setAddData] = useState("");

  const navigation = useNavigation();

  const { showActionSheetWithOptions } = useActionSheet();

  const todosRef = collection(db, `users/${auth.currentUser.uid}/todos`);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(todosRef, orderBy("createdAt", "desc")),
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
      },
      (error) => {
        console.log(error);
      }
    );

    return unsubscribe;
  }, []);

  const addTodo = async () => {
    if (addData) {
      const data = {
        title: addData,
        createdAt: serverTimestamp(),
        status: "unfinished",
        proof: null,
      };
      const [error] = await to(addDoc(todosRef, data));
      if (error) {
        console.log(error);
        return;
      }
      setAddData("");
      Keyboard.dismiss();
    }
  };

  const deleteTodo = async (todo) => {
    const [error] = await to(deleteDoc(doc(todosRef, todo.id)));
    if (error) {
      console.log(error);
    }
  };

  const toggleTodo = async (todo) => {
    let msg, status;
    if (todo.status !== "unfinished") {
      if (todo.status === "verified") {
        msg =
          "Your partner will have to re-verify a new proof of completion. Are you sure you want to continue?";
      } else if (todo.status === "finished") {
        msg =
          "You'll have to upload a new proof of completion. Are you sure you want to continue?";
      }

      const choice = await new Promise((resolve) =>
        alert("Are your sure?", msg, [
          // The "Yes" button
          {
            text: "Yes",
            onPress: () => {
              resolve("Yes");
            },
          },
          // The "No" button
          // Does nothing but dismiss the dialog when tapped
          {
            text: "No",
            onPress: () => {
              resolve("No");
            },
          },
        ])
      );

      if (choice === "No") {
        return;
      }
      status = "unfinished";
    } else {
      status = "finished";
    }

    const [error] = await to(
      updateDoc(doc(todosRef, todo.id), {
        status,
      })
    );
    if (error) {
      console.log(error);
    }
  };

  const getBlobFromUri = async (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  const setTaskProof = async (item, url) => {
    const [error] = await to(
      updateDoc(doc(todosRef, item.id), {
        proof: url,
      })
    );
    if (error) {
      console.log(error);
    }
  };

  const uploadImage = async (imageUri, item) => {
    const blob = await getBlobFromUri(imageUri);

    const storageRef = ref(
      storage,
      `users/${auth.currentUser.uid}/todos/${item.id}`
    );

    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.fround(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        ).toFixed(2);
        console.log(`Uploading... ${progress}%`);
      },
      (error) => {
        console.log("upload failed");
        console.log(error);
        blob.close();
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("Download URL: ", url);
        setTaskProof(item, url);
        toggleTodo(item);
      }
    );
  };

  const askForImage = (item) => {
    const options = ["Take a photo", "Choose from library", "Cancel"];
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          takePhotoAsync(item);
        } else if (buttonIndex === 1) {
          pickImageAsync(item);
        }
      }
    );
  };

  const takePhotoAsync = async (item) => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      console.log(result);
      uploadImage(result.assets[0].uri, item);
    } else {
      alert("You did not take any photo.");
    }
  };

  const pickImageAsync = async (item) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      uploadImage(result.assets[0].uri, item);
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setAddData(text)}
          value={addData}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
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
                  finished: "md-hourglass-outline",
                  verified: "md-checkmark-circle-outline",
                }[item.status]
              }
              size={24}
              color="black"
              onPress={() => {
                if (item.status === "unfinished") {
                  askForImage(item);
                } else {
                  toggleTodo(item);
                }
              }}
              style={styles.todoIcon}
            />
            <Pressable
              style={styles.innerContainer}
              onPress={() => navigation.navigate("Detail", { item })}
            >
              <Text style={styles.itemHeading}>
                {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
              </Text>
            </Pressable>
            <FontAwesome
              name="trash-o"
              size={24}
              color="red"
              onPress={() => deleteTodo(item)}
              style={styles.deleteIcon}
            />
          </View>
        )}
      />
    </View>
  );
};

export default Todo;

const styles = StyleSheet.create({
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
