export default function handler(req, res) {
    // 🔹 Habilitar CORS para permitir solicitudes desde GitHub Pages
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

    // 🔹 Responder a la preflight request de CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 🔹 Solo permitir solicitudes POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

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

        console.log(`✅ Datos recibidos correctamente:`, req.body);
        res.json({ message: "✅ Datos procesados correctamente", data: req.body });

    } catch (error) {
        console.error("🚨 ERROR al procesar la solicitud:", error);
        res.status(500).json({ error: 'Error interno al procesar la información.' });
    }
}
