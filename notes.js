// --- Firebase config ---
// שימי כאן את הפרטים מה-Firebase שלך
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "ruthy-notes.firebaseapp.com",
    projectId: "ruthy-notes",
    storageBucket: "ruthy-notes.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
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
