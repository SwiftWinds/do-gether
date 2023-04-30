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
  orderBy,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
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
} from "react-native";

import { db, auth, storage } from "../config";
import alert from "../utils/alert";
import toYYYYMMDD from "../utils/date";

const Todo = () => {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [addData, setAddData] = useState("");
  const [streak, setStreak] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const { showActionSheetWithOptions } = useActionSheet();

  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const userRef = useMemo(() => {
    if (!user) return null;
    return doc(db, "users", user.uid);
  }, [user]);

  const todosRef = useMemo(() => {
    if (!userRef) return null;
    return collection(userRef, "todos");
  }, [userRef]);

  useEffect(() => {
    let unsubUser, unsubTodos;

    if (userRef) {
      unsubUser = onSnapshot(userRef, (doc) => {
        const { streak } = doc.data();
        console.log("streak:", streak);
        setStreak(streak);
      });
    }

    if (todosRef) {
      unsubTodos = onSnapshot(
        query(todosRef, orderBy("createdAt", "desc")),
        (querySnapshot) => {
          const todos = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTodos(todos);
        },
        (error) => {
          console.log(error);
        }
      );
    }

    return () => {
      unsubUser?.();
      unsubTodos?.();
    };
  }, [userRef, todosRef]);

  const addTodo = async () => {
    if (addData) {
      const data = {
        title: addData,
        createdAt: serverTimestamp(),
        status: "unfinished",
        proof: null,
        dueAt: toYYYYMMDD(new Date()),
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

      console.log("choice:", choice);
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
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
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

    const storageRef = ref(storage, `users/${user?.uid}/todos/${item.id}`);

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
      <Text style={styles.footerText}>Streak: {streak}</Text>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheet>
      {/* Facing issues, see: https://stackoverflow.com/questions/75300503/attempting-to-run-js-driven-animation-on-animated-node-that-has-been-moved-to-n */}
      {/* <FAB
        icon={(props) => <Icon name="plus" {...props} />}
        style={styles.fab}
      /> */}
    </View>
  );
};

export default Todo;

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
