import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyCtmQ3YXaf4KxHfztDl2846q8Galz2HOuk",
  authDomain: "mfte-simple-92c08.firebaseapp.com",
  databaseURL: "https://mfte-simple-92c08-default-rtdb.firebaseio.com",
  projectId: "mfte-simple-92c08",
  storageBucket: "mfte-simple-92c08.appspot.com",
  messagingSenderId: "594673713013",
  appId: "1:594673713013:web:e6e60f494477b92a18dd3c",
  measurementId: "G-MSQZT5PQH1",
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export default app;
