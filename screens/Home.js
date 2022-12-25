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
import {
  ActionSheetProvider,
  useActionSheet,
} from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../config";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [addData, setAddData] = useState("");

  const navigation = useNavigation();

  const { showActionSheetWithOptions } = useActionSheet();

  const todosRef = firebase.firestore().collection("todos");

  useEffect(() => {
    todosRef.orderBy("createdAt", "desc").onSnapshot(
      (querySnapshot) => {
        const todos = [];
        querySnapshot.forEach((doc) => {
          const { title, finished } = doc.data();
          todos.push({
            id: doc.id,
            title,
            finished,
          });
        });
        setTodos(todos);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const addTodo = () => {
    if (addData) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        title: addData,
        createdAt: timestamp,
        finished: false,
      };
      todosRef
        .add(data)
        .then(() => {
          setAddData("");
          Keyboard.dismiss();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const deleteTodo = (todo) => {
    todosRef
      .doc(todo.id)
      .delete()
      .then(() => {
        alert("Deleted successfully!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleTodo = (todo) => {
    const finished = !todo.finished;
    todosRef
      .doc(todo.id)
      .update({
        finished,
      })
      .then(() => {
        alert("Toggled successfully!");
        setTodos(
          todos.map((item) => {
            if (item.id === todo.id) {
              return {
                ...item,
                finished,
              };
            }
            return item;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const askForImage = () => {
    const options = ["Take a photo", "Choose from library", "Cancel"];
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          console.log("Take a photo");
          // takePhotoAsync();
        } else if (buttonIndex === 1) {
          pickImageAsync();
        }
      }
    );
  };

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      console.log(result);
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <ActionSheetProvider>
      <View style={{ flex: 1 }}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder={"Add a new todo"}
            placeholderTextColor={"#aaaaaa"}
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
          renderItem={({ item }) => (
            <View style={styles.container}>
              <Ionicons
                name={
                  item.finished ? "md-hourglass-outline" : "md-square-outline"
                }
                size={24}
                color="black"
                onPress={() => {
                  if (finished === false) {
                    askForImage();
                  } else {
                    toggleTodo();
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
    </ActionSheetProvider>
  );
};

export default Home;

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
