import { onAuthStateChanged } from "@firebase/auth";
import to from "await-to-js";
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
import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

import { auth, db } from "../config";
import MenuOption from "./MenuOption";
import Divider from "./Divider";

const TodoItem = ({ todo }) => {
  const { title, id } = todo;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
    return unsubscribe;
  }, []);

  const todosRef = useMemo(() => {
    if (user) {
      return collection(db, "users", user.uid, "todos");
    }
    return null;
  }, [user]);

  const deleteTodo = async () => {
    const [error] = await to(deleteDoc(doc(todosRef, id)));
    if (error) {
      console.log(error);
    }
  };

  return (
    <Menu>
      <MenuTrigger text={title} />
      <MenuOptions
        customStyles={{
          optionsContainer: {
            marginTop: 20,
            borderRadius: 10,
          },
        }}
      >
        <MenuOption
          onSelect={deleteTodo}
          text="Delete"
          value="Block"
          iconName="trash"
        />
        <Divider />
        <MenuOption
          onSelect={() => alert(`You clicked Uncheck`)}
          text="Uncheck"
          value="Mute"
          iconName="sound-mute"
        />
        <Divider />
        <MenuOption
          onSelect={() => alert(`You clicked Edit`)}
          text="Edit"
          value="Follow"
          iconName="pencil"
        />
      </MenuOptions>
    </Menu>
  );
};

export default TodoItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
