// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push } from "firebase/database";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDRgKYjF...",
  authDomain: "cmdbar-plugin-store.firebaseapp.com",
  databaseURL: "https://cmdbar-plugin-store-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cmdbar-plugin-store",
  storageBucket: "cmdbar-plugin-store.firebasestorage.app",
  messagingSenderId: "116790966011",
  appId: "1:116790966011:web:84f9de037fde8551e0625e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const discordLoginUrl = "https://discord.com/oauth2/authorize?client_id=1335621884259336303&response_type=code&redirect_uri=https%3A%2F%2F1boc.github.io%2Fcmdbar%2F&scope=identify+openid";

// Function to redirect to Discord login
function loginWithDiscord() {
    window.location.href = discordLoginUrl;
}

// Handle Discord login response (after redirect)
async function handleDiscordAuth() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        console.log("Discord Auth Code:", code);
        // Here you would exchange the code for an access token via your backend
    }
}

// Call this on page load to check if the user is logged in
handleDiscordAuth();
function addPlugin(title, modelID, description) {
    const pluginsRef = ref(db, "plugins/");
    const newPluginRef = push(pluginsRef);

    set(newPluginRef, {
        id: newPluginRef.key,  // Unique Plugin ID
        title: title,
        modelID: modelID,
        description: description
    }).then(() => {
        console.log("Plugin added successfully!");
    }).catch((error) => {
        console.error("Error adding plugin:", error);
    });
}
function fetchPlugins() {
    const pluginsRef = ref(db, "plugins/");
    
    get(pluginsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const plugins = snapshot.val();
            const pluginList = document.getElementById("plugin-list");
            pluginList.innerHTML = "";  // Clear list

            Object.values(plugins).forEach(plugin => {
                const pluginItem = `
                    <div class="plugin-card">
                        <h3>${plugin.title}</h3>
                        <p><strong>Model ID:</strong> ${plugin.modelID}</p>
                        <p>${plugin.description}</p>
                        <p><strong>ID:</strong> ${plugin.id}</p>
                    </div>
                `;
                pluginList.innerHTML += pluginItem;
            });
        }
    }).catch((error) => {
        console.error("Error fetching plugins:", error);
    });
}

// Call fetchPlugins on page load
fetchPlugins();
