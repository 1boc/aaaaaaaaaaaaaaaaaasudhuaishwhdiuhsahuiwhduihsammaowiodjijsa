document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const discordLoginButton = document.getElementById("discord-login");
    const userInfoDiv = document.getElementById("user-info");
    const welcomeMessage = document.getElementById("welcome-message");
    const logoutButton = document.getElementById("logout-btn");
  
    // Discord OAuth URL – update the client_id and redirect_uri as needed
    const DISCORD_OAUTH_URL = "https://discord.com/oauth2/authorize?client_id=1335621884259336303&response_type=code&redirect_uri=https%3A%2F%2F1boc.github.io%2Fcmdbar%2F&scope=identify";
  
    // Check login state from localStorage
    const storedUser = localStorage.getItem("discordUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      displayUserInfo(user);
    } else {
      // No user is stored; show the login button and hide user info
      discordLoginButton.classList.remove("hidden");
      userInfoDiv.classList.add("hidden");
    }
  
    // Event Listener for Discord login button
    discordLoginButton.addEventListener("click", () => {
      // Redirect user to Discord OAuth for authentication
      window.location.href = DISCORD_OAUTH_URL;
    });
  
    // Event Listener for Logout button
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("discordUser");
      window.location.reload();
    });
  
    // Function to display user info after login
    function displayUserInfo(user) {
      welcomeMessage.textContent = `Welcome, ${user.username}`;
      userInfoDiv.classList.remove("hidden");
      discordLoginButton.classList.add("hidden");
    }
  
    // Handle OAuth redirection (simulate fetching user data)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      // Normally, you would exchange the code for an access token on the server.
      // Here, we simulate this by calling a placeholder function.
      fetchDiscordUserData(code).then(user => {
        localStorage.setItem("discordUser", JSON.stringify(user));
        // Remove the code from URL after processing (optional)
        window.history.replaceState({}, document.title, window.location.pathname);
        displayUserInfo(user);
      });
    }
  
    // Simulated function to fetch Discord user data
    async function fetchDiscordUserData(code) {
      // Replace this simulation with an actual API call to your backend
      // For demonstration, we return a dummy user object after a short delay.
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            username: "DemoUser" // Replace with actual username from Discord API
          });
        }, 1000);
      });
    }
  });
  