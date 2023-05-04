import { useNavigation } from "@react-navigation/native";
import { FAB } from "@rneui/themed";
import to from "await-to-js";
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
import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  TextInput,
  View,
  Keyboard,
} from "react-native";
import { LocaleConfig, Calendar } from "react-native-calendars";
import { MenuProvider } from "react-native-popup-menu";

import TodoItem from "../components/TodoItem";
import { auth, db } from "../config";
import toYYYYMMDD from "../utils/date";

LocaleConfig.locales["en"] = {
  monthNames: [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["S", "M", "T", "W", "T", "F", "S"],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = "en";

const TaskCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(toYYYYMMDD(new Date()));
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);
  const [todoTitle, setTodoTitle] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (todosRef && selectedDate) {
      const unsubscribe = onSnapshot(
        query(todosRef, where("dueAt", "==", selectedDate), orderBy("index")),
        (snapshot) => {
          const todos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("todos", todos);
          setTodos(todos);
        }
      );
      return unsubscribe;
    }
  }, [todosRef, selectedDate]);

  const todosRef = useMemo(() => {
    if (user) {
      return collection(db, "users", user.uid, "todos");
    }
    return null;
  }, [user]);

  useEffect(() => {
    let unsubTodos;

    if (todosRef) {
      unsubTodos = onSnapshot(
        query(todosRef, where("status", "==", "unfinished"), orderBy("index")),
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

    return unsubTodos;
  }, [todosRef]);

  const addTodo = async () => {
    if (todoTitle) {
      const data = {
        title: todoTitle,
        createdAt: serverTimestamp(),
        status: "unfinished",
        proof: null,
        dueAt: toYYYYMMDD(new Date()),
        index: todos.length,
      };
      const [error] = await to(addDoc(todosRef, data));
      if (error) {
        console.log(error);
        return;
      }
      setTodoTitle("");
      Keyboard.dismiss();
    }
  };

  const openTodoPopup = () => {
    navigation.navigate("AddTodo", { navigation });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        style={{ borderRadius: 40, elevation: 4, margin: 25 }}
        current={selectedDate}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        monthFormat="MMMM"
        hideArrows
        disableArrowLeft
        disableArrowRight
        hideExtraDays
        enableSwipeMonths
        theme={{
          backgroundColor: "#FFF3EE",
          todayTextColor: "#A58263",
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: "#A58263",
          },
        }}
      />
      <MenuProvider style={styles.container}>
        <FlatList
          data={todos}
          renderItem={({ item }) => <TodoItem todo={item} />}
          keyExtractor={(item) => item.id}
        />
      </MenuProvider>
      <View style={styles.addTaskContainer}>
        <TextInput
          value={todoTitle}
          onChangeText={setTodoTitle}
          onSubmitEditing={addTodo}
          placeholder="Add task"
          style={styles.input}
        />
        <FAB
          icon={{ name: todoTitle ? "check" : "add", color: "black" }}
          onPress={todoTitle ? addTodo : openTodoPopup}
          color="#a48365"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF3EE",
    flex: 1,
  },
  input: {
    backgroundColor: "#D2BAA6",
    borderRadius: 50,
    color: "black",
    height: 40,
    marginRight: 30,
    paddingLeft: 25,
    fontSize: 23,
    flex: 1,
    fontWeight: "normal",
    fontFamily: "Gaegu",
  },
  addTaskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
  },
});

export default TaskCalendar;
