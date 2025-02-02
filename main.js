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
    const searchInput = document.getElementById("search-input");
  
    // Replace with your actual Discord OAuth URL (make sure redirect_uri is correct)
    const DISCORD_OAUTH_URL = "https://discord.com/oauth2/authorize?client_id=1335621884259336303&response_type=code&redirect_uri=https%3A%2F%2F1boc.github.io%2Fcmdbar%2F&scope=identify";
  
    // Check login state from localStorage
    const storedUser = localStorage.getItem("discordUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      displayUserInfo(user);
    } else {
      // Show the login button if not logged in
      discordLoginButton.classList.remove("hidden");
    }
  
    // Load all plugins for public display
    loadAllPlugins();
  
    // Event Listener for Discord login button
    discordLoginButton.addEventListener("click", () => {
      // Redirect to Discord OAuth for authentication
      window.location.href = DISCORD_OAUTH_URL;
    });
  
    // Event Listener for Logout button
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("discordUser");
      window.location.reload();
    });
  
    // Display user info and show plugin management if logged in
    function displayUserInfo(user) {
      welcomeMessage.textContent = `Welcome, ${user.username}`;
      userPanel.classList.remove("hidden");
      discordLoginButton.classList.add("hidden");
      pluginManagementSection.classList.remove("hidden");
      loadUserPlugins(user.username);
    }
  
    // Handle OAuth redirection: check for a "code" parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      // In a real application, exchange the code for an access token on your backend.
      // Here we simulate the process.
      fetchDiscordUserData(code).then(user => {
        localStorage.setItem("discordUser", JSON.stringify(user));
        // Remove the code from the URL (optional)
        window.history.replaceState({}, document.title, window.location.pathname);
        displayUserInfo(user);
      });
    }
  
    // Simulated function to fetch Discord user data (replace with your API call)
    async function fetchDiscordUserData(code) {
      // Simulate network delay and return a dummy user with a Discord username
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ username: "ActualDiscordUser" });
        }, 1000);
      });
    }
  
    // Save a plugin to localStorage
    function savePlugin(plugin) {
      let plugins = JSON.parse(localStorage.getItem("plugins")) || [];
      plugins.push(plugin);
      localStorage.setItem("plugins", JSON.stringify(plugins));
    }
  
    // Load all plugins (for public view)
    function loadAllPlugins() {
      const plugins = JSON.parse(localStorage.getItem("plugins")) || [];
      renderPluginList(plugins, pluginList, false);
    }
  
    // Load plugins uploaded by the current user (for management)
    function loadUserPlugins(username) {
      const plugins = JSON.parse(localStorage.getItem("plugins")) || [];
      const userPlugins = plugins.filter(plugin => plugin.author === username);
      renderPluginList(userPlugins, userPluginList, true);
    }
  
    // Render a list of plugins into a given container
    // If management is true, include a delete button for each plugin.
    function renderPluginList(plugins, container, management) {
      container.innerHTML = "";
      plugins.forEach(plugin => {
        const pluginCard = document.createElement("div");
        pluginCard.classList.add("plugin-card");
        pluginCard.innerHTML = `
          <h3>${plugin.title}</h3>
          <p>${plugin.description}</p>
          <p><strong>Model ID:</strong> ${plugin.modelId}</p>
          <p><strong>Author:</strong> ${plugin.author}</p>
        `;
        if (management) {
          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "Delete Plugin";
          deleteBtn.addEventListener("click", () => {
            deletePlugin(plugin.id);
          });
          pluginCard.appendChild(deleteBtn);
        }
        container.appendChild(pluginCard);
      });
    }
  
    // Search functionality for public plugins
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const allPlugins = JSON.parse(localStorage.getItem("plugins")) || [];
      const filtered = allPlugins.filter(plugin =>
        plugin.title.toLowerCase().includes(query) ||
        (plugin.description && plugin.description.toLowerCase().includes(query)) ||
        plugin.modelId.toLowerCase().includes(query) ||
        plugin.author.toLowerCase().includes(query)
      );
      renderPluginList(filtered, pluginList, false);
    });
  
    // Handle plugin form submission (only for logged-in users)
    pluginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("plugin-title").value;
      const modelId = document.getElementById("plugin-model-id").value;
      const description = document.getElementById("plugin-description").value;
      // Use Date.now() for a simple unique ID
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
  
  // Global deletePlugin function for use in inline event listeners (if needed)
  function deletePlugin(id) {
    let plugins = JSON.parse(localStorage.getItem("plugins")) || [];
    plugins = plugins.filter(plugin => plugin.id !== id);
    localStorage.setItem("plugins", JSON.stringify(plugins));
    // Refresh both lists
    const storedUser = localStorage.getItem("discordUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Update user management list
      const userPluginList = document.getElementById("user-plugin-list");
      const userPlugins = plugins.filter(plugin => plugin.author === user.username);
      renderPluginList(userPlugins, userPluginList, true);
    }
    // Update public list
    const pluginList = document.getElementById("plugin-list");
    renderPluginList(plugins, pluginList, false);
  }
  
  // Helper: Render a plugin list (moved outside of DOMContentLoaded for reuse)
  function renderPluginList(plugins, container, management) {
    container.innerHTML = "";
    plugins.forEach(plugin => {
      const pluginCard = document.createElement("div");
      pluginCard.classList.add("plugin-card");
      pluginCard.innerHTML = `
        <h3>${plugin.title}</h3>
        <p>${plugin.description}</p>
        <p><strong>Model ID:</strong> ${plugin.modelId}</p>
        <p><strong>Author:</strong> ${plugin.author}</p>
      `;
      if (management) {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete Plugin";
        deleteBtn.addEventListener("click", () => {
          deletePlugin(plugin.id);
        });
        pluginCard.appendChild(deleteBtn);
      }
      container.appendChild(pluginCard);
    });
  }
  