import React, { useState } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { supabase } from '../supabaseClient';

function IntervenantsForm({ setCurrentPage }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        anciennete_annees: '',
        secteur_intervention: '5km',
        services: [],
        accepte_charte: false
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleServiceChange = (service) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Vérifier que tous les champs obligatoires sont remplis
            if (!formData.name || !formData.email || !formData.phone || !formData.accepte_charte) {
                setError('Veuillez remplir tous les champs et accepter la charte de confidentialité !');
                setLoading(false);
                return;
            }

            // Insérer les données dans Supabase
            const { data, error: supabaseError } = await supabase
                .from('intervenants')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        anciennete_annees: formData.anciennete_annees ? parseInt(formData.anciennete_annees) : 0,
                        secteur_intervention: formData.secteur_intervention,
                        services: formData.services,
                        accepte_charte: formData.accepte_charte
                    }
                ])
                .select();

            if (supabaseError) {
                console.error('Erreur Supabase:', supabaseError);
                setError('Erreur : ' + supabaseError.message);
                setLoading(false);
                return;
            }

            // Envoyer notification email à l'admin
            try {
                const notificationResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/send-notification`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type: 'INTERVENANT',
                        data: {
                            nom: formData.name,
                            email: formData.email,
                            telephone: formData.phone,
                            anciennete: formData.anciennete_annees ? `${formData.anciennete_annees} ans` : 'Non spécifiée',
                            secteur: formData.secteur_intervention,
                            services: formData.services.join(', ')
                        }
                    })
                });

                if (notificationResponse.ok) {
                    console.log('✅ Notification admin envoyée');
                } else {
                    console.warn('⚠️ Notification admin non envoyée');
                }
            } catch (notifError) {
                console.warn('⚠️ Erreur notification:', notifError);
                // On continue même si la notification échoue
            }

            // Succès !
            setSubmitted(true);
            setTimeout(() => {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    anciennete_annees: '',
                    secteur_intervention: '5km',
                    services: [],
                    accepte_charte: false
                });
                setSubmitted(false);
            }, 3000);

        } catch (err) {
            console.error('Erreur:', err);
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">🩴</span>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">PANTOUFLES</h1>
                            <p className="text-xs text-gray-600">Service Adhoc</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenu */}
            <main className="max-w-2xl mx-auto px-4 py-12">
                {/* Bouton retour */}
                <button
                    onClick={() => setCurrentPage('landing')}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-8"
                >
                    <ArrowLeft size={20} />
                    Retour à l'accueil
                </button>

                {/* Titre */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Rejoignez notre équipe ! 💪
                    </h2>
                    <p className="text-xl text-gray-700">
                        Vous êtes intéressé pour travailler avec PANTOUFLES ?
                    </p>
                </div>

                {/* Formulaire */}
                {submitted && (
                    <div className="bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-2xl mb-8 text-center font-semibold">
                        ✅ Merci ! Votre candidature a été reçue. Nous vous recontacterons très rapidement.
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-8 text-center font-semibold">
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-orange-300 relative">
                    {/* Déco pantoufle en haut */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce">🩴</div>

                    <div className="space-y-6 mt-4">
                        {/* Nom */}
                        <div>
                            <label className="block text-gray-800 font-bold mb-3 text-lg">👤 Votre nom et prénom *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-6 py-3 border-2 border-gray-300 rounded-2xl focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200 text-lg transition"
                                placeholder="Jean Dupont"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-gray-800 font-bold mb-3 text-lg">📧 Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-6 py-3 border-2 border-gray-300 rounded-2xl focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200 text-lg transition"
                                placeholder="jean@example.com"
                            />
                        </div>

                        {/* Téléphone */}
                        <div>
                            <label className="block text-gray-800 font-bold mb-3 text-lg">📱 Téléphone *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="w-full px-6 py-3 border-2 border-gray-300 rounded-2xl focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200 text-lg transition"
                                placeholder="+33 X XX XX XX XX"
                            />
                        </div>

                        {/* Ancienneté */}
                        <div>
                            <label className="block text-gray-800 font-bold mb-3 text-lg">📅 Ancienneté (années d'expérience)</label>
                            <input
                                type="number"
                                name="anciennete_annees"
                                min="0"
                                value={formData.anciennete_annees}
                                onChange={handleInputChange}
                                className="w-full px-6 py-3 border-2 border-gray-300 rounded-2xl focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200 text-lg transition"
                                placeholder="ex: 2"
                            />
                        </div>

                        {/* Secteur d'intervention */}
                        <div>
                            <label className="block text-gray-800 font-bold mb-3 text-lg">🗺️ Secteur d'intervention *</label>
                            <select
                                name="secteur_intervention"
                                value={formData.secteur_intervention}
                                onChange={handleInputChange}
                                required
                                className="w-full px-6 py-3 border-2 border-gray-300 rounded-2xl focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200 text-lg transition"
                            >
                                <option value="">Sélectionner un secteur</option>
                                <option value="5km">📍 Rayon 5km</option>
                                <option value="10km">📍 Rayon 10km</option>
                                <option value="15km">📍 Rayon 15km</option>
                                <option value="20km">📍 Rayon 20km</option>
                                <option value="illimite">📍 Illimité</option>
                            </select>
                        </div>

                        {/* Services */}
                        <div>
                            <label className="block text-gray-800 font-bold mb-4 text-lg">🛎️ Services que vous proposez</label>
                            <div className="grid grid-cols-2 gap-4">
                                {['Ménage', 'Repassage', 'Courses', 'Diététique', 'Aide au repas'].map(service => (
                                    <label key={service} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-purple-100 transition">
                                        <input
                                            type="checkbox"
                                            checked={formData.services.includes(service)}
                                            onChange={() => handleServiceChange(service)}
                                            className="w-6 h-6 text-purple-600 rounded-lg accent-purple-600"
                                        />
                                        <span className="text-gray-700 font-medium">{service}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Charte de Confidentialité */}
                        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
                            <h3 className="font-bold text-blue-900 mb-3">🔒 Charte de Confidentialité PANTOUFLES</h3>
                            <div className="bg-white p-3 rounded mb-3 max-h-32 overflow-y-auto text-sm text-gray-700 border border-gray-300">
                                <p className="mb-2"><strong>Article 1 : Respect de la vie privée</strong></p>
                                <p className="mb-2">L'intervenante s'engage à respecter la confidentialité des données personnelles des clients.</p>
                                <p className="mb-2"><strong>Article 2 : Discrétion</strong></p>
                                <p className="mb-2">Les informations concernant la vie privée des clients (famille, finances, santé) ne doivent pas être divulguées.</p>
                                <p className="mb-2"><strong>Article 3 : Professionnalisme</strong></p>
                                <p>L'intervenante s'engage à maintenir une relation professionnelle avec les clients.</p>
                            </div>
                            <label className="flex items-start gap-3 cursor-pointer p-3 bg-white rounded hover:bg-blue-100 transition border border-blue-200">
                                <input
                                    type="checkbox"
                                    name="accepte_charte"
                                    checked={formData.accepte_charte}
                                    onChange={handleCheckboxChange}
                                    required
                                    className="w-6 h-6 text-blue-600 rounded mt-1 accent-blue-600"
                                />
                                <span className="text-gray-700 font-medium">✅ J'accepte la charte de confidentialité PANTOUFLES</span>
                            </label>
                        </div>

                        {/* Message info */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                            <p className="text-blue-700">
                                💙 <strong>Pourquoi rejoindre PANTOUFLES ?</strong>
                            </p>
                            <ul className="text-blue-600 text-sm mt-2 space-y-1">
                                <li>✓ Horaires flexibles</li>
                                <li>✓ Travail dignifié et respectueux</li>
                                <li>✓ Rémunération juste et transparente</li>
                                <li>✓ Équipe bienveillante</li>
                            </ul>
                        </div>

                        {/* Conditions */}
                        <label className="flex items-start gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                            <input
                                type="checkbox"
                                required
                                className="w-6 h-6 text-purple-600 rounded mt-1 accent-purple-600"
                            />
                            <span className="text-gray-700">
                                J'accepte les <a href="#privacy" className="text-purple-600 hover:underline font-bold">conditions d'utilisation</a> et le traitement de mes données personnelles.
                            </span>
                        </label>

                        {/* Bouton Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold py-4 rounded-2xl hover:from-orange-500 hover:to-pink-600 transition transform hover:scale-105 disabled:opacity-50 text-lg shadow-lg"
                        >
                            {loading ? '⏳ En cours...' : '🩴 Soumettre ma candidature'}
                        </button>

                        {/* Contact */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-gray-600 text-sm">
                                Des questions ? Contactez-nous : <strong>contact@pantoufles.fr</strong>
                            </p>
                        </div>
                    </div>
                </form>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-12">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-gray-400 text-sm">
                        © 2024 PANTOUFLES - Tous droits réservés
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default IntervenantsForm;