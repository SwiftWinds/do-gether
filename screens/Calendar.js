import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Calendar from "react-native-calendars/src/calendar";

const TaskCalendar = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <View>
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={{
          backgroundColor: "black",
          borderRadius: 10,
          margin: 40,
          padding: 10,
          width: 200,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 22 }}>Show Calendar</Text>
      </TouchableOpacity>
      <Modal visible={showModal} animationType="fade">
        <SafeAreaView style={styles.container}>
          <Calendar
            style={{ borderRadius: 10, elevation: 4, margin: 40 }}
            onDayPress={(day) => {
              console.log(day);
              setShowModal(false);
            }}
            // onMonthChange={() => {}}
            // initialDate="2022-09-10"
            // minDate="2022-01-01"
            // maxDate="2022-12-31"
            // hideExtraDays
            // markedDates={{
            //   "2022-09-16": {
            //     marked: true,
            //     dotColor: "red",
            //     selected: true,
            //     selectedColor: "purple",
            //     selectedTextColor: "black",
            //   },
            // }}
            // markingType="multi-dot"
            // markedDates={{
            //   "2022-09-15": {
            //     dots: [{ color: "red" }, { color: "green" }],
            //     selected: true,
            //     selectedColor: "lightblue",
            //     selectedTextColor: "black",
            //   },
            //   "2022-09-20": {
            //     dots: [{ color: "orange" }],
            //   },
            // }}

            // periods
            // markingType="period"
            // markedDates={{
            //   "2022-09-12": {
            //     startingDay: true,
            //     color: "lightgreen",
            //   },
            //   "2022-09-13": {
            //     marked: true,
            //     color: "lightgreen",
            //     dotColor: "transparent",
            //   },
            //   "2022-09-14": {
            //     marked: true,
            //     color: "lightgreen",
            //   },
            //   "2022-09-15": {
            //     marked: true,
            //     color: "lightgreen",
            //   },
            //   "2022-09-16": {
            //     endingDay: true,
            //     color: "lightgreen",
            //   },
            //   "2022-09-25": {
            //     startingDay: true,
            //     endingDay: true,
            //     color: "orange",
            //   },
            // }}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80,
    marginLeft: 15,
    marginRight: 15,
  },
});

export default TaskCalendar;
