import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, OAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

// Firebase configuration (already provided)
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

// DOM Elements
const discordLoginBtn = document.getElementById("discord-login");
const uploadBtn = document.getElementById("upload-plugin");
const modelIdInput = document.getElementById("model-id");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const pluginList = document.getElementById("plugin-list");

// Discord Login
discordLoginBtn.addEventListener("click", async () => {
  const provider = new OAuthProvider('discord.com');
  provider.setCustomParameters({
    'redirect_uri': 'https://1boc.github.io/cmdbar/',
    'scope': 'identify+openid'
  });
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    localStorage.setItem('discordUserId', user.uid);
    console.log('Logged in as:', user.displayName);
  } catch (error) {
    console.error("Error during Discord login:", error);
  }
});

// Upload Plugin
uploadBtn.addEventListener("click", async () => {
  const userId = localStorage.getItem('discordUserId');
  if (!userId) {
    alert("You need to log in with Discord first.");
    return;
  }
  
  const modelId = modelIdInput.value;
  const title = titleInput.value;
  const description = descriptionInput.value;

  if (!modelId || !title) {
    alert("Model ID and Title are required.");
    return;
  }

  try {
    await addDoc(collection(db, "plugins"), {
      userId: userId,
      discordUsername: auth.currentUser.displayName,
      modelId: modelId,
      title: title,
      description: description,
      timestamp: new Date()
    });
    alert("Plugin uploaded!");
    loadUserPlugins();
  } catch (error) {
    console.error("Error uploading plugin:", error);
  }
});

// Load User Plugins
async function loadUserPlugins() {
  const userId = localStorage.getItem('discordUserId');
  if (!userId) {
    return;
  }

  const querySnapshot = await getDocs(collection(db, "plugins"));
  pluginList.innerHTML = ""; // Clear current list
  querySnapshot.forEach(doc => {
    const plugin = doc.data();
    if (plugin.userId === userId) {
      const pluginCard = document.createElement('div');
      pluginCard.classList.add('plugin-card');
      pluginCard.innerHTML = `
        <div>
          <strong>${plugin.title}</strong><br>
          Model ID: ${plugin.modelId}<br>
          ${plugin.description ? `<em>${plugin.description}</em>` : ""}
        </div>
        <button onclick="deletePlugin('${doc.id}')">Delete</button>
      `;
      pluginList.appendChild(pluginCard);
    }
  });
}

// Delete Plugin
async function deletePlugin(pluginId) {
  try {
    await deleteDoc(doc(db, "plugins", pluginId));
    alert("Plugin deleted!");
    loadUserPlugins(); // Refresh the list
  } catch (error) {
    console.error("Error deleting plugin:", error);
  }
}

// Automatically load user plugins if logged in
onAuthStateChanged(auth, user => {
  if (user) {
    loadUserPlugins();
  }
});
