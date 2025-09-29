// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeXoED-5HB3nozlvRooxZuXs1qYgxbkCs",
  authDomain: "callout-29141.firebaseapp.com",
  projectId: "callout-29141",
  storageBucket: "callout-29141.firebasestorage.app",
  messagingSenderId: "376044277203",
  appId: "1:376044277203:web:b63b6e34768b0546583326",
  measurementId: "G-5QXSHTBK2J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  const { getAnalytics } = require("firebase/analytics");
  analytics = getAnalytics(app);
}

export { analytics, app, auth, db };

