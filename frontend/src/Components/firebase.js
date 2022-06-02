
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWZm3mAH0q5DilI1b5l7mTgSNCSC6DwjE",
  authDomain: "registration-form-79212.firebaseapp.com",
  databaseURL: "https://registration-form-79212-default-rtdb.firebaseio.com",
  projectId: "registration-form-79212",
  storageBucket: "registration-form-79212.appspot.com",
  messagingSenderId: "756021367990",
  appId: "1:756021367990:web:fc3499ebb747cbaa73c217",
  measurementId: "G-TL1R0SPJJX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);
