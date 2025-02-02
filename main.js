document.addEventListener('DOMContentLoaded', () => {
    // DOM references
    const discordLoginButton = document.getElementById("discord-login");
    const userPanel = document.getElementById("user-panel");
    const welcomeMessage = document.getElementById("welcome-message");
    const logoutButton = document.getElementById("logout-btn");
    const pluginManagementSection = document.getElementById("plugin-management");
    const pluginForm = document.getElementById("plugin-form");
    const userPluginList = document.getElementById("user-plugin-list");
    const pluginList = document.getElementById("plugin-list");
  
    // Replace with your actual redirect URI and client_id when using Discord OAuth
    const DISCORD_OAUTH_URL = "https://discord.com/oauth2/authorize?client_id=1335621884259336303&response_type=code&redirect_uri=https%3A%2F%2F1boc.github.io%2Fcmdbar%2F&scope=identify";
  
    // Check login state from localStorage
    const storedUser = localStorage.getItem("discordUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      displayUserInfo(user);
    } else {
      // If not logged in, show the login button
      discordLoginButton.classList.remove("hidden");
    }
  
    // Always load the plugin list for everyone
    loadAllPlugins();
  
    // Event Listener for Discord login button
    discordLoginButton.addEventListener("click", () => {
      // Redirect user to Discord OAuth for authentication
      window.location.href = DISCORD_OAUTH_URL;
    });
  
    // Event Listener for Logout button
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("discordUser");
      // Optionally, you can clear user-specific plugins if needed:
      // localStorage.removeItem("userPlugins");
      window.location.reload();
    });
  
    // Function to display user info and show management UI
    function displayUserInfo(user) {
      welcomeMessage.textContent = `Welcome, ${user.username}`;
      userPanel.classList.remove("hidden");
      discordLoginButton.classList.add("hidden");
      pluginManagementSection.classList.remove("hidden");
      loadUserPlugins(user.username);
    }
  
    // Handle OAuth redirection: look for a code parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      // In production, exchange the code for an access token on your backend.
      // Here, we simulate the process and return a dummy user.
      fetchDiscordUserData(code).then(user => {
        localStorage.setItem("discordUser", JSON.stringify(user));
        // Remove the code from the URL (optional)
        window.history.replaceState({}, document.title, window.location.pathname);
        displayUserInfo(user);
      });
    }
  
    // Simulated function to fetch Discord user data
    async function fetchDiscordUserData(code) {
      // Simulate an API call delay and return a dummy user
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ username: "DemoUser" }); // Replace with actual Discord data
        }, 1000);
      });
    }
  
    // Save a plugin (global list) in localStorage
    function savePlugin(plugin) {
      let plugins = JSON.parse(localStorage.getItem("plugins")) || [];
      plugins.push(plugin);
      localStorage.setItem("plugins", JSON.stringify(plugins));
    }
  
    // Load all plugins for public display
    function loadAllPlugins() {
      const plugins = JSON.parse(localStorage.getItem("plugins")) || [];
      pluginList.innerHTML = "";
      plugins.forEach(plugin => {
        const pluginCard = document.createElement("div");
        pluginCard.classList.add("plugin-card");
        pluginCard.innerHTML = `
          <h3>${plugin.title}</h3>
          <p>${plugin.description}</p>
          <p><strong>Model ID:</strong> ${plugin.modelId}</p>
          <p><strong>Author:</strong> ${plugin.author}</p>
        `;
        pluginList.appendChild(pluginCard);
      });
    }
  
    // Load only the plugins uploaded by the current user (for management)
    function loadUserPlugins(username) {
      const plugins = JSON.parse(localStorage.getItem("plugins")) || [];
      const userPlugins = plugins.filter(plugin => plugin.author === username);
      userPluginList.innerHTML = "";
      userPlugins.forEach(plugin => {
        const pluginCard = document.createElement("div");
        pluginCard.classList.add("plugin-card");
        pluginCard.innerHTML = `
          <h3>${plugin.title}</h3>
          <p>${plugin.description}</p>
          <p><strong>Model ID:</strong> ${plugin.modelId}</p>
          <button onclick="deletePlugin(${plugin.id})">Delete Plugin</button>
        `;
        userPluginList.appendChild(pluginCard);
      });
    }
  
    // Handle plugin form submission
    pluginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("plugin-title").value;
      const modelId = document.getElementById("plugin-model-id").value;
      const description = document.getElementById("plugin-description").value;
      // For uniqueness, use Date.now() as a simple ID
      const id = Date.now();
      // Get current user's username from localStorage
      const user = JSON.parse(localStorage.getItem("discordUser"));
      const plugin = { id, title, modelId, description, author: user.username };
      savePlugin(plugin);
      // Refresh both public and user-specific lists
      loadAllPlugins();
      loadUserPlugins(user.username);
      // Clear the form
      pluginForm.reset();
    });
  });
  
  // Global deletePlugin function (needed for inline onclick)
  function deletePlugin(id) {
    let plugins = JSON.parse(localStorage.getItem("plugins")) || [];
    plugins = plugins.filter(plugin => plugin.id !== id);
    localStorage.setItem("plugins", JSON.stringify(plugins));
    // Reload both plugin lists (simulate a page update)
    document.getElementById("plugin-list").innerHTML = "";
    document.getElementById("user-plugin-list").innerHTML = "";
    // Reload public list
    const allPlugins = JSON.parse(localStorage.getItem("plugins")) || [];
    allPlugins.forEach(plugin => {
      const pluginCard = document.createElement("div");
      pluginCard.classList.add("plugin-card");
      pluginCard.innerHTML = `
        <h3>${plugin.title}</h3>
        <p>${plugin.description}</p>
        <p><strong>Model ID:</strong> ${plugin.modelId}</p>
        <p><strong>Author:</strong> ${plugin.author}</p>
      `;
      document.getElementById("plugin-list").appendChild(pluginCard);
    });
    // If the user is logged in, refresh their management list too.
    const storedUser = localStorage.getItem("discordUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userPlugins = allPlugins.filter(plugin => plugin.author === user.username);
      userPlugins.forEach(plugin => {
        const pluginCard = document.createElement("div");
        pluginCard.classList.add("plugin-card");
        pluginCard.innerHTML = `
          <h3>${plugin.title}</h3>
          <p>${plugin.description}</p>
          <p><strong>Model ID:</strong> ${plugin.modelId}</p>
          <button onclick="deletePlugin(${plugin.id})">Delete Plugin</button>
        `;
        document.getElementById("user-plugin-list").appendChild(pluginCard);
      });
    }
  }
  