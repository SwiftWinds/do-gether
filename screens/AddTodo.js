import to from "await-to-js";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

import { auth, db } from "../config";

const repeatOptions = [
  { label: "Doesn't repeat", value: "Doesn't repeat" },
  { label: "Daily", value: "Daily" },
  { label: "Weekly", value: "Weekly" },
  { label: "Monthly", value: "Monthly" },
  { label: "Yearly", value: "Yearly" },
];

const AddTodo = ({ navigation }) => {
  const [todoTitle, setTodoTitle] = useState("");
  const [user, setUser] = useState(null);
  const [date, setDate] = useState(new Date());
  const [value, setValue] = useState("Doesn't repeat");
  const [open, setOpen] = useState(false);

  const todosRef = useMemo(
    () => collection(db, `users/${user?.uid}/todos`),
    [user]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("user:", user);
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const addTodo = async () => {
    if (!todoTitle) {
      return;
    }
    const [error] = await to(
      addDoc(todosRef, {
        title: todoTitle,
        status: "unfinished",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );
    if (error) {
      console.log(error);
      return;
    }
    navigation.navigate("Home");
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={todoTitle}
        onChangeText={(text) => setTodoTitle(text)}
        placeholder="Add title"
        autoFocus
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text>Due:</Text>
        <DateTimePicker
          style={{ width: 150, marginLeft: -15 }}
          value={date}
          mode="date"
          onChange={onChange}
        />
      </View>
      <View
        style={{
          borderBottomColor: "#f0e3da",
          borderBottomWidth: 2.5,
          alignSelf: "stretch",
        }}
      />
      <View
        style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
      >
        <MaterialCommunityIcons
          style={{ margin: 20, marginLeft: 40 }}
          name={value === "Doesn't repeat" ? "repeat-off" : "repeat"}
          size={28}
          color="black"
        />
        <DropDownPicker
          open={open}
          setOpen={setOpen}
          value={value}
          items={repeatOptions}
          setValue={setValue}
          multiple={false}
          mode="BADGE"
          style={{ width: 200 }}
          dropDownContainerStyle={{ width: 200 }}
        />
        <Text style={{ fontSize: 24 }}>Doesn't repeat</Text>
      </View>
      <View
        style={{
          borderBottomColor: "#f0e3da",
          borderBottomWidth: 2.5,
          alignSelf: "stretch",
        }}
      />
      <Text style={{ fontSize: 24, marginTop: 20 }}>Remind me</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 75,
    backgroundColor: "#fff3ef",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    fontSize: 48,
    marginBottom: 20,
  },
  buttonAdd: {
    width: "100%",
    height: 50,
    backgroundColor: "#000",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AddTodo;
