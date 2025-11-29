import React, { useState } from 'react';
import { Phone, Heart, Home } from 'lucide-react';

function LandingPage({ setCurrentPage }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        services: [],
        acceptConditions: false
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

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

        try {
            // TODO: Intégrer Supabase pour stocker les données
            console.log('Formulaire soumis:', formData);

            // Simulation d'une requête
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSubmitted(true);
            setTimeout(() => {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    services: [],
                    acceptConditions: false
                });
                setSubmitted(false);
            }, 3000);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-b from-orange-50 via-white to-blue-50 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">🩴</span>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">PANTOUFLES</h1>
                            <p className="text-sm text-gray-600">Service Adhoc</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setCurrentPage('login')}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                    >
                        Admin
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-5xl font-bold text-gray-800 mb-6">
                            Bienvenue chez <span className="text-orange-500">PANTOUFLES</span>
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            <Heart className="inline mr-2 text-red-500" />
                            Parce que chacun mérite d'être bien <strong>chez soi</strong>
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Home className="text-blue-500 mt-1" />
                                <p className="text-gray-700"><strong>Ménage & Repassage</strong> - Votre maison, propre et accueillante</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="text-green-500 mt-1" />
                                <p className="text-gray-700"><strong>Courses</strong> - Nous y allons pour vous</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <Heart className="text-pink-500 mt-1" />
                                <p className="text-gray-700"><strong>Conseils Diététiques</strong> - Manger sainement, simplement</p>
                            </div>
                        </div>
                    </div>

                    {/* Illustration */}
                    <div className="text-center">
                        <div className="text-9xl mb-4">🩴</div>
                        <p className="text-gray-600 text-lg italic">
                            "Même une pantoufle moche a sa place"
                        </p>
                    </div>
                </div>
            </section>

            {/* Section Urgence */}
            <section className="bg-red-50 py-8 my-12">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold text-red-600 mb-2">Besoin d'une aide immédiate ?</h3>
                    <p className="text-gray-700 mb-4">Appelez-nous directement :</p>
                    <a href="tel:+33XXX" className="text-4xl font-bold text-red-600 hover:text-red-700">
                        📞 +33 X XX XX XX XX
                    </a>
                </div>
            </section>

            {/* Formulaire d'abonnement */}
            <section className="max-w-2xl mx-auto px-4 py-16">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">
                        Souscrire à nos services
                    </h3>
                    <p className="text-gray-600 mb-8">
                        Remplissez ce formulaire pour que nous puissions vous proposer une offre adaptée.
                    </p>

                    {submitted && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-4 rounded-lg mb-6">
                            ✅ Merci ! Nous vous recontacterons rapidement.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nom */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Votre nom</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                placeholder="Jean Dupont"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                placeholder="jean@example.com"
                            />
                        </div>

                        {/* Téléphone */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Téléphone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                placeholder="+33 X XX XX XX XX"
                            />
                        </div>

                        {/* Adresse */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Adresse</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                placeholder="123 Rue de la Paix, 87000 Limoges"
                            />
                        </div>

                        {/* Services */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-4">Services intéressants</label>
                            <div className="space-y-3">
                                {['Ménage', 'Repassage', 'Courses', 'Diététique'].map(service => (
                                    <label key={service} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.services.includes(service)}
                                            onChange={() => handleServiceChange(service)}
                                            className="w-5 h-5 text-purple-600 rounded"
                                        />
                                        <span className="text-gray-700">{service}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Conditions */}
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="acceptConditions"
                                checked={formData.acceptConditions}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    acceptConditions: e.target.checked
                                }))}
                                required
                                className="w-5 h-5 text-purple-600 rounded mt-1"
                            />
                            <span className="text-gray-600 text-sm">
                J'accepte la <a href="#privacy" className="text-purple-600 hover:underline">politique de confidentialité</a> et le traitement de mes données personnelles.
              </span>
                        </label>

                        {/* Bouton submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold py-3 rounded-lg hover:from-orange-500 hover:to-pink-600 transition disabled:opacity-50"
                        >
                            {loading ? '⏳ En cours...' : '📋 Je m\'abonne'}
                        </button>
                    </form>
                </div>
            </section>

            {/* Section Valeurs */}
            <section className="bg-gray-50 py-16 my-12">
                <div className="max-w-6xl mx-auto px-4">
                    <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Notre Vision</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow">
                            <p className="text-5xl mb-4">💙</p>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Empathie</h4>
                            <p className="text-gray-600">
                                Nous comprenons vos besoins. Chacun mérite du respect et de la bienveillance.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow">
                            <p className="text-5xl mb-4">✨</p>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Qualité</h4>
                            <p className="text-gray-600">
                                Nos services sont professionnels, fiables et adaptés à vos besoins.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow">
                            <p className="text-5xl mb-4">🏠</p>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Proximité</h4>
                            <p className="text-gray-600">
                                On est là pour vous, près de vous, quand vous en avez besoin.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Politique de confidentialité (mini) */}
            <section id="privacy" className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-600 text-sm">
                <p>
                    Vos données sont traitées en toute sécurité et conformément au RGPD.
                    Elles ne seront jamais vendues à des tiers.
                    Vous pouvez demander la suppression de votre compte à tout moment.
                </p>
            </section>
        </div>
    );
}

export default LandingPage;