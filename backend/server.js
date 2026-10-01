const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Anthropic = require('@anthropic-ai/sdk');
const { Resend } = require('resend');

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

// Initialiser le client Resend
const resend = new Resend(process.env.RESEND_API_KEY);  // ← AJOUTEZ CETTE LIGNE

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
            model: process.env.CLAUDE_MODEL || 'claude-sonnet-5',
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
// ===== ENDPOINT NOTIFICATIONS EMAIL =====
app.post('/api/send-notification', async (req, res) => {
    try {
        const { type, data } = req.body;

        if (!type || !data) {
            return res.status(400).json({
                success: false,
                error: 'Type et données requis'
            });
        }

        // Créer le contenu de l'email selon le type
        const isClient = type === 'CLIENT';
        const emoji = isClient ? '👤' : '🦺';
        const typeLabel = isClient ? 'NOUVEAU CLIENT' : 'NOUVEL INTERVENANT';

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%); 
                             color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
                    .label { font-weight: bold; color: #FF6B6B; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${emoji} ${typeLabel}</h1>
                        <p>PANTOUFLES - Service Adhoc</p>
                    </div>
                    <div class="content">
                        <p>Bonjour,</p>
                        <p>Une nouvelle inscription vient d'être enregistrée sur PANTOUFLES !</p>
                        
                        <div class="info-row">
                            <span class="label">📝 Nom :</span> ${data.nom || 'Non renseigné'}
                        </div>
                        <div class="info-row">
                            <span class="label">📧 Email :</span> ${data.email || 'Non renseigné'}
                        </div>
                        <div class="info-row">
                            <span class="label">📞 Téléphone :</span> ${data.telephone || 'Non renseigné'}
                        </div>
                        ${data.adresse ? `
                        <div class="info-row">
                            <span class="label">📍 Adresse :</span> ${data.adresse}
                        </div>
                        ` : ''}
                        ${data.services ? `
                        <div class="info-row">
                            <span class="label">🛠️ Services :</span> ${data.services}
                        </div>
                        ` : ''}
                        ${data.message ? `
                        <div class="info-row">
                            <span class="label">💬 Message :</span> ${data.message}
                        </div>
                        ` : ''}
                        
                        <div class="info-row">
                            <span class="label">🕐 Date :</span> ${new Date().toLocaleString('fr-FR')}
                        </div>
                        
                        <div class="footer">
                            <p>📍 PANTOUFLES - Service Adhoc | Limoges et alentours</p>
                            <p>🩴 "Même une pantoufle moche a sa place dans la maison"</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Envoyer l'email
        const emailResult = await resend.emails.send({
            from: 'PANTOUFLES <onboarding@resend.dev>',  // Adresse par défaut Resend
            to: process.env.NOTIFICATION_EMAIL,
            subject: `🔔 ${typeLabel} - PANTOUFLES`,
            html: htmlContent
        });

        console.log('✅ Email envoyé:', emailResult);

        res.json({
            success: true,
            message: 'Notification envoyée',
            emailId: emailResult.id
        });

    } catch (error) {
        console.error('❌ Erreur envoi email:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de l\'envoi de la notification'
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