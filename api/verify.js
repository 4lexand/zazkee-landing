export default async function handler(req, res) {
    // Configuración de CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { provider_token, username, user_id, drop_id } = req.body;

    if (!provider_token || !username || !user_id) {
        return res.status(400).json({ error: 'Faltan credenciales o datos del usuario' });
    }

    try {
        // AQUÍ ES DONDE HAREMOS LA CONSULTA A LA API DE X (PRÓXIMO PASO)
        // Por ahora simularemos que el usuario sí cumplió para probar la base de datos
        const userHasLiked = true; 
        const userHasReposted = true;

        // --- CONEXIÓN CON SUPABASE ---
        const supabaseUrl = "https://yhggkrhppvimfikiylbp.supabase.co";
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZ2drcmhwcHZpbWZpa2l5bGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0ODAwNjcsImV4cCI6MjEwNzA1NjA2N30.fmj-5oeYlFNcg7hKeGpDzjAOpmV4AP6p7GiH0OirZls";

        // Insertar el registro directamente en la tabla drop_entries
        const dbResponse = await fetch(`${supabaseUrl}/rest/v1/drop_entries`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation' // Le pide a Supabase que devuelva el dato insertado
            },
            body: JSON.stringify({
                user_id: user_id,
                username: username,
                drop_id: drop_id,
                has_liked: userHasLiked,
                has_reposted: userHasReposted
            })
        });

        if (!dbResponse.ok) {
            const dbError = await dbResponse.json();
            console.error("Error insertando en BD:", dbError);
            return res.status(500).json({ error: 'No se pudo registrar tu participación en la base de datos' });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Participación guardada con éxito en Supabase." 
        });

    } catch (error) {
        console.error("Error crítico en el servidor:", error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}