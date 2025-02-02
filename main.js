// Discord OAuth and User Authentication
const discordLoginButton = document.getElementById("discord-login");
const userInfoDiv = document.getElementById("user-info");
const welcomeMessage = document.getElementById("welcome-message");
const logoutButton = document.getElementById("logout-btn");

// Discord OAuth URL (update with your actual redirect_uri)
const DISCORD_OAUTH_URL = "https://discord.com/oauth2/authorize?client_id=1335621884259336303&response_type=code&redirect_uri=https%3A%2F%2F1boc.github.io%2Fcmdbar%2F&scope=identify";

// Check if the user is already logged in using localStorage
if (localStorage.getItem("discordUser")) {
    const user = JSON.parse(localStorage.getItem("discordUser"));
    displayUserInfo(user);
} else {
    discordLoginButton.classList.remove("hidden"); // Show login button
}

// Event Listener for the Discord login button
discordLoginButton.addEventListener("click", () => {
    // Redirect user to Discord OAuth for authentication
    window.location.href = DISCORD_OAUTH_URL;
});

// Event Listener for the logout button
logoutButton.addEventListener("click", () => {
    // Clear user data from localStorage
    localStorage.removeItem("discordUser");
    window.location.reload(); // Reload the page to reset the state
});

// Function to display user info after login
function displayUserInfo(user) {
    discordLoginButton.classList.add("hidden"); // Hide login button
    userInfoDiv.classList.remove("hidden"); // Show user info section
    welcomeMessage.innerHTML = `Welcome, ${user.username}`;
    logoutButton.classList.remove("hidden"); // Show logout button
}

// Simulating receiving the Discord user info after OAuth redirect
// This part is usually handled server-side (OAuth token exchange)
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
        // Handle OAuth code and fetch user data (this step is typically done server-side)
        fetchDiscordUserData(code).then(user => {
            localStorage.setItem("discordUser", JSON.stringify(user));
            displayUserInfo(user);
        });
    }
};

// Function to fetch Discord user data (You would normally make this request to your server)
async function fetchDiscordUserData(code) {
    const response = await fetch(`/getDiscordUserData?code=${code}`);
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        console.error("Failed to fetch Discord user data");
    }
}
