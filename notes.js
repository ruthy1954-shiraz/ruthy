<!-- מערכת ההערות + ווצאפ -->
<script type="module">
    import { initNoteSystem, saveNoteToFirestore } from "../notes.js";

    // ⭐ טעינת הערות אוטומטית לפי שם הקובץ (shir11.html)
    initNoteSystem();

    const waLink = document.getElementById("waLink");
    const saveLink = document.getElementById("saveLink");
    const phone = "972545305123";

    waLink.addEventListener("click", () => {
        const name = document.getElementById("userName").value.trim();
        const song = document.getElementById("userSong").value.trim();
        const note = document.getElementById("userNote").value.trim();

        const message =
            `שם הכותב: ${name}\n` +
            `שם השיר: ${song}\n` +
            `הערה: ${note}`;

        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
    });

    // ⭐ שמירת הערה — אוטומטית לפי שם הקובץ
    saveLink.addEventListener("click", () => {
        const name = document.getElementById("userName").value.trim();
        const song = document.getElementById("userSong").value.trim();
        const note = document.getElementById("userNote").value.trim();

        saveNoteToFirestore(name, song, note);
    });
</script>





