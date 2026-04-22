// --- Firebase config ---
const firebaseConfig = {
    apiKey: "AIzaSyDMepXTjui58oUJ0aVQgmXo8L0IjT1pPxQ",
    authDomain: "ruthy-notes.firebaseapp.com",
    projectId: "ruthy-notes",
    storageBucket: "ruthy-notes.firebasestorage.app",
    messagingSenderId: "276333962292",
    appId: "1:276333962292:web:298a0e8db8b5f77c359661",
    measurementId: "G-6MDZNCXET4"
};

// --- Initialize Firebase ---
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- Save note to Firestore ---
async function saveNote() {
    const text = document.getElementById("noteText").value;

    if (!text.trim()) {
        alert("אי אפשר לשמור הודעה ריקה");
        return;
    }

    await db.collection("notes").add({
        name: "רותי",
        note: text
    });

    document.getElementById("noteText").value = "";
    loadNotes();
}

// --- Load notes from Firestore ---
async function loadNotes() {
    const list = document.getElementById("savedNotes");
    list.innerHTML = "";

    const snapshot = await db.collection("notes").get();

    snapshot.forEach(doc => {
        const data = doc.data();
        const p = document.createElement("p");
        p.textContent = `${data.name}: ${data.note}`;
        list.appendChild(p);
    });
}

// טוען את ההערות ברגע שהדף נפתח
window.onload = loadNotes;

