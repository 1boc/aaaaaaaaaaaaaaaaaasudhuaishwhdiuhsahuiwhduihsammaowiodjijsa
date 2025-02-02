import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { getDatabase, ref, get, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDRgKY...",
    authDomain: "cmdbar-plugin-store.firebaseapp.com",
    projectId: "cmdbar-plugin-store",
    storageBucket: "cmdbar-plugin-store.firebasestorage.app",
    messagingSenderId: "116790966011",
    appId: "1:116790966011:web:84f9de037fde8551e0625e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);
export { db, rtdb };
