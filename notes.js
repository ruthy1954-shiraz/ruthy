// notes.js — גרסה מתוקנת לשירים ולתקשורים

// ייבוא החיבור הקיים ל-Firebase
import { db } from "./firebase.js";
import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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






