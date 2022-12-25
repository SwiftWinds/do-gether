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
import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { firebase } from "../config";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const todosRef = firebase.firestore().collection("todos");
  const [addData, setAddData] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    console.log("useEffect called")
    todosRef.orderBy("createdAt", "desc").onSnapshot(
      (querySnapshot) => {
        const todos = [];
        querySnapshot.forEach((doc) => {
          const { title, finished } = doc.data();
          todos.push({
            id: doc.id,
            title,
            finished
          });
        });
        setTodos(todos);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

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
    console.log("old state: ", todo.finished)
    const finished = !todo.finished;
    console.log("new state: ", finished)
    todosRef
      .doc(todo.id)
      .update({
        finished
      })
      .then(() => {
        alert("Finished task successfully!");
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


  const addTodo = () => {
    if (addData) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        title: addData,
        createdAt: timestamp,
        finished: false
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

  return (
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
          <Pressable
            style={styles.container}
            onPress={() => navigation.navigate("Detail", { item })}
          >
            <FontAwesome
              name={item.finished ? "check-square-o" : "square-o"}
              size={24}
              color="black"
              onPress={() => {
                toggleTodo(item);
              }
              }
              style={styles.todoIcon}
            />
            <View style={styles.innerContainer}>
              <Text style={styles.itemHeading}>
                {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
              </Text>
            </View>
            <FontAwesome
              name="trash-o"
              size={24}
              color="red"
              onPress={() => deleteTodo(item)}
              style={styles.deleteIcon}
            />
          </Pressable>
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'e5e5e5',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  innerContainer: {
    alignItems: "flex-start",
    marginLeft: 45,
    flex: 1,
  },
  itemHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 22,
  },
  formContainer: {
    flexDirection: 'row',
    height: 80,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 100,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: '#788eec',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20
  },
  todoIcon: {
    marginTop: 5,
    fontSize: 20,
    marginLeft: 14,
  },
  deleteIcon: {
    marginTop: 5,
    fontSize: 20,
    marginRight: 14,
  },
})