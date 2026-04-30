import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* הגדרות Firebase שלך */
const firebaseConfig = {
    apiKey: "API_KEY_כאן",
    authDomain: "AUTH_DOMAIN_כאן",
    projectId: "ruthy-notes",
    storageBucket: "ruthy-notes.appspot.com",
    messagingSenderId: "MESSAGING_ID_כאן",
    appId: "APP_ID_כאן"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* שמירת הערה */
export async function saveNoteToFirestore(name, song, note, songId) {
    await addDoc(collection(db, "notes_" + songId), {
        name: name,
        title: song,   // ← שינוי חשוב: שדה title במקום song
        note: note,
        timestamp: Date.now()
    });

    loadNotes(songId);
}

/* התחלת מערכת ההערות */
export async function initNoteSystem(songId) {
    loadNotes(songId);
}

/* טעינת הערות */
async function loadNotes(songId) {
    const notesDiv = document.getElementById("notes");

    const q = query(
        collection(db, "notes_" + songId),
        orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);

    notesDiv.innerHTML = "";

    querySnapshot.forEach((docItem) => {
        const data = docItem.data();
        const id = docItem.id;

        const date = new Date(data.timestamp).toLocaleDateString("he-IL");

        notesDiv.innerHTML += `
            <div class="note-item">
                <div class="note-delete" onclick="deleteNote('${id}', '${songId}')">×</div>
                <strong>${data.name}</strong><br>
                <small>${data.title} — ${date}</small><br><br>
                ${data.note}
            </div>
        `;
    });
}

/* מחיקת הערה */
window.deleteNote = async function(id, songId) {
    await deleteDoc(doc(db, "notes_" + songId, id));
    loadNotes(songId);
}






