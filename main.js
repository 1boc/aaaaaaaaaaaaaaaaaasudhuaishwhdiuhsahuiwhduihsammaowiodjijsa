const discordLoginButton = document.getElementById('discord-login');
const pluginForm = document.getElementById('plugin-form');
const pluginList = document.getElementById('plugin-list');
const searchInput = document.getElementById('search-input');
const discordUsername = document.getElementById('discord-username');

// Handle Discord login
discordLoginButton.addEventListener('click', function () {
  window.open("https://discord.com/oauth2/authorize?client_id=1335621884259336303&response_type=code&redirect_uri=https%3A%2F%2F1boc.github.io%2Fcmdbar%2F&scope=identify", "_blank");
});

// Check if the user is logged in and show their Discord username
function checkDiscordLogin() {
  const user = localStorage.getItem('discord-user');
  if (user) {
    const discordData = JSON.parse(user);
    discordUsername.textContent = `Logged in as ${discordData.username}`;
    pluginForm.style.display = 'block'; // Show form if logged in
  } else {
    discordUsername.textContent = 'Please log in with Discord to add plugins';
    pluginForm.style.display = 'none'; // Hide form if not logged in
  }
}

// Handle adding a plugin
pluginForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const title = document.getElementById('plugin-title').value;
  const description = document.getElementById('plugin-description').value;
  const author = document.getElementById('plugin-author').value;

  const plugin = {
    title,
    description,
    author,
    id: Date.now()
  };

  savePlugin(plugin);
  displayPlugins();
});

// Save plugin to localStorage
function savePlugin(plugin) {
  let plugins = JSON.parse(localStorage.getItem('plugins')) || [];
  plugins.push(plugin);
  localStorage.setItem('plugins', JSON.stringify(plugins));
}

// Display all plugins
function displayPlugins() {
  const plugins = JSON.parse(localStorage.getItem('plugins')) || [];
  pluginList.innerHTML = ''; // Clear current list

  plugins.forEach((plugin) => {
    const pluginCard = document.createElement('div');
    pluginCard.classList.add('plugin-card');
    pluginCard.innerHTML = `
      <h3>${plugin.title}</h3>
      <p>${plugin.description}</p>
      <p><strong>Author:</strong> ${plugin.author}</p>
      <button onclick="deletePlugin(${plugin.id})">Delete</button>
    `;
    pluginList.appendChild(pluginCard);
  });
}

// Delete plugin
function deletePlugin(id) {
  let plugins = JSON.parse(localStorage.getItem('plugins')) || [];
  plugins = plugins.filter(plugin => plugin.id !== id);
  localStorage.setItem('plugins', JSON.stringify(plugins));
  displayPlugins();
}

// Search functionality
searchInput.addEventListener('input', function () {
  const query = searchInput.value.toLowerCase();
  const plugins = JSON.parse(localStorage.getItem('plugins')) || [];
  const filteredPlugins = plugins.filter(plugin => plugin.title.toLowerCase().includes(query));
  displayFilteredPlugins(filteredPlugins);
});

function displayFilteredPlugins(plugins) {
  pluginList.innerHTML = '';
  plugins.forEach((plugin) => {
    const pluginCard = document.createElement('div');
    pluginCard.classList.add('plugin-card');
    pluginCard.innerHTML = `
      <h3>${plugin.title}</h3>
      <p>${plugin.description}</p>
      <p><strong>Author:</strong> ${plugin.author}</p>
      <button onclick="deletePlugin(${plugin.id})">Delete</button>
    `;
    pluginList.appendChild(pluginCard);
  });
}

// Display plugins on page load
window.onload = function () {
  checkDiscordLogin();
  displayPlugins();
};
