// notes-tikshurim.js
// מערכת הערות והארות לתקשורים — נפרדת מהשירים

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ⚠️ חייב להיות זהה ל-notes.js של השירים!
const firebaseConfig = {
    apiKey: "AIzaSyC-7mYVgYc8YVYVYVYVYVYVYVYVYVY",
    authDomain: "ruthy1954-shiraz.firebaseapp.com",
    projectId: "ruthy1954-shiraz",
    storageBucket: "ruthy1954-shiraz.appspot.com",
    messagingSenderId: "1029384756",
    appId: "1:1029384756:web:abcdef1234567890"
};

// אתחול
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// טעינת הערות קיימות
export async function initTikshurimNotes(tikId) {
    const notesDiv = document.getElementById("notes");
    notesDiv.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "tikshurim", tikId, "notes"));
    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const noteCard = document.createElement("div");
        noteCard.className = "note-card";
        noteCard.innerHTML = `
            <strong>${data.name}</strong><br>
            ${data.note}<br>
            <span class="note-date">${data.date}</span>
            <button class="delete-btn" data-id="${docSnap.id}">✖</button>
        `;
        notesDiv.prepend(noteCard);
    });

    // מחיקה
    notesDiv.addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const id = e.target.getAttribute("data-id");
            await deleteDoc(doc(db, "tikshurim", tikId, "notes", id));
            e.target.parentElement.remove();
        }
    });
}

// שמירת הערה חדשה
export async function saveTikshurimNote(name, tik, note, tikId) {
    if (!name || !note) {
        alert("נא למלא שם והערה לפני השמירה.");
        return;
    }

    const now = new Date();
    const dateString = now.toLocaleString("he-IL");

    const docRef = await addDoc(collection(db, "tikshurim", tikId, "notes"), {
        name,
        tik,
        note,
        date: dateString
    });

    return docRef;
}

