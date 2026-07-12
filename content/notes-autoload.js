// notes-autoload.js — הפעלה אוטומטית של מערכת ההערות לכל הדפים באתר

import { initNoteSystem, saveNoteToFirestore } from "./notes.js";

// הזרקת תיבת הערות אוטומטית אם לא קיימת
function injectNotesBox() {
    if (!document.querySelector(".notes-box")) {
        const box = document.createElement("div");
        box.className = "notes-box";
        box.innerHTML = `
            <h3>כתיבת הערות והארות</h3>

            <input id="userName" placeholder="השם שלך..." />
            <input id="userSong" placeholder="שם הדף..." />
            <textarea id="userNote" placeholder="כתבי כאן את מחשבותייך..."></textarea>

            <div class="footer-nav" style="margin-top:15px;">
                <a id="waLink">ווצאפ לכותבת</a> |
                <a id="saveLink">שמירת הערה</a>
            </div>

            <h4>הערות קוראים שנשמרו:</h4>
            <div id="notes"></div>
        `;
        document.body.appendChild(box);
    }
}

// זיהוי הדף לפי הכתובת
function detectSongId() {
    const path = window.location.pathname;

    // דף הבית
    if (path.endsWith("index.html") || path === "/") {
        return "homepage";
    }

    // זיהוי שירים: shir1.html, shir10.html וכו'
    if (path.includes("/content/") && path.includes("shir")) {
        const file = path.split("/").pop().replace(".html", "");
        return "song-" + file;
    }

    // זיהוי תקשורים
    if (path.includes("/content/tikshurim/")) {
        const file = path.split("/").pop().replace(".html", "");
        return "tikshur-" + file;
    }

    return null;
}

// הפעלה אוטומטית
injectNotesBox();

const songId = detectSongId();

if (songId) {
    initNoteSystem(songId);

    const waLink = document.getElementById("waLink");
    const saveLink = document.getElementById("saveLink");
    const phone = "972545305123";

    if (waLink) {
        waLink.addEventListener("click", () => {
            const name = document.getElementById("userName").value.trim();
            const song = document.getElementById("userSong").value.trim();
            const note = document.getElementById("userNote").value.trim();

            const message = `שם הכותב: ${name}\nדף: ${song}\nהערה: ${note}`;
            const encoded = encodeURIComponent(message);
            window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
        });
    }

    if (saveLink) {
        saveLink.addEventListener("click", () => {
            const name = document.getElementById("userName").value.trim();
            const song = document.getElementById("userSong").value.trim();
            const note = document.getElementById("userNote").value.trim();

            saveNoteToFirestore(name, song, note, songId);
        });
    }
}


