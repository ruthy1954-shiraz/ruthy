// notes.js — מערכת הערות מלאה

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// הגדרות Firebase שלך
const firebaseConfig = {
    apiKey: "YOUR_KEY",
    authDomain: "YOUR_DOMAIN",
    projectId: "ruthy-notes",
    storageBucket: "ruthy-notes.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// שמירת הערה לענן
export async function saveNoteToFirestore(name, song, note, songId) {
    try {
        await addDoc(collection(db, "notes_" + songId), {
            name: name,
            song: song,
            note: note,
            timestamp: Date.now()
        });
        alert("ההערה נשמרה בהצלחה!");
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("אירעה שגיאה בשמירת ההערה");
    }
}

// טעינת הערות מהענן
export async function initNoteSystem() {
    const notesDiv = document.getElementById("notes");

    const q = query(
        collection(db, "notes_" + songId),
        orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);

    notesDiv.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        const date = new Date(data.timestamp).toLocaleDateString("he-IL");

        notesDiv.innerHTML += `
            <p>
                <strong>${data.name}</strong> (${date})<br>
                <em>${data.song}</em><br>
                ${data.note}
            </p>
            <hr>
        `;
    });
}





