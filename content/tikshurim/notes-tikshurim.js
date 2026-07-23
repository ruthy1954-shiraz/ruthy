// notes-tikshurim.js — גרסה מתוקנת, עקבית עם מערכת השירים

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ⭐ הגדרות Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC-7mYVgYc8YVYVYVYVYVYVYVYVYVY",
    authDomain: "ruthy1954-shiraz.firebaseapp.com",
    projectId: "ruthy1954-shiraz",
    storageBucket: "ruthy1954-shiraz.appspot.com",
    messagingSenderId: "1029384756",
    appId: "1:1029384756:web:abcdef1234567890"
};

// ⭐ אתחול Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ⭐ זיהוי אוטומטי של תקשור לפי שם הקובץ
export function detectTikId() {
    const file = window.location.pathname.split("/").pop(); // לדוגמה: 03-09-2026.html
    return file.replace(".html", ""); // מחזיר את השם בלי הסיומת
}

// ⭐ יצירת כרטיס הערה
function createNoteCard(id, name, note, date) {
    const div = document.createElement("div");
    div.className = "note-card";

    div.innerHTML = `
        <strong>${name}</strong><br>
        ${note}<br>
        <span class="note-date">${date}</span>
        <button class="delete-btn" data-id="${id}">✖</button>
    `;

    return div;
}

// ⭐ טעינת הערות קיימות
export async function initTikshurimNotes() {
    const notesDiv = document.getElementById("notes");
    notesDiv.innerHTML = "";

    const tikId = detectTikId();
    const collectionName = "notes_" + tikId;

    try {
        const snap = await getDocs(collection(db, collectionName));

        if (snap.empty) {
            notesDiv.innerHTML = "<p>עדיין אין הערות לתקשור זה.</p>";
            return;
        }

        snap.forEach((docSnap) => {
            const data = docSnap.data();
            const card = createNoteCard(docSnap.id, data.name, data.note, data.date);
            notesDiv.prepend(card);
        });

    } catch (error) {
        console.error("שגיאה בטעינת הערות:", error);
        alert("לא ניתן לטעון את ההערות כרגע.");
    }

    // ⭐ מחיקה עם X
    notesDiv.addEventListener("click", async (e) => {
        if (!e.target.classList.contains("delete-btn")) return;

        const id = e.target.getAttribute("data-id");

        try {
            await deleteDoc(doc(db, collectionName, id));
            e.target.closest(".note-card").remove();
        } catch (error) {
            console.error("שגיאה במחיקה:", error);
            alert("לא ניתן למחוק את ההערה כרגע.");
        }
    });
}

// ⭐ שמירת הערה חדשה
export async function saveTikshurimNote(name, tik, note) {
    if (!name || !note) {
        alert("נא למלא שם והערה.");
        return null;
    }

    const tikId = detectTikId();
    const collectionName = "notes_" + tikId;
    const now = new Date();
    const dateString = now.toLocaleString("he-IL");

    try {
        const docRef = await addDoc(collection(db, collectionName), {
            name,
            tik,
            note,
            date: dateString
        });

        return {
            id: docRef.id,
            name,
            note,
            date: dateString
        };

    } catch (error) {
        console.error("שגיאה בשמירה:", error);
        alert("לא ניתן לשמור את ההערה כרגע.");
        return null;
    }
}


