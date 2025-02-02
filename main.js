document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const discordLoginButton = document.getElementById("discord-login");
    const userPanel = document.getElementById("user-panel");
    const welcomeMessage = document.getElementById("welcome-message");
    const logoutButton = document.getElementById("logout-btn");
    const pluginManagementSection = document.getElementById("section-manage");
    const pluginForm = document.getElementById("plugin-form");
    const userPluginList = document.getElementById("user-plugin-list");
    const pluginList = document.getElementById("plugin-list");
    const searchInput = document.getElementById("search-input");
  
    // Navigation menu references
    const navAll = document.getElementById("nav-all");
    const navManage = document.getElementById("nav-manage");
    const sectionAll = document.getElementById("section-all");
    const sectionManage = document.getElementById("section-manage");
  
    // Discord OAuth URL – update with your actual client_id and redirect_uri
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
  
    // Always load the public plugin list
    loadAllPlugins();
  
    // Navigation Menu: switch between sections
    navAll.addEventListener("click", (e) => {
      e.preventDefault();
      sectionAll.classList.remove("hidden");
      sectionManage.classList.add("hidden");
    });
  
    navManage.addEventListener("click", (e) => {
      e.preventDefault();
      // Only show if the user is logged in
      if (localStorage.getItem("discordUser")) {
        sectionManage.classList.remove("hidden");
        sectionAll.classList.add("hidden");
      }
    });
  
    // Discord Login Button Event
    discordLoginButton.addEventListener("click", () => {
      console.log("Discord login button clicked");
      window.location.href = DISCORD_OAUTH_URL;
    });
  
    // Logout Button Event
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("discordUser");
      // Optionally clear user-specific plugins if desired
      // localStorage.removeItem("userPlugins");
      window.location.reload();
    });
  
    // Display user info, update UI, and show Manage Plugins menu if logged in
    function displayUserInfo(user) {
      welcomeMessage.textContent = `Welcome, ${user.username}`;
      userPanel.classList.remove("hidden");
      discordLoginButton.classList.add("hidden");
      // Show the "Manage Plugins" menu item
      navManage.classList.remove("hidden");
      // By default, show All Plugins section; user can click Manage if desired.
      // Also, if logged in, load the user's plugins.
      loadUserPlugins(user.username);
    }
  
    // Handle OAuth redirection: check for a "code" parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      // In production, you would exchange the code for an access token on your backend.
      // Here, we simulate the process.
      fetchDiscordUserData(code).then(user => {
        localStorage.setItem("discordUser", JSON.stringify(user));
        // Remove the "code" from the URL (optional)
        window.history.replaceState({}, document.title, window.location.pathname);
        displayUserInfo(user);
      });
    }
  
    // Simulated function to fetch Discord user data – replace with your API call
    async function fetchDiscordUserData(code) {
      // Simulate network delay and return a dummy user object
      return new Promise(resolve => {
        setTimeout(() => {
          // Here, you should return the actual Discord username from your backend.
          // For demonstration, we check if a query parameter "username" is provided,
          // otherwise we default to "ActualDiscordUser"
          const simulatedUsername = "ActualDiscordUser"; // Change this as needed
          resolve({ username: simulatedUsername });
        }, 1000);
      });
    }
  
    // Save a plugin to localStorage (this simulates persistent storage in this demo)
    function savePlugin(plugin) {
      let plugins = JSON.parse(localStorage.getItem("plugins")) || [];
      plugins.push(plugin);
      localStorage.setItem("plugins", JSON.stringify(plugins));
    }
  
    // Load all plugins (public view)
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
  
    // Render a list of plugins into a given container.
    // If management is true, include a delete button.
    // Additionally, if the logged-in user is "theboc", add a delete button for every plugin.
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
        // If this is a management view (the plugin belongs to the logged-in user)
        // OR if the logged-in user is "theboc" (admin), show a delete button.
        const storedUser = localStorage.getItem("discordUser");
        if (management || (storedUser && JSON.parse(storedUser).username.toLowerCase() === "theboc")) {
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
      // Use Date.now() as a simple unique ID
      const id = Date.now();
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
  
  // Global deletePlugin function (for inline usage if needed)
  function deletePlugin(id) {
    let plugins = JSON.parse(localStorage.getItem("plugins")) || [];
    plugins = plugins.filter(plugin => plugin.id !== id);
    localStorage.setItem("plugins", JSON.stringify(plugins));
    // Refresh public list
    const pluginList = document.getElementById("plugin-list");
    renderPluginList(plugins, pluginList, false);
    // Refresh user management list if user is logged in
    const storedUser = localStorage.getItem("discordUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userPluginList = document.getElementById("user-plugin-list");
      const userPlugins = plugins.filter(plugin => plugin.author === user.username);
      renderPluginList(userPlugins, userPluginList, true);
    }
  }
  
  // Helper: Render a plugin list (defined globally for reuse)
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
      // Determine if a delete button should be shown:
      const storedUser = localStorage.getItem("discordUser");
      if (management || (storedUser && JSON.parse(storedUser).username.toLowerCase() === "theboc")) {
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
  