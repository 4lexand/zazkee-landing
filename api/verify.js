export default async function handler(req, res) {
    // 1. Configuración de CORS para permitir peticiones desde tu frontend
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Manejo del pre-flight de CORS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Solo aceptamos peticiones POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    // 2. Recibir los datos del usuario desde el frontend
    const { provider_token, username, drop_id } = req.body;

    if (!provider_token || !username) {
        return res.status(400).json({ error: 'Faltan credenciales o datos del usuario' });
    }

    try {
        // AQUÍ CONECTAREMOS CON LA API DE X (Siguiente paso)
        console.log(`Backend recibió petición de @${username} para el drop ${drop_id}`);

        // Respuesta temporal de éxito para confirmar que el servidor funciona
        return res.status(200).json({ 
            success: true, 
            message: "Conexión con el backend de Vercel establecida. Listo para integrar X." 
        });

    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}