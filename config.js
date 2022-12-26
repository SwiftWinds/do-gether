import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCJ2FY69u3jR8WMVLCT_TDrkKyqkUE2Y3k",
  authDomain: "dogether-78b6f.firebaseapp.com",
  projectId: "dogether-78b6f",
  storageBucket: "dogether-78b6f.appspot.com",
  messagingSenderId: "1038829035917",
  appId: "1:1038829035917:web:05d7bee0c0c5f18a28ddc4",
  measurementId: "G-VFJ7E1L2CC"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };