import { useNavigation } from "@react-navigation/native";
import to from "await-to-js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { db, auth } from "../config";

const User = ({ route }) => {
  const [user, setUser] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("user:", user);
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const addPartner = async (user) => {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const { partner } = userDoc.data();
    if (partner) {
      await updateDoc(doc(db, "users", partner), { partner: null });
    }
    let [error] = await to(
      updateDoc(doc(db, "users", user.uid), { partner: route.params.uid })
    );
    if (error) {
      console.log(error);
      return;
    }
    console.log("Partner added successfully!");
    [error] = await to(
      updateDoc(doc(db, "users", route.params.uid), { partner: user.uid })
    );
    if (error) {
      console.log(error);
      return;
    }
    console.log("Partner added successfully!");
    navigation.navigate("Home");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        You have received an invitation from {user?.displayName}!
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => addPartner(user)}>
        <Text>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text>Decline</Text>
      </TouchableOpacity>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  message: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "e5e5e5",
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: "#788eec",
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
});
