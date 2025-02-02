// Firebase configuration – replace these with your Firebase project settings.
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const discordUsernameInput = document.getElementById("discord-username-input");
    const loginFormDiv = document.getElementById("login-form");
    const simulateLoginBtn = document.getElementById("simulate-login-btn");
    const userPanel = document.getElementById("user-panel");
    const welcomeMessage = document.getElementById("welcome-message");
    const logoutButton = document.getElementById("logout-btn");
    const navManage = document.getElementById("nav-manage");
    const sectionAll = document.getElementById("section-all");
    const sectionManage = document.getElementById("section-manage");
    const pluginForm = document.getElementById("plugin-form");
    const userPluginList = document.getElementById("user-plugin-list");
    const pluginList = document.getElementById("plugin-list");
    const searchInput = document.getElementById("search-input");

    // Simulated login (using form input)
    const storedUser = getStoredUser();
    if (storedUser) {
        displayUserInfo(storedUser);
    } else {
        loginFormDiv.classList.remove("hidden");
    }

    // Navigation menu: switch between All Plugins and Manage Plugins
    document.getElementById("nav-all").addEventListener("click", (e) => {
        e.preventDefault();
        sectionAll.classList.remove("hidden");
        sectionManage.classList.add("hidden");
    });

    navManage.addEventListener("click", (e) => {
        e.preventDefault();
        if (getStoredUser()) {
            sectionManage.classList.remove("hidden");
            sectionAll.classList.add("hidden");
        }
    });

    // Simulated login form event
    simulateLoginBtn.addEventListener("click", () => {
        const username = discordUsernameInput.value.trim();
        if (username.length < 2 || username.length > 32) {
            alert("Username must be between 2 and 32 characters.");
            return;
        }
        const user = { username };
        storeUser(user);
        displayUserInfo(user);
    });

    // Logout event
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("discordUser");
        window.location.reload();
    });

    // Display user info and update UI for logged-in users
    function displayUserInfo(user) {
        welcomeMessage.textContent = `Welcome, ${user.username}`;
        userPanel.classList.remove("hidden");
        loginFormDiv.classList.add("hidden");
        navManage.classList.remove("hidden");
        // Show Manage Plugins section by default
        sectionManage.classList.remove("hidden");
        sectionAll.classList.add("hidden");
        loadUserPlugins(user.username);
    }

    // Helper functions to get and store user in localStorage
    function getStoredUser() {
        const userStr = localStorage.getItem("discordUser");
        return userStr ? JSON.parse(userStr) : null;
    }

    function storeUser(user) {
        localStorage.setItem("discordUser", JSON.stringify(user));
    }

    // Firestore: Plugin Functions
    async function getNextPluginId() {
        const counterRef = db.collection("counters").doc("pluginCounter");
        return db.runTransaction(async (transaction) => {
            const doc = await transaction.get(counterRef);
            if (!doc.exists) {
                transaction.set(counterRef, { lastId: 1 });
                return 1;
            } else {
                const lastId = doc.data().lastId;
                const nextId = lastId + 1;
                transaction.update(counterRef, { lastId: nextId });
                return nextId;
            }
        });
    }

    // Save a plugin to Firestore
    async function savePlugin(plugin) {
        try {
            const nextId = await getNextPluginId();
            plugin.autoId = nextId;
            await db.collection("plugins").add(plugin);
            alert("Plugin added successfully!");
        } catch (error) {
            console.error("Error saving plugin:", error);
            alert("Error adding plugin. Please try again.");
        }
    }

    // Load all plugins (public view) from Firestore
    async function loadAllPlugins() {
        try {
            const snapshot = await db.collection("plugins")
                .orderBy("autoId", "asc")
                .get();
            const plugins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (plugins.length === 0) {
                pluginList.innerHTML = "<p>No plugins available.</p>";
            } else {
                renderPluginList(plugins, pluginList, false);
            }
        } catch (error) {
            console.error("Error loading all plugins:", error);
        }
    }

    // Load plugins for the current user (management view)
    async function loadUserPlugins(username) {
        try {
            const snapshot = await db.collection("plugins")
                .where("author", "==", username)
                .orderBy("autoId", "asc")
                .get();
            const userPlugins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (userPlugins.length === 0) {
                userPluginList.innerHTML = "<p>You have no plugins uploaded.</p>";
            } else {
                renderPluginList(userPlugins, userPluginList, true);
            }
        } catch (error) {
            console.error("Error loading user plugins:", error);
        }
    }

    // Delete a plugin from Firestore
    async function deletePlugin(docId) {
        try {
            await db.collection("plugins").doc(docId).delete();
            loadAllPlugins();
            const user = getStoredUser();
            if (user) loadUserPlugins(user.username);
        } catch (error) {
            console.error("Error deleting plugin:", error);
        }
    }

    // Render a list of plugins into a container
    function renderPluginList(plugins, container, management) {
        container.innerHTML = "";
        const currentUser = getStoredUser() ? getStoredUser().username.toLowerCase() : "";
        plugins.forEach(plugin => {
            const card = document.createElement("div");
            card.classList.add("plugin-card");
            card.innerHTML = `
              <h3>${plugin.title} (ID: ${plugin.autoId})</h3>
              <p>${plugin.description}</p>
              <p><strong>Model ID:</strong> ${plugin.modelId}</p>
              <p><strong>Author:</strong> ${plugin.author}</p>
            `;
            // Show a delete button if:
            if (management || (currentUser === "theboc" && currentUser !== "")) {
                const delBtn = document.createElement("button");
                delBtn.textContent = "Delete Plugin";
                delBtn.addEventListener("click", () => {
                    if (confirm("Are you sure you want to delete this plugin?")) {
                        deletePlugin(plugin.id);
                    }
                });
                card.appendChild(delBtn);
            }
            container.appendChild(card);
        });
    }

    // Initialize by loading all plugins if the user is not logged in.
    if (!getStoredUser()) {
        loadAllPlugins();
    }
});
