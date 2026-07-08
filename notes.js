// notes.js — גרסה אחידה לשירים ולתקשורים

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// הגדרות Firebase — נשארות כמו אצלך
const firebaseConfig = {
    apiKey: "AIzaSyCwWJv-xxxxxxxxxxxxxxxxxxxx",
    authDomain: "ruthy-notes.firebaseapp.com",
    projectId: "ruthy-notes",
    storageBucket: "ruthy-notes.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:xxxxxxxxxxxx"
};

// הפעלת Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// שמירת הערה בענן
export async function saveNoteToFirestore(name, song, note, songId) {
    try {
        await addDoc(collection(db, "notes"), {
            name: name,
            song: song,
            note: note,
            songId: songId,
            date: new Date().toISOString()
        });
        console.log("הערה נשמרה בהצלחה!");
    } catch (error) {
        console.error("שגיאה בשמירת הערה:", error);
    }
}

// טעינת הערות לדף
export async function initNoteSystem(songId) {
    const notesDiv = document.getElementById("notes");

    try {
        const q = query(
            collection(db, "notes"),
            orderBy("date", "desc")
        );

        const snapshot = await getDocs(q);

        snapshot.forEach(doc => {
            const data = doc.data();

            // מציג רק הערות של הדף הנוכחי
            if (data.songId === songId) {
                const card = document.createElement("div");
                card.className = "note-card";
                card.innerHTML = `
                    <strong>${data.name}</strong><br>
                    ${data.note}<br>
                    <span class="note-date">${new Date(data.date).toLocaleString("he-IL")}</span>
                `;
                notesDiv.appendChild(card);
            }
        });

    } catch (error) {
        console.error("שגיאה בטעינת הערות:", error);
    }
}







