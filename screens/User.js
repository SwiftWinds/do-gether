import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../config";
import to from "await-to-js";
import { useNavigation } from "@react-navigation/native";

const User = ({ route }) => {
  const navigation = useNavigation();
  const addPartner = async (user) => {
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
  };
  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        You have received an invitation from {auth.currentUser.displayName}!
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={addPartner(auth.currentUser)}
      >
        <Text>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={navigation.navigate("Home")}
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
  innerContainer: {
    alignItems: "flex-start",
    flexDirection: "column",
    marginLeft: 45,
    flex: 1,
  },
  itemHeading: {
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 22,
  },
  formContainer: {
    flexDirection: "row",
    height: 80,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 100,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: "#788eec",
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  todoIcon: {
    marginTop: 5,
    fontSize: 20,
    marginLeft: 14,
  },
});
