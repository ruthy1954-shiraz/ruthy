<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $song = $_POST['song'];
    $note = $_POST['note'];
    $date = date("Y-m-d H:i:s");

    $line = "[$date] שיר: $song — הערה: $note\n";

    file_put_contents("notes.txt", $line, FILE_APPEND | LOCK_EX);

    echo "saved";
}
?>

