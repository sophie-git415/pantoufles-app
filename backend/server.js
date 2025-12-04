const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Anthropic = require('@anthropic-ai/sdk');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialiser le client Anthropic
const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY
});

// ===== ENDPOINT CLAUDE CHAT =====
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message requis' });
        }

        // Système prompt pour Claude (spécifique à PANTOUFLES)
        const systemPrompt = `Tu es Claude, l'assistant virtuel de PANTOUFLES - Service Adhoc.

PANTOUFLES propose les services suivants :
🧹 Ménage - Nettoyage complet de l'intérieur
👕 Repassage - Traitement soigné du linge
🛒 Courses - Achats selon les préférences du client
🥗 Diététique - Conseils nutritionnels adaptés
🍽️ Aide au repas - Préparation et aide à la prise de repas

Zone de service : Limoges et alentours

Ton rôle :
1. Répondre aux questions sur les services PANTOUFLES
2. Expliquer comment ça marche
3. Donner des conseils utiles
4. Diriger vers le formulaire d'inscription si besoin
5. Être empathique et bienveillant

Coordonnées :
📞 À définir
📧 À définir
📍 Limoges

Philosophie PANTOUFLES : "Même une pantoufle moche a sa place dans la maison"
(C'est une philosophie d'acceptation et de bienveillance envers chacun)

Sois toujours courtois, utile et bienveillant dans tes réponses.`;

        const message_response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ]
        });

        const reply = message_response.content[0].text;

        res.json({
            success: true,
            reply: reply
        });

    } catch (error) {
        console.error('Erreur Claude:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la communication avec Claude'
        });
    }
});

// ===== ENDPOINT GOOGLE MAPS API KEY =====
app.get('/api/maps-key', (req, res) => {
    try {
        res.json({
            success: true,
            mapsKey: process.env.GOOGLE_MAPS_API_KEY
        });
    } catch (error) {
        console.error('Erreur Maps:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération de la clé Maps'
        });
    }
});

// ===== ENDPOINT DE TEST =====
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Backend PANTOUFLES OK ✅',
        timestamp: new Date().toISOString()
    });
});

// ===== DÉMARRER LE SERVEUR =====
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════╗
║   🩴 PANTOUFLES Backend Démarré   ║
╠════════════════════════════════════╣
║   Server: http://localhost:${PORT}        ║
║   Chat: POST /api/chat              ║
║   Maps Key: GET /api/maps-key       ║
║   Health: GET /api/health           ║
╚════════════════════════════════════╝
  `);
});

module.exports = app;