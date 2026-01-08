import React, { useState } from 'react';
import { ArrowLeft, Heart, Home, ChevronDown, Star, Leaf, Shield, Sparkles, Users } from 'lucide-react';
import { supabase } from '../supabaseClient';
import SunWithRays from '../SunWithRays';
import ChatWidget from '../components/ChatWidget';
import MapSection from '../components/MapSection';

function LandingPage({ setCurrentPage }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        superficie: '',
        nombre_pieces: '',
        services: [],
        souhaits: '',
        acceptConditions: false
    });
    const [isScrolled, setIsScrolled] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedFaq, setExpandedFaq] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            if (!formData.name || !formData.email || !formData.phone || !formData.address) {
                setError('Veuillez remplir tous les champs obligatoires !');
                setLoading(false);
                return;
            }

            const { data, error: supabaseError } = await supabase
                .from('clients')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        superficie: formData.superficie,
                        nombre_pieces: formData.nombre_pieces,
                        services: formData.services,
                        souhaits: formData.souhaits
                    }
                ])
                .select();

            if (supabaseError) {
                console.error('Erreur Supabase:', supabaseError);
                setError('Erreur : ' + supabaseError.message);
                setLoading(false);
                return;
            }

            console.log('✅ Client ajouté avec succès !', data);

            setSubmitted(true);
            setTimeout(() => {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    superficie: '',
                    nombre_pieces: '',
                    services: [],
                    souhaits: '',
                    acceptConditions: false
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

    const faqItems = [
        {
            question: "Quels services proposez-vous ?",
            answer: "Nous proposons : ménage, repassage, courses, diététique et aide au repas. Chaque service est adapté à vos besoins."
        },
        {
            question: "Combien ça coûte ?",
            answer: "Les tarifs dépendent des services choisis. Contactez-nous pour un devis personnalisé !"
        },
        {
            question: "Êtes-vous disponible le week-end ?",
            answer: "Nous étudions chaque demande. Appelez-nous au numéro d'urgence pour en discuter."
        },
        {
            question: "Comment annuler un service ?",
            answer: "Vous pouvez annuler en nous contactant. Les conditions d'annulation dépendent de votre abonnement."
        }
    ];

    const testimonials = [
        {
            name: "Madame Dupont, 78 ans",
            text: "Depuis que PANTOUFLES s'occupe de mon ménage, j'ai plus de temps pour profiter de la vie. C'est un vrai soulagement !",
            service: "Ménage"
        },
        {
            name: "Monsieur Martin, 82 ans",
            text: "La diététicienne m'a aidé à mieux manger. Je me sens plus en forme ! Merci PANTOUFLES.",
            service: "Diététique"
        },
        {
            name: "Mademoiselle Lemoine, 65 ans",
            text: "Les courses me fatiguaient. Maintenant c'est quelqu'un d'autre qui s'en charge. Je peux me reposer.",
            service: "Courses"
        }
    ];

    const services = [
        {
            emoji: '🧹',
            title: 'Ménage',
            description: 'Un intérieur propre et accueillant sans effort',
            details: 'Nettoyage complet, vitres, sols, salle de bain...'
        },
        {
            emoji: '👕',
            title: 'Repassage',
            description: 'Vêtements parfaitement repassés',
            details: 'Linge traité avec soin, prêt à porter'
        },
        {
            emoji: '🛒',
            title: 'Courses',
            description: 'Vos achats faits pour vous',
            details: 'Selon votre liste, budget et préférences'
        },
        {
            emoji: '🥗',
            title: 'Diététique',
            description: 'Manger sainement, simplement',
            details: 'Conseils nutritionnels adaptés à vous'
        },
        {
            emoji: '🍽️',
            title: 'Aide au repas',
            description: 'Préparation et aide à la prise de repas',
            details: 'Accompagnement bienveillant et attentif'
        }
    ];

    const engagements = [
        {
            icon: '🌿',
            title: 'Produits BIO',
            description: 'Nous utilisons uniquement des produits écologiques et naturels pour nettoyer votre maison. Zéro chimie agressive, 100% nature.'
        },
        {
            icon: '♻️',
            title: 'Éco-responsable',
            description: 'Réduction des déchets, produits biodégradables, respect de l\'environnement. Prendre soin de votre maison c\'est aussi prendre soin de la planète.'
        },
        {
            icon: '🛡️',
            title: 'Hygiène Garantie',
            description: 'Normes strictes de nettoyage et d\'hygiène. Vos espaces sont traités avec la plus grande rigueur pour votre santé.'
        }
    ];

    const serviceDetails = [
        {
            name: 'Ménage Complet',
            items: [
                'Rangement et ménage des chambres et salon selon vos habitudes',
                'Nettoyage des sols : carrelage, parquet, moquette (adaptés au type)',
                'Nettoyage linge de toilette, serviettes, torchons',
                'Entretien complet cuisine et salle de bain',
                'Détartrage robinetteries et joints',
                'Nettoyage des vitres intérieures et extérieures',
                'Époussetage mobilier et surfaces',
                'Vidage poubelles et tri sélectif'
            ]
        },
        {
            name: 'Repassage',
            items: [
                'Repassage du linge selon vos préférences',
                'Traitement des plis difficiles',
                'Pliage et rangement soigneux',
                'Respect des tissus délicats',
                'Impeccabilité garantie'
            ]
        },
        {
            name: 'Courses',
            items: [
                'Achats selon votre liste préparée',
                'Respect de votre budget',
                'Sélection qualité des produits',
                'Livraison à votre domicile',
                'Rangement frigo/placard si souhaité'
            ]
        }
    ];

    return (
        <div className="bg-white">
            {/* HEADER CUSTOMISÉ - CRYSTAL CLAIR */}
            <header className={`bg-gradient-to-r from-orange-50 to-yellow-50 shadow-lg sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-1 md:py-1' : 'py-1 md:py-2'}`}>
                <div className="max-w-7xl mx-auto px-2 md:px-4">
                    <div className="flex justify-between items-center gap-2 md:gap-8">
                        {/* LOGO HEXAGONAL À GAUCHE */}
                        <div className="flex-shrink-0">
                            <img
                                src="/pantoufles_logo.png"
                                alt="PANTOUFLES Logo"
                                className={`hidden md:block object-contain transition-all duration-300 ${
                                    isScrolled ? 'h-16 md:h-32 md:w-32' : 'h-24 md:h-64 md:w-48'
                                }`}
                            />
                        </div>

                        {/* TEXTE AU CENTRE - CRYSTAL CLAIR */}
                        <div className="flex-grow text-center">
                            <h1 className={`font-bold mb-2 md:mb-3 transition-all duration-300 ${
                                isScrolled ? 'text-lg md:text-2xl lg:text-3xl' : 'text-xl md:text-4xl lg:text-5xl'
                            }`}>
                            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                                🧹 MÉNAGE À DOMICILE
                            </span>
                            </h1>

                            <p className={`font-bold text-gray-800 mb-1 md:mb-2 transition-all duration-300 ${
                                isScrolled ? 'text-xs md:text-sm lg:text-base' : 'text-sm md:text-xl lg:text-2xl'
                            }`}>
                                De 15€/h - Intervenantes certifiées
                            </p>

                            <p className={`text-gray-700 font-semibold mb-2 md:mb-4 transition-all duration-300 ${
                                isScrolled ? 'text-[10px] md:text-sm' : 'text-xs md:text-lg'
                            }`}>
                                Résidentiel • Bureaux • Cabinets médicaux
                            </p>

                            <button
                                onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-bold text-lg transition transform hover:scale-105"
                            >
                                ✨ Demander un devis
                            </button>
                        </div>

                        {/* LOCALISATION À DROITE */}
                        <div className="flex-shrink-0 text-center">
                            <p className="text-3xl font-bold text-purple-600">📍</p>
                            <p className="font-bold text-gray-800 text-lg">Limoges</p>
                            <p className="text-sm text-gray-600">et alentours</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50 py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                                Bienvenue chez <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">PANTOUFLES</span>
                            </h2>
                            <p className="text-xl text-gray-700 mb-8">
                                <Heart className="inline mr-2 text-red-500" size={28} />
                                <strong>Chacun mérite d'être bien chez soi.</strong> Nous nous occupons de tout.
                            </p>
                            <p className="text-gray-600 mb-8 text-lg">
                                "Même une pantoufle moche a sa place dans la maison" - Chez nous aussi, chacun a sa place.
                            </p>
                            <a href="#formulaire" className="inline-block bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold py-4 px-8 rounded-xl hover:from-orange-500 hover:to-pink-600 transition transform hover:scale-105 text-lg">
                                ➕ Je m'abonne
                            </a>
                        </div>

                        <div className="text-center">
                            <div className="text-9xl mb-6 animate-bounce">🩴</div>
                            <p className="text-gray-600 text-lg italic">
                                "Prendre soin de vous,<br/>c'est notre mission"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <h3 className="text-4xl font-bold text-center text-gray-800 mb-16">
                        Nos Services
                    </h3>

                    {/* Première rangée - 3 services */}
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        {services.slice(0, 3).map((service, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl hover:shadow-xl transition transform hover:scale-105">
                                <div className="text-6xl mb-4 text-center">{service.emoji}</div>
                                <h4 className="text-2xl font-bold text-gray-800 mb-2 text-center">{service.title}</h4>
                                <p className="text-gray-700 text-center font-semibold mb-2">{service.description}</p>
                                <p className="text-gray-600 text-sm text-center">{service.details}</p>
                            </div>
                        ))}
                    </div>

                    {/* Deuxième rangée - 2 services centrés */}
                    <div className="flex justify-center">
                        <div className="grid md:grid-cols-2 gap-8">
                            {services.slice(3).map((service, idx) => (
                                <div key={idx + 3} className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl hover:shadow-xl transition transform hover:scale-105">
                                    <div className="text-6xl mb-4 text-center">{service.emoji}</div>
                                    <h4 className="text-2xl font-bold text-gray-800 mb-2 text-center">{service.title}</h4>
                                    <p className="text-gray-700 text-center font-semibold mb-2">{service.description}</p>
                                    <p className="text-gray-600 text-sm text-center">{service.details}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* URGENCE SECTION */}
            <section className="bg-gradient-to-r from-red-500 to-red-600 py-12">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold text-white mb-4">
                        <Home className="inline mr-3" size={32} />
                        Besoin d'une aide immédiate ?
                    </h3>
                    <a href="tel:+33XXX" className="text-4xl font-bold text-white hover:text-gray-100 transition">
                        📞 +33 X XX XX XX XX
                    </a>
                </div>
            </section>

            {/* NOTRE ENGAGEMENT & PRODUITS */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <h3 className="text-4xl font-bold text-center text-gray-800 mb-16">
                        Notre Engagement & Nos Produits
                    </h3>

                    {/* Engagements */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {engagements.map((engagement, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                                <div className="text-5xl mb-4 text-center">{engagement.icon}</div>
                                <h4 className="text-2xl font-bold text-gray-800 mb-3 text-center">{engagement.title}</h4>
                                <p className="text-gray-600 text-center">{engagement.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Services Détaillés */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h4 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                            Détail de nos Services
                        </h4>
                        <div className="grid md:grid-cols-3 gap-8">
                            {serviceDetails.map((service, idx) => (
                                <div key={idx} className="border-2 border-purple-200 rounded-xl p-6 hover:border-purple-600 transition">
                                    <h5 className="text-xl font-bold text-purple-600 mb-4">{service.name}</h5>
                                    <ul className="space-y-2">
                                        {service.items.map((item, itemIdx) => (
                                            <li key={itemIdx} className="flex gap-2 text-gray-700">
                                                <span className="text-green-600 font-bold">✓</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* POURQUOI PANTOUFLES */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <h3 className="text-4xl font-bold text-center text-gray-800 mb-16">
                        Pourquoi PANTOUFLES ?
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg">
                            <div className="text-5xl mb-4">💙</div>
                            <h4 className="text-2xl font-bold text-gray-800 mb-3">Empathie</h4>
                            <p className="text-gray-600">
                                Nous comprenons vos besoins. Chacun mérite respect et bienveillance. Nous ne sommes pas juste des prestataires, nous sommes vos alliés.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl shadow-lg">
                            <div className="text-5xl mb-4">⭐</div>
                            <h4 className="text-2xl font-bold text-gray-800 mb-3">Qualité</h4>
                            <p className="text-gray-600">
                                Services professionnels, fiables et adaptés à VOS besoins. Nous ne sommes pas une usine, c'est du sur-mesure.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg">
                            <div className="text-5xl mb-4">🏠</div>
                            <h4 className="text-2xl font-bold text-gray-800 mb-3">Proximité</h4>
                            <p className="text-gray-600">
                                On est là pour vous, près de vous, quand vous en avez besoin. Pas de grandes multinationales froides, juste du vrai soutien.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* REJOINDRE L'ÉQUIPE */}
            <section className="py-20 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-4xl font-bold text-gray-800 mb-6">
                                Rejoignez notre équipe ! 💪
                            </h3>
                            <p className="text-xl text-gray-700 mb-6">
                                Vous êtes passionné(e) par le service aux personnes ? Vous cherchez une activité flexible avec du sens ?
                            </p>
                            <ul className="space-y-3 mb-8 text-lg text-gray-700">
                                <li>✅ <strong>Horaires flexibles</strong> - Travaillez quand vous voulez</li>
                                <li>✅ <strong>Travail dignifié</strong> - Respect et bienveillance garantis</li>
                                <li>✅ <strong>Rémunération juste</strong> - Transparence totale</li>
                                <li>✅ <strong>Équipe sympathique</strong> - Vous n'êtes pas seul(e)</li>
                            </ul>
                            <button
                                onClick={() => setCurrentPage('intervenants')}
                                className="inline-block bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-blue-700 transition transform hover:scale-105 text-lg shadow-lg"
                            >
                                <Users className="inline mr-2" size={24} />
                                Soumettre ma candidature
                            </button>
                        </div>

                        <div className="text-center">
                            <div className="text-9xl mb-6 animate-bounce">💼</div>
                            <p className="text-gray-600 text-lg italic">
                                "Faire partie d'une équipe<br/>qui change les choses"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TÉMOIGNAGES */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <h3 className="text-4xl font-bold text-center text-gray-800 mb-16">
                        Ils nous font confiance
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl border-2 border-purple-200 shadow-lg">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                                <div className="border-t border-purple-200 pt-4">
                                    <p className="font-bold text-gray-800">{testimonial.name}</p>
                                    <p className="text-sm text-purple-600">Service : {testimonial.service}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* GOOGLE MAP - ZONE DE SERVICE */}
            <MapSection />

            {/* FORMULAIRE PANTOUFLE */}
            <section id="formulaire" className="py-20 bg-gradient-to-br from-orange-50 to-pink-50">
                <div className="max-w-2xl mx-auto px-4">
                    <h3 className="text-4xl font-bold text-center text-gray-800 mb-4">
                        Rejoignez PANTOUFLES
                    </h3>
                    <p className="text-center text-gray-600 mb-12">
                        Remplissez ce formulaire et nous vous recontacterons rapidement
                    </p>

                    {submitted && (
                        <div className="bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-2xl mb-8 text-center font-semibold">
                            ✅ Merci ! Nous vous recontacterons très rapidement.
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-8 text-center font-semibold">
                            ❌ {error}
                        </div>
                    )}

                    <form id="form-section" onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-orange-300 relative">
                        {/* Déco pantoufle en haut */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce">🩴</div>

                        <div className="space-y-6 mt-4">
                            {/* Nom */}
                            <div>
                                <label className="block text-gray-800 font-bold mb-3 text-lg">👤 Votre nom</label>
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

                            {/* Adresse */}
                            <div>
                                <label className="block text-gray-800 font-bold mb-3 text-lg">🏠 Adresse</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-6 py-3 border-2 border-gray-300 rounded-2xl focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200 text-lg transition"
                                    placeholder="123 Rue de la Paix, 87000 Limoges"
                                />
                            </div>

                            {/* Superficie */}
                            <div>
                                <label className="block text-gray-800 font-bold mb-3 text-lg">📐 Superficie (m²)</label>
                                <input
                                    type="text"
                                    name="superficie"
                                    value={formData.superficie}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-3 border-2 border-gray-300 rounded-2xl focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200 text-lg transition"
                                    placeholder="ex: 80 m²"
                                />
                            </div>

                            {/* Nombre de pièces */}
                            <div>
                                <label className="block text-gray-800 font-bold mb-3 text-lg">🏠 Nombre de pièces</label>
                                <input
                                    type="text"
                                    name="nombre_pieces"
                                    value={formData.nombre_pieces}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-3 border-2 border-gray-300 rounded-2xl focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200 text-lg transition"
                                    placeholder="ex: 4 pièces"
                                />
                            </div>

                            {/* Services */}
                            <div>
                                <label className="block text-gray-800 font-bold mb-4 text-lg">🛎️ Services intéressants</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {['Ménage', 'Repassage', 'Courses', 'Diététique', 'Aide au repas'].map(service => (
                                        <label key={service} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-purple-100 transition">
                                            <input
                                                type="checkbox"
                                                checked={formData.services.includes(service)}
                                                onChange={() => handleServiceChange(service)}
                                                className="w-6 h-6 text-purple-600 rounded-lg accent-purple-600"
                                            />
                                            <span className="text-gray-700 font-medium text-sm">{service}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Souhaits / Préférences */}
                            <div>
                                <label className="block text-gray-800 font-bold mb-3 text-lg">💭 Vos souhaits, préférences, doléances (max 200 caractères)</label>
                                <textarea
                                    name="souhaits"
                                    value={formData.souhaits}
                                    onChange={(e) => setFormData({...formData, souhaits: e.target.value.slice(0, 200)})}
                                    maxLength="200"
                                    className="w-full px-6 py-3 border-2 border-gray-300 rounded-2xl focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200 text-lg transition h-20"
                                    placeholder="Décrivez vos souhaits, vos préférences, vos doléances..."
                                />
                                <p className="text-sm text-gray-500 mt-1">{formData.souhaits.length}/200</p>
                            </div>

                            {/* Conditions */}
                            <label className="flex items-start gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                                <input
                                    type="checkbox"
                                    name="acceptConditions"
                                    checked={formData.acceptConditions}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        acceptConditions: e.target.checked
                                    }))}
                                    required
                                    className="w-6 h-6 text-purple-600 rounded mt-1 accent-purple-600"
                                />
                                <span className="text-gray-700">
                  J'accepte la <a href="#privacy" className="text-purple-600 hover:underline font-bold">politique de confidentialité</a> et le traitement de mes données personnelles selon le RGPD.
                </span>
                            </label>

                            {/* Bouton Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold py-4 rounded-2xl hover:from-orange-500 hover:to-pink-600 transition transform hover:scale-105 disabled:opacity-50 text-lg shadow-lg"
                            >
                                {loading ? '⏳ En cours...' : '🩴 Je m\'abonne à PANTOUFLES'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <h3 className="text-4xl font-bold text-center text-gray-800 mb-16">
                        Questions Fréquentes
                    </h3>
                    <div className="space-y-4">
                        {faqItems.map((item, idx) => (
                            <div key={idx} className="border-2 border-gray-300 rounded-2xl overflow-hidden hover:border-purple-600 transition">
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                    className="w-full px-6 py-4 bg-gray-50 hover:bg-purple-50 flex justify-between items-center transition"
                                >
                                    <span className="font-bold text-gray-800 text-lg text-left">{item.question}</span>
                                    <ChevronDown
                                        size={24}
                                        className={`text-purple-600 transition transform ${expandedFaq === idx ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {expandedFaq === idx && (
                                    <div className="px-6 py-4 bg-purple-50 text-gray-700 border-t-2 border-gray-300">
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <div className="mb-6">
                        <p className="text-2xl font-bold mb-2">🩴 PANTOUFLES - Service Adhoc</p>
                        <p className="text-gray-400">"Même une pantoufle moche a sa place"</p>
                    </div>
                    <p className="text-gray-400 text-sm mb-6">
                        Vos données sont traitées en toute sécurité et conformément au RGPD.
                        Elles ne seront jamais vendues à des tiers.
                        Vous pouvez demander la suppression de votre compte à tout moment.
                    </p>

                    {/* LIEN ADMIN DISCRET */}
                    <button
                        onClick={() => setCurrentPage('login')}
                        className="text-gray-500 hover:text-gray-300 text-xs underline transition mb-4"
                    >
                        Accès partenaires
                    </button>

                    <p className="text-gray-500 text-xs">© 2024 PANTOUFLES. Tous droits réservés.</p>
                </div>
            </footer>

            {/* CLAUDE CHAT WIDGET - FLOTTANT BAS À DROITE */}
            <ChatWidget />
        </div>
    );
}

export default LandingPage;