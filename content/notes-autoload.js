// notes-autoload.js — הפעלה אוטומטית של מערכת ההערות לכל הדפים באתר

import { initNoteSystem, saveNoteToFirestore } from "./notes.js";

// זיהוי הדף לפי הכתובת
function detectSongId() {
    const path = window.location.pathname;

    // דף הבית
    if (path.endsWith("index.html") || path === "/") {
        return "homepage";
    }

    // שירים — כל דף שיר נמצא בתיקייה /content/songs/
    if (path.includes("/content/songs/")) {
        const file = path.split("/").pop().replace(".html", "");
        return "song-" + file;   // לדוגמה: song-12
    }

    // תקשורים — כל דף תקשור נמצא בתיקייה /content/tikshurim/
    if (path.includes("/content/tikshurim/")) {
        const file = path.split("/").pop().replace(".html", "");
        return "tikshur-" + file;
    }

    return null;
}

const songId = detectSongId();

// אם זוהה דף — מפעילים את מערכת ההערות
if (songId) {
    initNoteSystem(songId);

    const waLink = document.getElementById("waLink");
    const saveLink = document.getElementById("saveLink");
    const phone = "972545305123";

    // ווצאפ
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

    // שמירת הערה
    if (saveLink) {
        saveLink.addEventListener("click", () => {
            const name = document.getElementById("userName").value.trim();
            const song = document.getElementById("userSong").value.trim();
            const note = document.getElementById("userNote").value.trim();

            saveNoteToFirestore(name, song, note, songId);
        });
    }
}
