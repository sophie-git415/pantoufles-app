// Service d'email pour PANTOUFLES
// Utilise Resend pour envoyer les emails

const RESEND_API_KEY = process.env.REACT_APP_RESEND_API_KEY;
const SENDER_EMAIL = 'noreply@pantoufles.fr'; // À personnaliser

const statusMessages = {
    'en_attente': {
        subject: '📋 Votre demande PANTOUFLES reçue',
        body: `Bonjour,

Merci pour votre intérêt envers PANTOUFLES !

Nous avons bien reçu votre demande. Notre équipe l'examine actuellement et vous recontacterons très rapidement pour confirmer et personnaliser votre service.

À bientôt ! 🩴

L'équipe PANTOUFLES`
    },
    'confirmé': {
        subject: '✅ Votre demande PANTOUFLES confirmée !',
        body: `Bonjour,

Excellente nouvelle ! Votre demande a été confirmée par notre équipe.

Nous allons très bientôt vous contacter pour organiser l'intervention et répondre à vos questions.

Merci de votre confiance ! 💙

L'équipe PANTOUFLES`
    },
    'en_cours': {
        subject: '🔄 Votre service PANTOUFLES en cours',
        body: `Bonjour,

Votre service est maintenant en cours de préparation !

Notre équipe fait tout son possible pour vous offrir le meilleur service possible.

Nous vous tiendrons informé de la progression.

L'équipe PANTOUFLES`
    },
    'terminé': {
        subject: '🎉 Votre service PANTOUFLES est terminé !',
        body: `Bonjour,

Votre service est maintenant terminé ! 🎉

Nous espérons que vous êtes satisfait du travail réalisé. N'hésitez pas à nous contacter si vous avez des questions ou si vous souuhaitez continuer nos services.

Merci pour votre confiance ! 💙

L'équipe PANTOUFLES`
    }
};

/**
 * Envoyer un email au client quand le statut change
 * @param {string} clientEmail - Email du client
 * @param {string} clientName - Nom du client
 * @param {string} newStatus - Nouveau statut
 */
export const sendStatusUpdateEmail = async (clientEmail, clientName, newStatus) => {
    try {
        // Vérifier la clé API
        if (!RESEND_API_KEY) {
            console.warn('⚠️ RESEND_API_KEY non configurée. Email non envoyé.');
            console.log(`📧 Email simulé pour ${clientEmail}: ${statusMessages[newStatus]?.subject}`);
            return { success: false, message: 'Clé API non configurée' };
        }

        const emailData = statusMessages[newStatus];

        if (!emailData) {
            console.error('❌ Statut inconnu:', newStatus);
            return { success: false, message: 'Statut inconnu' };
        }

        // Envoyer via Resend
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: SENDER_EMAIL,
                to: clientEmail,
                subject: emailData.subject,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #ff9f43, #ff6b6b); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">🩴 PANTOUFLES</h1>
              <p style="margin: 10px 0 0 0;">Service Adhoc</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <p>${emailData.body.replace(/\n/g, '<br>')}</p>
            </div>

            <div style="background: #2d3436; color: white; padding: 20px; text-align: center; font-size: 12px;">
              <p>© 2024 PANTOUFLES - Tous droits réservés</p>
              <p>📍 Limoges | 📧 contact@pantoufles.fr</p>
            </div>
          </div>
        `
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Email envoyé à ${clientEmail}:`, data);
            return { success: true, message: 'Email envoyé avec succès' };
        } else {
            const error = await response.json();
            console.error(`❌ Erreur Resend:`, error);
            return { success: false, message: error.message };
        }
    } catch (err) {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', err);
        return { success: false, message: err.message };
    }
};

/**
 * Envoyer un email de bienvenue au nouveau client
 */
export const sendWelcomeEmail = async (clientEmail, clientName) => {
    try {
        if (!RESEND_API_KEY) {
            console.warn('⚠️ RESEND_API_KEY non configurée');
            return;
        }

        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: SENDER_EMAIL,
                to: clientEmail,
                subject: '🩴 Bienvenue chez PANTOUFLES !',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #ff9f43, #ff6b6b); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">🩴 PANTOUFLES</h1>
              <p style="margin: 10px 0 0 0;">Service Adhoc</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <p>Bonjour ${clientName},</p>
              <p>Bienvenue chez PANTOUFLES ! 🎉</p>
              <p>Merci d'avoir rempli notre formulaire. Nous avons bien reçu votre demande et notre équipe l'examinera très rapidement.</p>
              <p>Nous vous recontacterons bientôt pour personnaliser votre service.</p>
              <p>À bientôt ! 💙</p>
              <p><strong>L'équipe PANTOUFLES</strong></p>
            </div>

            <div style="background: #2d3436; color: white; padding: 20px; text-align: center; font-size: 12px;">
              <p>© 2024 PANTOUFLES - Tous droits réservés</p>
              <p>📍 Limoges | 📧 contact@pantoufles.fr</p>
            </div>
          </div>
        `
            })
        });
    } catch (err) {
        console.error('Erreur:', err);
    }
};