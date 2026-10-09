export default async function handler(req, res) {
    // 1. Configuración de CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejo del pre-flight de CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Solo aceptamos peticiones POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    // 2. Recibir los datos del usuario desde el frontend
    const { provider_token, username, user_id, twitter_id, drop_id, target_tweet, target_account } = req.body;

    if (!provider_token || !user_id) {
        return res.status(400).json({ error: 'Faltan credenciales' });
    }

    try {
        let userHasLiked = false;
        let userHasReposted = false;
        let userHasCommented = false;
        let isFollowing = false;

        // ==========================================
        // LÓGICA DE VALIDACIÓN X API v2 (Requiere Basic Tier)
        // ==========================================
        /* 
        Si en el futuro adquieres el plan Basic de la API de X ($100/mes), 
        descomenta este bloque para validación estricta automática:

        const headersX = { 'Authorization': `Bearer ${provider_token}` };
        
        // 1. Verificar Follow
        const followRes = await fetch(`https://api.twitter.com/2/users/${twitter_id}/following`, { headers: headersX });
        const followsData = await followRes.json();
        if (followsData.data) isFollowing = followsData.data.some(u => u.username.toLowerCase() === target_account.toLowerCase());

        // 2. Verificar Like
        const likeRes = await fetch(`https://api.twitter.com/2/users/${twitter_id}/liked_tweets`, { headers: headersX });
        const likesData = await likeRes.json();
        if (likesData.data) userHasLiked = likesData.data.some(t => t.id === target_tweet);

        // (La validación de Repost y Reply requiere búsquedas avanzadas en la API)
        */

        // ==========================================
        // MODO MVP (Free Tier): 
        // Registramos la participación asumiendo buena fe.
        // La validación estricta (auditoría) se hace manual al elegir al ganador.
        // ==========================================
        userHasLiked = true; 
        userHasReposted = true;
        userHasCommented = true;
        isFollowing = true;

        // ==========================================
        // REGISTRO EN SUPABASE
        // ==========================================
        const supabaseUrl = "https://yhggkrhppvimfikiylbp.supabase.co";
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZ2drcmhwcHZpbWZpa2l5bGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0ODAwNjcsImV4cCI6MjEwNzA1NjA2N30.fmj-5oeYlFNcg7hKeGpDzjAOpmV4AP6p7GiH0OirZls";

        const dbResponse = await fetch(`${supabaseUrl}/rest/v1/drop_entries`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                username: username,
                drop_id: drop_id,
                has_liked: userHasLiked,
                has_reposted: userHasReposted,
                has_commented: userHasCommented,
                is_following: isFollowing
            })
        });

        if (!dbResponse.ok) {
            const dbError = await dbResponse.json();
            console.error("Error insertando en BD:", dbError);
            throw new Error('Fallo al insertar en DB');
        }

        return res.status(200).json({ success: true, message: "Participación guardada correctamente." });

    } catch (error) {
        console.error("Error en validador:", error);
        return res.status(500).json({ error: 'Error procesando la participación' });
    }
}