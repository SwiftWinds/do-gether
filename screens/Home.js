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
    todosRef.orderBy("createdAt", "desc").onSnapshot(
      (querySnapshot) => {
        const todos = [];
        querySnapshot.forEach((doc) => {
          const { title } = doc.data();
          todos.push({
            id: doc.id,
            title,
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

  const addTodo = () => {
    if (addData) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        title: addData,
        createdAt: timestamp,
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
        />
        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        numColumns={1}
        renderItem={({ item }) => (
          <View style={styles.list}>
            <Pressable
              style={styles.container}
              onPress={() => navigation.navigate("Detail", { item })}
            >
              <FontAwesome
                name="trash-o"
                size={24}
                color="red"
                onPress={() => deleteTodo(item)}
                style={styles.todoIcon}
              />
              <View style={styles.innerContainer}>
                <Text style={styles.itemHeading}>
                  {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                </Text>
              </View>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 