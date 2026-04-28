import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* שמירת הערה */
export async function saveNoteToFirestore(name, song, note, pageId) {
    if (!name || !note) return;

    await addDoc(collection(db, "notes"), {
        name,
        song,
        note,
        pageId,
        timestamp: Date.now()
    });

    loadNotes(pageId);
}

/* מחיקת הערה */
export async function deleteNoteFromFirestore(id, pageId) {
    await deleteDoc(doc(db, "notes", id));
    loadNotes(pageId);
}

/* הפעלה ראשונית — עכשיו מקבל pageId */
export async function initNoteSystem(pageId) {
    loadNotes(pageId);

    // מאזין למחיקה
    document.addEventListener("click", function(e) {
        if (e.target.classList.contains("note-delete")) {
            const id = e.target.getAttribute("data-id");
            deleteNoteFromFirestore(id, pageId);
        }
    });
}

/* טעינת הערות */
async function loadNotes(pageId) {
    const notesDiv = document.getElementById("notes");
    notesDiv.innerHTML = "";

    const q = query(collection(db, "notes"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((docItem) => {
        const data = docItem.data();

        if (data.pageId === pageId) {
            const wrapper = document.createElement("div");
            wrapper.className = "note-item";

            const date = new Date(data.timestamp).toLocaleString("he-IL");

            wrapper.innerHTML = `
                <div class="note-delete" data-id="${docItem.id}">×</div>

                <span class="note-icon">✎</span>
                <strong>${data.name}</strong> כתבה בדף <strong>${data.song}</strong>:

                <br><br>
                ${data.note}

                <br><br>
                <small style="color:#7a6a5f;">נכתב ב־${date}</small>
            `;

            notesDiv.appendChild(wrapper);
        }
    });
}



