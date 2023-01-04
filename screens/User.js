import { useNavigation } from "@react-navigation/native";
import to from "await-to-js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot, writeBatch } from "firebase/firestore";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ProfilePicture from "react-native-profile-picture";

import { db, auth } from "../config";

const User = ({ route }) => {
  const [partner, setPartner] = useState(null);
  const [user, setUser] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubLoggedIn = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        navigation.navigate("Login");
      }
    });

    const unsubInviter = onSnapshot(
      doc(db, "users", route.params.uid),
      (doc) => {
        setPartner(doc.data());
      }
    );

    return () => {
      unsubLoggedIn();
      unsubInviter();
    };
  }, []);

  const addPartner = async () => {
    const batch = writeBatch(db);

    const userDoc = await getDoc(doc(db, "users", user.uid));

    // If the user already has a partner, remove the partner from the other user
    const { partner: prevPartner } = userDoc.data();
    if (prevPartner) {
      batch.update(doc(db, "users", prevPartner), { partner: null });
    }

    batch.update(doc(db, "users", user.uid), {
      partner: partner.uid,
    });
    batch.update(doc(db, "users", partner.uid), {
      partner: user.uid,
    });

    const [error] = await to(batch.commit());
    if (error) {
      console.log("error adding partner", error);
      return;
    }

    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <ProfilePicture
        isPicture={!!partner?.photoURL}
        URLPicture={partner?.photoURL}
        user={partner?.displayName}
        shape="circle"
      />
      <Text style={styles.message}>
        You have received an invitation from {partner?.displayName}!
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => addPartner()}>
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
