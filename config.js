import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  initializeAuth,
  getAuth,
  // connectAuthEmulator,
} from "firebase/auth/react-native";
import {
  getFirestore /*, connectFirestoreEmulator */,
} from "firebase/firestore";
import { getStorage /*, connectStorageEmulator */ } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCJ2FY69u3jR8WMVLCT_TDrkKyqkUE2Y3k",
  authDomain: "dogether-78b6f.firebaseapp.com",
  projectId: "dogether-78b6f",
  storageBucket: "dogether-78b6f.appspot.com",
  messagingSenderId: "1038829035917",
  appId: "1:1038829035917:web:05d7bee0c0c5f18a28ddc4",
  measurementId: "G-VFJ7E1L2CC",
};

let app, auth;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth();
}

const db = getFirestore(app);
const storage = getStorage(app);

// TODO: Fix local emulators
// if (__DEV__) {
//   connectFirestoreEmulator(db, "127.0.0.1", 8080);
//   connectStorageEmulator(storage, "localhost", 9199);
//   connectAuthEmulator(auth, "http://localhost:9099");
// }

export { auth, db, storage };
