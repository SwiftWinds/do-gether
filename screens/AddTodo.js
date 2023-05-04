import to from "await-to-js";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { IconButton } from "@react-native-material/core";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { Picker } from "@react-native-picker/picker";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";

import { auth, db } from "../config";
import PopoverExample from "../components/PopoverExample";

const { Popover } = renderers;

const repeatOptions = [
  { label: "Don't repeat", value: "Don't repeat" },
  { label: "Daily", value: "Daily" },
  { label: "Weekly", value: "Weekly" },
  { label: "Monthly", value: "Monthly" },
  { label: "Yearly", value: "Yearly" },
];

const AddTodo = ({ navigation }) => {
  const [todoTitle, setTodoTitle] = useState("");
  const [user, setUser] = useState(null);
  const [date, setDate] = useState(new Date());
  const [value, setValue] = useState("Don't repeat");
  const [show, setShow] = useState(Platform.OS === "ios");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [subtaskDate, setSubtaskDate] = useState(new Date());
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [subtaskShow, setSubtaskShow] = useState(false);

  const todosRef = useMemo(
    () => collection(db, `users/${user?.uid}/todos`),
    [user]
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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
    Platform.OS === "android" && setShow(false);
    setDate(currentDate);
  };

  const onSubtaskChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    Platform.OS === "android" && setSubtaskShow(false);
    setSubtaskDate(currentDate);
  };

  const styles = StyleSheet.create({
    container: {
      marginTop: Platform.OS === "ios" ? -150 : isKeyboardVisible ? 0 : -100,
      backgroundColor: "#fff3ef",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
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
    menuContainer: {
      padding: 10,
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    menuOptions: {
      padding: 50,
    },
    menuTrigger: {
      padding: 5,
    },
    triggerText: {
      fontSize: 20,
    },
    contentText: {
      fontSize: 18,
    },
    subTaskInput: {
      fontSize: 16,
    },
    ridesFriends: {
      paddingTop: 70,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-evenly",
      width: "100%",
      marginBottom: 20,
    },
    numbers: {
      fontSize: 30,
      color: "#31C283",
      fontWeight: "bold",
    },
    verticleLine: {
      height: "100%",
      width: 1,
      backgroundColor: "#909090",
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={todoTitle}
        onChangeText={(text) => setTodoTitle(text)}
        placeholder="Add title"
        autoFocus
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
        {Platform.OS === "android" && (
          <View
            style={{
              backgroundColor: "#e9ecef",
              borderRadius: 5,
              marginLeft: 10,
              padding: 5,
            }}
          >
            <TouchableOpacity onPress={() => setShow(true)}>
              <Text>{date.toDateString()}</Text>
            </TouchableOpacity>
          </View>
        )}
        {show && (
          <DateTimePicker
            style={{ width: 150, marginLeft: -15 }}
            value={date}
            mode="date"
            onChange={onChange}
          />
        )}
      </View>
      <View
        style={{
          borderBottomColor: "#f0e3da",
          borderBottomWidth: 2.5,
          alignSelf: "stretch",
        }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <MaterialCommunityIcons
          style={{ margin: 20 }}
          name={value === "Don't repeat" ? "repeat-off" : "repeat"}
          size={28}
          color="black"
        />
        <Picker
          mode="dropdown"
          style={{ width: 200 }}
          selectedValue={value}
          onValueChange={setValue}
        >
          {repeatOptions.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
      <View
        style={{
          borderBottomColor: "#f0e3da",
          borderBottomWidth: 2.5,
          alignSelf: "stretch",
        }}
      />
      <Text style={{ fontSize: 24, marginTop: 20, marginBottom: 10 }}>
        Subtasks
      </Text>
      <PopoverExample />
      <View style={styles.ridesFriends}>
        <TextInput
          value={subtaskTitle}
          onChangeText={(text) => setSubtaskTitle(text)}
          style={styles.subTaskInput}
          placeholder="Add title"
        />
        <View style={styles.verticleLine}></View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>Due:</Text>
          {Platform.OS === "android" && (
            <View
              style={{
                backgroundColor: "#e9ecef",
                borderRadius: 5,
                marginLeft: 10,
                padding: 5,
              }}
            >
              <TouchableOpacity onPress={() => setSubtaskShow(true)}>
                <Text>{`${subtaskDate.getMonth()}/${subtaskDate.getDate()}/${subtaskDate
                  .getFullYear()
                  .toString()
                  .slice(2)}`}</Text>
              </TouchableOpacity>
            </View>
          )}
          {subtaskShow && (
            <DateTimePicker
              style={{ width: 150, marginLeft: -15 }}
              value={subtaskDate}
              mode="date"
              onChange={onSubtaskChange}
            />
          )}
        </View>
        <View style={styles.verticleLine} />
        <IconButton
          disabled={!subtaskTitle || !subtaskDate}
          color={!subtaskTitle || !subtaskDate ? "gray" : "#31C283"}
          icon={(props) => <Ionicons name="checkmark" {...props} />}
        />
      </View>
      <View style={styles.ridesFriends}>
        <TextInput
          value={subtaskTitle}
          onChangeText={(text) => setSubtaskTitle(text)}
          style={styles.subTaskInput}
          placeholder="Add title"
        />
        <View style={styles.verticleLine}></View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {Platform.OS === "android" && (
            <View
              style={{
                backgroundColor: "#e9ecef",
                borderRadius: 5,
                marginRight: 10,
                padding: 5,
              }}
            >
              <TouchableOpacity onPress={() => setSubtaskShow(true)}>
                <Text>{`${subtaskDate.getMonth()}/${subtaskDate.getDate()}/${subtaskDate
                  .getFullYear()
                  .toString()
                  .slice(2)}`}</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={{ fontWeight: "100", fontSize: 36, paddingBottom: 5 }}>
            /
          </Text>
          {Platform.OS === "android" && (
            <View
              style={{
                backgroundColor: "#e9ecef",
                borderRadius: 5,
                marginLeft: 10,
                padding: 5,
              }}
            >
              <TouchableOpacity onPress={() => setSubtaskShow(true)}>
                <Text>{`${subtaskDate.getMonth()}/${subtaskDate.getDate()}/${subtaskDate
                  .getFullYear()
                  .toString()
                  .slice(2)}`}</Text>
              </TouchableOpacity>
            </View>
          )}
          {subtaskShow && (
            <DateTimePicker
              style={{ width: 150, marginLeft: -15 }}
              value={subtaskDate}
              mode="date"
              onChange={onSubtaskChange}
            />
          )}
        </View>
        <View style={styles.verticleLine} />
        <IconButton
          disabled={!subtaskTitle || !subtaskDate}
          color={!subtaskTitle || !subtaskDate ? "gray" : "#31C283"}
          icon={(props) => <Ionicons name="checkmark" {...props} />}
        />
      </View>
    </View>
  );
};

export default AddTodo;
