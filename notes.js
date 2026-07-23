// notes.js — גרסה אוטומטית לכל השירים

import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    doc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ⭐ זיהוי אוטומטי של songId לפי שם קובץ ה‑HTML
export function detectSongId() {
    const file = window.location.pathname.split("/").pop(); // לדוגמה: shir70.html
    const base = file.replace(".html", "");                 // shir70
    return base.replace("shir", "");                       // 70
}


// ⭐ שמירת הערה בענן
export async function saveNoteToFirestore(name, song, note) {
    try {
        const songId = detectSongId();
        const collectionName = "notes_shir" + songId;

        await addDoc(collection(db, collectionName), {
            name,
            song,
            note,
            songId,
            date: new Date().toISOString()
        });

        // הודעה עדינה
        const msg = document.createElement("div");
        msg.textContent = "הערה נשמרה!";
        msg.style.color = "#4a2c6b";
        msg.style.marginTop = "10px";
        msg.style.fontWeight = "bold";
        document.querySelector(".notes-box").appendChild(msg);

        setTimeout(() => msg.remove(), 2000);

        // רענון מיידי
        document.getElementById("notes").innerHTML = "";
        initNoteSystem();

    } catch (error) {
        console.error("שגיאה בשמירת הערה:", error);
    }
}


// ⭐ מחיקת הערה
export async function deleteNoteFromFirestore(noteId) {
    try {
        const songId = detectSongId();
        const collectionName = "notes_shir" + songId;

        await deleteDoc(doc(db, collectionName, noteId));
        console.log("הערה נמחקה בהצלחה!");
    } catch (error) {
        console.error("שגיאה במחיקת הערה:", error);
    }
}


// ⭐ טעינת הערות לדף
export async function initNoteSystem() {
    const notesDiv = document.getElementById("notes");
    const songId = detectSongId();
    const collectionName = "notes_shir" + songId;

    try {
        const q = query(collection(db, collectionName), orderBy("date", "desc"));
        const snapshot = await getDocs(q);

        snapshot.forEach(docSnap => {
            const data = docSnap.data();

            const card = document.createElement("div");
            card.className = "note-card";

            card.innerHTML = `
                <strong>${data.name}</strong><br>
                ${data.note}<br>
                <span class="note-date">
                    ${new Date(data.date).toLocaleString("he-IL")}
                </span>
            `;

            // כפתור מחיקה
            const deleteBtn = document.createElement("span");
            deleteBtn.textContent = "✖";
            deleteBtn.className = "delete-note";
            deleteBtn.style.cursor = "pointer";
            deleteBtn.style.float = "left";
            deleteBtn.style.marginLeft = "5px";

            deleteBtn.addEventListener("click", async () => {
                await deleteNoteFromFirestore(docSnap.id);
                card.remove();
            });

            card.prepend(deleteBtn);
            notesDiv.appendChild(card);
        });

    } catch (error) {
        console.error("שגיאה בטעינת הערות:", error);
    }
}




