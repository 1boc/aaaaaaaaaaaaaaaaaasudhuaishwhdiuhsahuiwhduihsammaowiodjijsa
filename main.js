document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const discordLoginButton = document.getElementById("discord-login");
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
  
    // Replace with your actual Discord OAuth URL
    // Ensure that client_id and redirect_uri are properly set in your Discord Developer Portal.
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
  
    // Always load the public plugin list (visible to everyone)
    loadAllPlugins();
  
    // Navigation menu: switch between "All Plugins" and "Manage Plugins"
    document.getElementById("nav-all").addEventListener("click", (e) => {
      e.preventDefault();
      sectionAll.classList.remove("hidden");
      sectionManage.classList.add("hidden");
    });
    navManage.addEventListener("click", (e) => {
      e.preventDefault();
      if (localStorage.getItem("discordUser")) {
        sectionManage.classList.remove("hidden");
        sectionAll.classList.add("hidden");
      }
    });
  
    // Discord Login Button Event: redirect to Discord OAuth
    discordLoginButton.addEventListener("click", () => {
      console.log("Discord login button clicked");
      window.location.href = DISCORD_OAUTH_URL;
    });
  
    // Logout Button Event: clear login state and reload page
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("discordUser");
      window.location.reload();
    });
  
    // Display user info after login: update UI and show Manage Plugins menu
    function displayUserInfo(user) {
      welcomeMessage.textContent = `Welcome, ${user.username}`;
      userPanel.classList.remove("hidden");
      discordLoginButton.classList.add("hidden");
      // Show "Manage Plugins" navigation if logged in
      navManage.classList.remove("hidden");
      // By default, show the Manage Plugins section for logged-in users
      sectionManage.classList.remove("hidden");
      sectionAll.classList.add("hidden");
      // Load plugins uploaded by the user
      loadUserPlugins(user.username);
    }
  
    // Handle OAuth redirection: if URL has a "code" parameter, simulate user data fetch
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      // In production, exchange the code for an access token on your backend.
      // Here we simulate the process.
      fetchDiscordUserData(code).then(user => {
        localStorage.setItem("discordUser", JSON.stringify(user));
        // Remove the code parameter from the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        displayUserInfo(user);
      });
    }
  
    // Simulated function to fetch Discord user data – replace with your actual API call
    async function fetchDiscordUserData(code) {
      return new Promise(resolve => {
        setTimeout(() => {
          // Simulate receiving the actual Discord username.
          // Replace this dummy value with your real Discord username.
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
  
    // Render a list of plugins into the specified container.
    // If management is true, include a delete button.
    // Additionally, if the logged-in user is "theboc", show a delete button for every plugin.
    function renderPluginList(plugins, container, management) {
      container.innerHTML = "";
      const currentUser = localStorage.getItem("discordUser")
        ? JSON.parse(localStorage.getItem("discordUser")).username.toLowerCase()
        : "";
      plugins.forEach(plugin => {
        const pluginCard = document.createElement("div");
        pluginCard.classList.add("plugin-card");
        pluginCard.innerHTML = `
          <h3>${plugin.title}</h3>
          <p>${plugin.description}</p>
          <p><strong>Model ID:</strong> ${plugin.modelId}</p>
          <p><strong>Author:</strong> ${plugin.author}</p>
        `;
        // Show delete button if:
        // - In management view (the plugin belongs to the logged-in user)
        // OR if the logged-in user is "theboc" (admin)
        if (
          management ||
          (currentUser === "theboc" && currentUser !== "")
        ) {
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
      // Generate a unique ID using Date.now()
      const id = Date.now();
      const user = JSON.parse(localStorage.getItem("discordUser"));
      // Use the logged-in user's Discord username as the author
      const plugin = { id, title, modelId, description, author: user.username };
      savePlugin(plugin);
      // Refresh both the public plugin list and the user's plugin management list
      loadAllPlugins();
      loadUserPlugins(user.username);
      // Clear the form
      pluginForm.reset();
    });
  });
  
  // Global deletePlugin function
  function deletePlugin(id) {
    let plugins = JSON.parse(localStorage.getItem("plugins")) || [];
    plugins = plugins.filter(plugin => plugin.id !== id);
    localStorage.setItem("plugins", JSON.stringify(plugins));
    // Refresh the public plugin list
    const pluginList = document.getElementById("plugin-list");
    renderPluginList(plugins, pluginList, false);
    // Refresh the user plugin list if logged in
    const storedUser = localStorage.getItem("discordUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userPluginList = document.getElementById("user-plugin-list");
      const userPlugins = plugins.filter(plugin => plugin.author === user.username);
      renderPluginList(userPlugins, userPluginList, true);
    }
  }
  
  // Global helper: Render a plugin list into a given container
  function renderPluginList(plugins, container, management) {
    container.innerHTML = "";
    const currentUser = localStorage.getItem("discordUser")
      ? JSON.parse(localStorage.getItem("discordUser")).username.toLowerCase()
      : "";
    plugins.forEach(plugin => {
      const pluginCard = document.createElement("div");
      pluginCard.classList.add("plugin-card");
      pluginCard.innerHTML = `
        <h3>${plugin.title}</h3>
        <p>${plugin.description}</p>
        <p><strong>Model ID:</strong> ${plugin.modelId}</p>
        <p><strong>Author:</strong> ${plugin.author}</p>
      `;
      if (
        management ||
        (currentUser === "theboc" && currentUser !== "")
      ) {
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
  