// Firebase and DOM elements
const discordLoginBtn = document.getElementById("discord-login");
const myPluginsBtn = document.getElementById("my-plugins-btn");
const createPluginBtn = document.getElementById("create-plugin-btn");
const uploadBtn = document.getElementById("upload-plugin");
const modelIdInput = document.getElementById("model-id");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const pluginList = document.getElementById("plugin-list");
const myPluginList = document.getElementById("my-plugin-list");
const searchInput = document.getElementById("plugin-search");
const userMenu = document.getElementById("user-menu");
const pluginUpload = document.getElementById("plugin-upload");
const myPluginsSection = document.getElementById("my-plugins");
const logoutBtn = document.getElementById("logout-btn");

// Firebase authentication and Firestore operations
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
    userMenu.style.display = 'block';
    loadPlugins();
    loadUserPlugins();
  } catch (error) {
    console.error("Error during Discord login:", error);
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    localStorage.removeItem('discordUserId');
    userMenu.style.display = 'none';
    loadPlugins();  // Reload plugin list for non-logged-in users
  }).catch((error) => {
    console.error("Error logging out:", error);
  });
});

myPluginsBtn.addEventListener("click", () => {
  pluginUpload.style.display = 'none';
  myPluginsSection.style.display = 'block';
});

createPluginBtn.addEventListener("click", () => {
  pluginUpload.style.display = 'block';
  myPluginsSection.style.display = 'none';
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

// Load all plugins
async function loadPlugins() {
  const querySnapshot = await getDocs(collection(db, "plugins"));
  pluginList.innerHTML = ""; // Clear current list
  querySnapshot.forEach(doc => {
    const plugin = doc.data();
    const pluginCard = document.createElement('div');
    pluginCard.classList.add('plugin-card');
    pluginCard.innerHTML = `
      <div>
        <strong>${plugin.title}</strong><br>
        Model ID: ${plugin.modelId}<br>
        Published by: ${plugin.discordUsername}<br>
        ${plugin.description ? `<em>${plugin.description}</em>` : ""}
      </div>
    `;
    pluginList.appendChild(pluginCard);
  });
}

// Load user plugins
async function loadUserPlugins() {
  const userId = localStorage.getItem('discordUserId');
  if (!userId) {
    return;
  }

  const querySnapshot = await getDocs(collection(db, "plugins"));
  myPluginList.innerHTML = ""; // Clear current list
  querySnapshot.forEach(doc => {
    const plugin = doc.data();
    if (plugin.userId === userId) {
      const pluginCard = document.createElement('div');
      pluginCard.classList.add('plugin-card');
      pluginCard.innerHTML = `
        <div>
          <strong>${plugin.title}</strong><br>
          Model ID: ${plugin.modelId}<br>
          <button onclick="deletePlugin('${doc.id}')">Delete</button>
        </div>
      `;
      myPluginList.appendChild(pluginCard);
    }
  });
}

// Delete user plugin
async function deletePlugin(pluginId) {
  await deleteDoc(doc(db, "plugins", pluginId));
  loadUserPlugins();
}
