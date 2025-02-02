const CLIENT_ID = "1335621884259336303";
const REDIRECT_URI = "https://1boc.github.io/cmdbar/";
const OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify`;

document.getElementById("login-btn").addEventListener("click", () => {
    window.location.href = OAUTH_URL;
});

async function handleOAuth() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("code")) {
        const code = params.get("code");

        // Simulating API call to fetch Discord user info
        const fakeUser = { username: "theboc", id: "1234567890" }; 

        localStorage.setItem("discordUser", JSON.stringify(fakeUser));

        document.getElementById("username").textContent = fakeUser.username;
        document.getElementById("login-btn").style.display = "none";
        document.getElementById("logout-btn").style.display = "block";
    }
}

document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("discordUser");
    window.location.reload();
});

handleOAuth();
