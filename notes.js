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

/* הפעלה ראשונית */
export async function initNoteSystem() {
    loadNotes("homepage");

    // מאזין למחיקה
    document.addEventListener("click", function(e) {
        if (e.target.classList.contains("note-delete")) {
            const id = e.target.getAttribute("data-id");
            deleteNoteFromFirestore(id, "homepage");
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

            wrapper.innerHTML = `
                <div class="note-delete" data-id="${docItem.id}">×</div>
                <strong>${data.name}</strong> כתבה בדף <strong>${data.song}</strong>:<br>
                ${data.note}
            `;

            notesDiv.appendChild(wrapper);
        }
    });
}



