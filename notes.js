// notes.js — גרסה מתוקנת עם כפתור מחיקה

// ייבוא החיבור הקיים ל-Firebase
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

export async function saveNoteToFirestore(name, song, note, songId) {
    try {
        await addDoc(collection(db, "notes"), {
            name: name,
            song: song,
            note: note,
            songId: songId,
            date: new Date().toISOString()
        });

        // הודעה עדינה בתוך הדף
        const msg = document.createElement("div");
        msg.textContent = "הערה נשמרה!";
        msg.style.color = "#4a2c6b";
        msg.style.marginTop = "10px";
        msg.style.fontWeight = "bold";

        document.querySelector(".notes-box").appendChild(msg);

        // ההודעה תיעלם אחרי 2 שניות
        setTimeout(() => msg.remove(), 2000);

        // רענון מיידי של ההערות
        initNoteSystem(songId);

    } catch (error) {
        console.error("שגיאה בשמירת הערה:", error);
    }
}

// מחיקת הערה מהענן
export async function deleteNoteFromFirestore(noteId) {
    try {
        const noteRef = doc(db, "notes", noteId);
        await deleteDoc(noteRef);
        console.log("הערה נמחקה בהצלחה!");
    } catch (error) {
        console.error("שגיאה במחיקת הערה:", error);
    }
}

// טעינת הערות לדף
// רענון מיידי של ההערות
document.getElementById("notes").innerHTML = "";
initNoteSystem(songId);
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

                // יצירת כפתור מחיקה
                const deleteBtn = document.createElement("span");
                deleteBtn.textContent = "✖";
                deleteBtn.className = "delete-note";
                deleteBtn.style.cursor = "pointer";
                deleteBtn.style.float = "left";
                deleteBtn.style.marginLeft = "5px";

                // פעולה למחיקה
                deleteBtn.addEventListener("click", async () => {
                    await deleteNoteFromFirestore(doc.id);
                    card.remove();
                });

                // הוספת הכפתור לכרטיס
                card.prepend(deleteBtn);

                notesDiv.appendChild(card);
            }
        });

    } catch (error) {
        console.error("שגיאה בטעינת הערות:", error);
    }
}






