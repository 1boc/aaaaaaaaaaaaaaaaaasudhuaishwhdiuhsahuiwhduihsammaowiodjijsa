// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, push } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

// Discord OAuth2 URL
const discordLoginUrl = "https://discord.com/oauth2/authorize?client_id=1335621884259336303&response_type=code&redirect_uri=https%3A%2F%2F1boc.github.io%2Fcmdbar%2F&scope=identify+openid";

document.getElementById("loginBtn").addEventListener("click", () => {
    window.location.href = discordLoginUrl;
});

// Fetch Plugins from Firebase
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

// Add Plugin to Firebase
document.getElementById("add-plugin-btn").addEventListener("click", () => {
    const title = document.getElementById("plugin-title").value;
    const modelID = document.getElementById("plugin-model-id").value;
    const description = document.getElementById("plugin-description").value;

    if (!title || !modelID || !description) {
        alert("All fields are required!");
        return;
    }

    const pluginsRef = ref(db, "plugins/");
    const newPluginRef = push(pluginsRef);

    set(newPluginRef, {
        id: newPluginRef.key,  // Unique Plugin ID
        title: title,
        modelID: modelID,
        description: description
    }).then(() => {
        alert("Plugin added successfully!");
        document.getElementById("plugin-title").value = "";
        document.getElementById("plugin-model-id").value = "";
        document.getElementById("plugin-description").value = "";
        fetchPlugins();
    }).catch((error) => {
        console.error("Error adding plugin:", error);
    });
});

// Fetch plugins when the page loads
fetchPlugins();
