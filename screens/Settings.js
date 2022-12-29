import { useNavigation } from "@react-navigation/native";
import to from "await-to-js";
import {
  deleteUser,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import ProfilePicture from "react-native-profile-picture";

import { db, auth, storage } from "../config";
import AppStyles from "../styles/AppStyles";

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigation = useNavigation();

  const validateUpdatePassword = () => {
    if (!currentPassword || !newPassword) {
      setErrorMsg("Please fill in all fields");
      return;
    }
    updateUserPassword();
  };

  const validateDeleteUser = () => {
    if (!currentPassword) {
      setErrorMsg("Please fill in the current password field");
      return;
    }
    deleteUserAccount();
  };

  const updateUserPassword = async () => {
    let [error, userCredentials] = await to(
      signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword)
    );
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    const { user } = userCredentials;
    [error] = await to(updatePassword(user, newPassword));
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setErrorMsg("");
  };

  const deleteUserData = async (user) => {
    const { uid } = user;
    const batch = writeBatch(db);
    const todosRef = collection(db, `users/${uid}/todos`);
    const querySnapshot = await getDocs(todosRef);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    const userRef = doc(db, "users", uid);
    batch.delete(userRef);

    // remove partner field from user's partner if they have one
    const userDoc = await getDoc(userRef);
    const partner = userDoc.get("partner");
    if (partner) {
      const partnerRef = doc(db, "users", partner);
      batch.update(partnerRef, { partner: null });
    }

    // remove profile picture from storage if they have one
    const profilePictureRef = ref(storage, `profilePictures/${uid}`);

    await Promise.all([batch.commit(), to(deleteObject(profilePictureRef))]);
  };

  const deleteUserAccount = async () => {
    let [error, userCredentials] = await to(
      signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword)
    );
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    const { user } = userCredentials;
    await deleteUserData(user);
    [error] = await to(deleteUser(user));
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setErrorMsg("");
    navigation.navigate("Login");
  };

  const logout = async () => {
    await auth.signOut();
    navigation.navigate("Login");
  };

  return (
    <View style={AppStyles.container}>
      <ProfilePicture
        isPicture={false}
        user="FirstName ListName"
        shape="circle"
      />
      <Button title="edit" />
      <TextInput
        style={[AppStyles.textInput, AppStyles.darkTextInput]}
        placeholder="Current password"
        placeholderTextColor="#bebebe"
        secureTextEntry
        onChangeText={setCurrentPassword}
        value={currentPassword}
      />
      <TextInput
        style={[AppStyles.textInput, AppStyles.darkTextInput]}
        placeholder="New password"
        placeholderTextColor="#bebebe"
        secureTextEntry
        onChangeText={setNewPassword}
        value={newPassword}
      />
      <Text style={AppStyles.errorText}>{errorMsg}</Text>
      <Button title="Update Password" onPress={validateUpdatePassword} />
      <Button title="Delete Account" onPress={validateDeleteUser} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default Settings;
