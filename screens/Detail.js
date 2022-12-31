import { useNavigation } from "@react-navigation/native";
import to from "await-to-js";
import { onAuthStateChanged } from "firebase/auth";
import { collection, updateDoc, getDoc, doc } from "firebase/firestore";
import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";

import { db, auth } from "../config";

const Detail = ({ route }) => {
  const [todoTitle, setTodoTitle] = useState(route.params.item.title ?? "");
  const [user, setUser] = useState(null);

  const todosRef = useMemo(
    () => collection(db, `users/${user?.uid}/todos`),
    [user]
  );

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("user:", user);
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!route.params.item.title) {
      getDoc(doc(todosRef, route.params.item.id)).then((doc) => {
        if (doc.exists()) {
          setTodoTitle(doc.data().title);
        }
      });
    }
  }, [todosRef]);

  const updateTodo = async () => {
    if (!todoTitle) {
      return;
    }
    const [error] = await to(
      updateDoc(doc(todosRef, route.params.item.id), {
        title: todoTitle,
      })
    );
    if (error) {
      console.log(error);
      return;
    }
    navigation.navigate("Home");
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
