import { useActionSheet } from "@expo/react-native-action-sheet";
import { useNavigation } from "@react-navigation/native";
import to from "await-to-js";
import * as ImagePicker from "expo-image-picker";
import {
  deleteUser,
  signInWithEmailAndPassword,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  writeBatch,
  onSnapshot,
} from "firebase/firestore";
import {
  deleteObject,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import ProfilePicture from "react-native-profile-picture";

import { db, auth, storage } from "../config";
import AppStyles from "../styles/AppStyles";

const Settings = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [fullName, setFullName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigation = useNavigation();

  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    console.log("profilePicture", profilePicture);
  }, [profilePicture]);

  useEffect(() => {
    getDoc(doc(db, `users/${auth.currentUser.uid}`)).then((doc) => {
      setFullName(doc.get("fullName"));
    });

    const unsubscribe = onSnapshot(
      doc(db, `users/${auth.currentUser.uid}`),
      (doc) => {
        setProfilePicture(doc.get("photoURL"));
      }
    );

    return unsubscribe;
  }, []);

  const validateChangeProfilePicture = () => {
    if (!currentPassword) {
      setErrorMsg("Please fill in the current password field");
      return;
    }
    changeProfilePicture();
  };

  const validateChangeName = () => {
    if (!fullName || !currentPassword) {
      setErrorMsg("Please fill in the full name and current password fields");
      return;
    }
    updateUserName();
  };

  const validateUpdatePassword = () => {
    if (!currentPassword || !newPassword) {
      setErrorMsg("Please fill the current password and new password fields");
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

  const askForImage = () => {
    const options = ["Take a photo", "Choose from library", "Cancel"];
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          takePhotoAsync();
        } else if (buttonIndex === 1) {
          pickImageAsync();
        }
      }
    );
  };

  const getBlobFromUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const uploadImage = async (imageUri) => {
    const blob = await getBlobFromUri(imageUri);

    const storageRef = ref(storage, `users/${auth.currentUser.uid}/profile`);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.fround(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        ).toFixed(2);
        console.log(`Uploading... ${progress}%`);
      },
      (error) => {
        console.log("upload failed");
        console.log(error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("Download URL: ", url);
        updateDoc(doc(db, "users", auth.currentUser.uid), {
          photoURL: url,
        });
      }
    );
  };

  const takePhotoAsync = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      console.log(result);
      uploadImage(result.assets[0].uri);
    } else {
      alert("You did not take any photo.");
    }
  };

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  const changeProfilePicture = async () => {
    const [error, userCredentials] = await to(
      signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword)
    );
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    const { user } = userCredentials;
    askForImage(user);
  };

  const updateUserName = async () => {
    let [error, userCredentials] = await to(
      signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword)
    );
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    const { user } = userCredentials;
    [error] = await to(updateProfile(user, { displayName: fullName }));
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, { displayName: fullName });
    setErrorMsg("");
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
        isPicture={!!profilePicture}
        requirePicture={profilePicture}
        user={auth.currentUser.displayName}
        shape="circle"
      />
      <Button title="edit" onPress={validateChangeProfilePicture} />
      <TextInput
        style={[AppStyles.textInput, AppStyles.darkTextInput]}
        placeholder="Full name"
        placeholderTextColor="#bebebe"
        onChangeText={setFullName}
        value={fullName ?? ""}
      />
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
      <Button title="Change Name" onPress={validateChangeName} />
      <Button title="Update Password" onPress={validateUpdatePassword} />
      <Button title="Delete Account" onPress={validateDeleteUser} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default Settings;
