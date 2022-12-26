import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";

import { firebase } from "../config";

const Detail = ({ route }) => {
  const todosRef = firebase.firestore().collection("todos");
  const [todoTitle, setTodoTitle] = useState(route.params.item.title);
  const navigation = useNavigation();
  const updateTodo = () => {
    if (todoTitle) {
      todosRef
        .doc(route.params.item.id)
        .update({
          title: todoTitle,
        })
        .then(() => {
          alert("Updated successfully!");
          navigation.navigate("Home");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={todoTitle}
        onChangeText={(text) => setTodoTitle(text)}
        placeholder="Update todo"
      />
      <Pressable style={styles.buttonUpdate} onPress={() => updateTodo()}>
        <Text style={styles.buttonText}>Update todo</Text>
      </Pressable>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    marginLeft: 15,
    marginRight: 15,
  },
  textInput: {
    marginBottom: 10,
    padding: 10,
    fontSize: 15,
    color: "#000000",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  buttonUpdate: {
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 10,
    backgroundColor: "#0de065",
  },
});
