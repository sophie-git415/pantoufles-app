import React, { useState } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { supabase } from '../supabaseClient';

function IntervenantsForm({ setCurrentPage }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        services: []
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
            // Vérifier que tous les champs sont remplis
            if (!formData.name || !formData.email || !formData.phone) {
                setError('Veuillez remplir tous les champs !');
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
                        services: formData.services
                    }
                ])
                .select();

            if (supabaseError) {
                console.error('Erreur Supabase:', supabaseError);
                setError('Erreur : ' + supabaseError.message);
                setLoading(false);
                return;
            }

            console.log('✅ Intervenante ajoutée avec succès !', data);

            // Succès !
            setSubmitted(true);
            setTimeout(() => {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    services: []
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
                            <label className="block text-gray-800 font-bold mb-3 text-lg">👤 Votre nom et prénom</label>
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
                            <label className="block text-gray-800 font-bold mb-3 text-lg">📧 Email</label>
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
                            <label className="block text-gray-800 font-bold mb-3 text-lg">📱 Téléphone</label>
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