import { FAB } from "@rneui/themed";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";

// import { LocaleConfig } from "react-native-calendars";
import { auth, db } from "../config";
import toYYYYMMDD from "../utils/date";
import AppStyles from "../styles/AppStyles";
import { LocaleConfig, Calendar } from "react-native-calendars";

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
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = "en";

const TaskCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(toYYYYMMDD(new Date()));
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);

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
        query(todosRef, where("dueAt", "==", selectedDate)),
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

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        style={{ borderRadius: 40, elevation: 4 }}
        current={selectedDate}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        monthFormat={'MMMM'}
        hideArrows={true}
        disableArrowLeft={true}
        disableArrowRight={true}
        hideExtraDays={true}
        enableSwipeMonths={true}
        theme={{
          backgroundColor: "#FFF3EE",
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: "#A58263",
          },
        }}
      />
      <FlatList
        data={todos}
        renderItem={({ item }) => <Text>{item.title}</Text>}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.addTaskContainer}>
        <TextInput placeholder="Add task" style={styles.input} />
        <FAB icon={{ name: "add", color: "white" }} color="green" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF3EE",
    flex: 1,
    // marginTop: 80,
    // marginLeft: 30,
    // marginRight: 30,
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
    marginTop: 20,
  },
});

export default TaskCalendar;
