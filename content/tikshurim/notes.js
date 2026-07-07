// notes.js — ניהול הערות תקשור

export function initNoteSystem(songId) {
    console.log("מערכת ההערות הופעלה עבור:", songId);
}

export async function saveNoteToFirestore(name, song, note, songId) {
    try {
        console.log("שומר הערה:", { name, song, note, songId });
        // כאן אפשר להוסיף שמירה אמיתית ל‑Firestore אם תרצי בהמשך
    } catch (error) {
        console.error("שגיאה בשמירת הערה:", error);
    }
}
