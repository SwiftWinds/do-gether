import { useNavigation } from "@react-navigation/native";
import to from "await-to-js";
import {
  deleteUser,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import React, { useState } from "react";
import { View, Text, Button, TextInput } from "react-native";

import { auth } from "../config";
import AppStyles from "../styles/AppStyles";

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigation = useNavigation();

  const validate = () => {
    if (!currentPassword || !newPassword) {
      setErrorMsg("Please fill in all fields");
      return false;
    }
    return true;
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

  const deleteUserAccount = async () => {
    let [error, userCredentials] = await to(
      signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword)
    );
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    const { user } = userCredentials;
    [error] = await to(deleteUser(user));
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setErrorMsg("");
    // delete users/{uid} and users/{uid}/todos/{todoId} from firestore with batch delete

    navigation.navigate("Login");
  };

  const logout = async () => {
    await auth.signOut();
    navigation.navigate("Login");
  };

  return (
    <View style={AppStyles.imageContainer}>
      <TextInput
        style={[
          AppStyles.textInput,
          AppStyles.lightTextInput,
          AppStyles.lightText,
        ]}
        placeholder="Current password"
        placeholderTextColor="#bebebe"
        secureTextEntry
        onChangeText={setCurrentPassword}
        value={currentPassword}
      />
      <TextInput
        style={[
          AppStyles.textInput,
          AppStyles.lightTextInput,
          AppStyles.lightText,
        ]}
        placeholder="New password"
        placeholderTextColor="#bebebe"
        secureTextEntry
        onChangeText={setNewPassword}
        value={newPassword}
      />
      <Button
        title="Update Password"
        onPress={() => validate() && updateUserPassword()}
      />
      <Text style={AppStyles.errorText}>{errorMsg}</Text>
      <Button
        title="Delete Account"
        onPress={() => validate() && deleteUserAccount()}
      />
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default Settings;
