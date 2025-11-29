import React, { useState } from 'react';
import { LogOut, Users, Home, Settings } from 'lucide-react';

function AdminDashboard({ onLogout }) {
    const [activeTab, setActiveTab] = useState('accueil');
    const [intervenantes, setIntervenantes] = useState([]);
    const [clients, setClients] = useState([]);
    const [newIntervenant, setNewIntervenant] = useState({
        name: '',
        phone: '',
        email: '',
        services: []
    });

    const handleAddIntervenant = () => {
        if (newIntervenant.name.trim()) {
            setIntervenantes([...intervenantes, { ...newIntervenant, id: Date.now() }]);
            setNewIntervenant({ name: '', phone: '', email: '', services: [] });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header Admin */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🩴</span>
                        <h1 className="text-2xl font-bold text-gray-800">PANTOUFLES - Admin</h1>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        <LogOut size={20} />
                        Déconnexion
                    </button>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 flex gap-8">
                    <button
                        onClick={() => setActiveTab('accueil')}
                        className={`py-4 px-2 border-b-2 transition ${
                            activeTab === 'accueil'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <Home className="inline mr-2" size={20} />
                        Accueil
                    </button>
                    <button
                        onClick={() => setActiveTab('intervenantes')}
                        className={`py-4 px-2 border-b-2 transition ${
                            activeTab === 'intervenantes'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <Users className="inline mr-2" size={20} />
                        Intervenantes ({intervenantes.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={`py-4 px-2 border-b-2 transition ${
                            activeTab === 'clients'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <Users className="inline mr-2" size={20} />
                        Clients ({clients.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('parametres')}
                        className={`py-4 px-2 border-b-2 transition ${
                            activeTab === 'parametres'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <Settings className="inline mr-2" size={20} />
                        Paramètres
                    </button>
                </div>
            </nav>

            {/* Contenu */}
            <main className="max-w-7xl mx-auto px-4 py-8">

                {/* TAB: Accueil */}
                {activeTab === 'accueil' && (
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <p className="text-gray-600">Intervenantes</p>
                            <p className="text-4xl font-bold text-purple-600">{intervenantes.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <p className="text-gray-600">Clients</p>
                            <p className="text-4xl font-bold text-blue-600">{clients.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <p className="text-gray-600">Missions en cours</p>
                            <p className="text-4xl font-bold text-green-600">0</p>
                        </div>
                    </div>
                )}

                {/* TAB: Intervenantes */}
                {activeTab === 'intervenantes' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ajouter une intervenante</h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nom et prénom"
                                    value={newIntervenant.name}
                                    onChange={(e) => setNewIntervenant({ ...newIntervenant, name: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newIntervenant.email}
                                    onChange={(e) => setNewIntervenant({ ...newIntervenant, email: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                />
                                <input
                                    type="tel"
                                    placeholder="Téléphone"
                                    value={newIntervenant.phone}
                                    onChange={(e) => setNewIntervenant({ ...newIntervenant, phone: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                />
                                <button
                                    onClick={handleAddIntervenant}
                                    className="w-full bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 transition"
                                >
                                    ➕ Ajouter
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Liste des intervenantes</h2>
                            {intervenantes.length === 0 ? (
                                <p className="text-gray-500">Aucune intervenante ajoutée pour le moment.</p>
                            ) : (
                                <div className="space-y-4">
                                    {intervenantes.map((int) => (
                                        <div key={int.id} className="border-2 border-gray-200 p-4 rounded-lg">
                                            <p className="font-bold text-lg">{int.name}</p>
                                            <p className="text-gray-600">{int.email}</p>
                                            <p className="text-gray-600">{int.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: Clients */}
                {activeTab === 'clients' && (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Clients abonnés</h2>
                        {clients.length === 0 ? (
                            <p className="text-gray-500">Aucun client pour le moment. Les clients s'inscriront via le formulaire!</p>
                        ) : (
                            <div className="space-y-4">
                                {clients.map((client) => (
                                    <div key={client.id} className="border-2 border-gray-200 p-4 rounded-lg">
                                        <p className="font-bold">{client.name}</p>
                                        <p className="text-gray-600">{client.email}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: Paramètres */}
                {activeTab === 'parametres' && (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Paramètres</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Numéro d'urgence</label>
                                <input
                                    type="tel"
                                    placeholder="+33 X XX XX XX XX"
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Email de contact</label>
                                <input
                                    type="email"
                                    placeholder="contact@pantoufles.fr"
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                />
                            </div>
                            <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                                💾 Sauvegarder
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;