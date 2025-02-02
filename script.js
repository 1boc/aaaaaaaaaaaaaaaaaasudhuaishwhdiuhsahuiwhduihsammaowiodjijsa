import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

async function loadPlugins() {
    const querySnapshot = await getDocs(collection(db, "plugins"));
    const pluginList = document.getElementById("plugin-list");
    pluginList.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const plugin = doc.data();
        pluginList.innerHTML += `
            <div class="plugin-card">
                <h3>${plugin.title}</h3>
                <p>${plugin.description}</p>
                <small>ID: ${plugin.id}</small>
            </div>
        `;
    });
}

document.getElementById("search").addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll(".plugin-card").forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(searchTerm) ? "block" : "none";
    });
});

loadPlugins();
