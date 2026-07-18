// notes-tikshurim.js
// מערכת הערות לתקשורים — גרסה מאוחדת, יציבה ומהירה

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
export async function initTikshurimNotes(tikId) {
    const notesDiv = document.getElementById("notes");
    notesDiv.innerHTML = "";

    try {
        const snap = await getDocs(collection(db, "tikshurim", tikId, "notes"));

        snap.forEach((docSnap) => {
            const data = docSnap.data();
            const card = createNoteCard(docSnap.id, data.name, data.note, data.date);
            notesDiv.prepend(card);
        });

    } catch (error) {
        console.error("שגיאה בטעינת הערות:", error);
        alert("לא ניתן לטעון את ההערות כרגע.");
    }

    // ⭐ מחיקה
    notesDiv.addEventListener("click", async (e) => {
        if (!e.target.classList.contains("delete-btn")) return;

        const id = e.target.getAttribute("data-id");

        try {
            await deleteDoc(doc(db, "tikshurim", tikId, "notes", id));
            e.target.closest(".note-card").remove();
        } catch (error) {
            console.error("שגיאה במחיקה:", error);
            alert("לא ניתן למחוק את ההערה כרגע.");
        }
    });
}

// ⭐ שמירת הערה חדשה
export async function saveTikshurimNote(name, tik, note, tikId) {
    if (!name || !note) {
        alert("נא למלא שם והערה.");
        return null;
    }

    const now = new Date();
    const dateString = now.toLocaleString("he-IL");

    try {
        const docRef = await addDoc(collection(db, "tikshurim", tikId, "notes"), {
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

