import { initNoteSystem, saveNoteToFirestore } from "../../notes.js";

export function initTikshurimNotes(tikId) {
    initNoteSystem(tikId);
}

export async function saveTikshurimNote(name, tik, note, tikId) {
    await saveNoteToFirestore(name, tik, note, tikId);
}
