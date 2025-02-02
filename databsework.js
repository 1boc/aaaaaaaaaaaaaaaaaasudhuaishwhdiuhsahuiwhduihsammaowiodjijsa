import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, signInWithPopup, OAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRgKYjFqK6geiMq-BdWoJShdo-UR7HOcw",
  authDomain: "cmdbar-plugin-store.firebaseapp.com",
  databaseURL: "https://cmdbar-plugin-store-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cmdbar-plugin-store",
  storageBucket: "cmdbar-plugin-store.firebasestorage.app",
  messagingSenderId: "116790966011",
  appId: "1:116790966011:web:84f9de037fde8551e0625e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
