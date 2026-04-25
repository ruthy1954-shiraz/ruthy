// notes.js — מערכת הערות בענן Firestore (Firebase 10)

// חיבור ל-Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// הגדרות הפרויקט שלך
const firebaseConfig = {
    apiKey: "AIzaSyD8q-8yJY0qQ0xk1y2v5w2u3u4u5u6u7u8",
    authDomain: "ruthy-notes.firebaseapp.com",
    projectId: "ruthy-notes",
    storageBucket: "ruthy-notes.appspot.com",
    messagingSenderId: "123456789000",
    appId: "1:123456789000:web:abcdef123456"
};

// הפעלה
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// מערכת ההערות
export function initNoteSystem() {

    const userNameInput = document.getElementById("userName");
    const userNoteInput = document.getElementById("userNote");
    const saveBtn = document.getElementById("saveBtn");
    const notesContainer = document.getElementById("notes");

    // טעינת הערות מהענן
    loadNotes();

    async function loadNotes() {
        notesContainer.innerHTML = "טוען הערות...";

        const notesRef = collection(db, "notes_" + songId);
        const snapshot = await getDocs(notesRef);

        notesContainer.innerHTML = "";

        snapshot.forEach(docItem => {
            const data = docItem.data();
            renderNote(docItem.id, data.name, data.note);
        });
    }

    // שמירת הערה בענן
    saveBtn.addEventListener("click", async () => {
        const name = userNameInput.value.trim();
        const note = userNoteInput.value.trim();

        if (!name || !note) {
            alert("נא למלא שם והערה");
            return;
        }

        const notesRef = collection(db, "notes_" + songId);

        await addDoc(notesRef, {
            name,
            note,
            timestamp: Date.now()
        });

        userNameInput.value = "";
        userNoteInput.value = "";

        loadNotes();
    });

    // הצגת הערה אחת
    function renderNote(id, name, note) {
        const div = document.createElement("div");
        div.classList.add("note-item");

        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong>${name}:</strong><br>
                    ${note}
                </div>

                <button class="delete-btn" data-id="${id}">
                    ✖
                </button>
            </div>
            <hr>
        `;

        notesContainer.appendChild(div);

        div.querySelector(".delete-btn").addEventListener("click", async () => {
            await deleteDoc(doc(db, "notes_" + songId, id));
            loadNotes();
        });
    }
}






