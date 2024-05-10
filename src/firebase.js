// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDP9tCSQWvfiJTGldoC8JCDwHdRAOFdvE",
  authDomain: "todo-df894.firebaseapp.com",
  databaseURL: "https://todo-df894-default-rtdb.firebaseio.com",
  projectId: "todo-df894",
  storageBucket: "todo-df894.appspot.com",
  messagingSenderId: "1046042106133",
  appId: "1:1046042106133:web:cad2e57c61e6f8ce6ff11c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();