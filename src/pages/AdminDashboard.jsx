import React, { useState, useEffect } from 'react';
import { LogOut, Users, Home, Settings, Trash2, Mail } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { sendStatusUpdateEmail } from '../emailService';

function AdminDashboard({ onLogout }) {
    const [activeTab, setActiveTab] = useState('accueil');
    const [intervenantes, setIntervenantes] = useState([]);
    const [clients, setClients] = useState([]);
    const [loadingClients, setLoadingClients] = useState(false);
    const [emailSending, setEmailSending] = useState({});
    const [emailSuccess, setEmailSuccess] = useState({});
    const [newIntervenant, setNewIntervenant] = useState({
        name: '',
        phone: '',
        email: '',
        services: []
    });

    // Charger les clients depuis Supabase
    useEffect(() => {
        if (activeTab === 'clients') {
            loadClients();
        }
    }, [activeTab]);

    const loadClients = async () => {
        setLoadingClients(true);
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Erreur Supabase:', error);
            } else {
                setClients(data || []);
            }
        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            setLoadingClients(false);
        }
    };

    const handleAddIntervenant = () => {
        if (newIntervenant.name.trim()) {
            setIntervenantes([...intervenantes, { ...newIntervenant, id: Date.now() }]);
            setNewIntervenant({ name: '', phone: '', email: '', services: [] });
        }
    };

    const updateClientStatus = async (clientId, newStatus, clientEmail, clientName) => {
        try {
            // Mettre à jour la BD
            const { error } = await supabase
                .from('clients')
                .update({ status: newStatus })
                .eq('id', clientId);

            if (error) {
                console.error('Erreur:', error);
                return;
            }

            // Envoyer l'email
            setEmailSending(prev => ({ ...prev, [clientId]: true }));

            const emailResult = await sendStatusUpdateEmail(clientEmail, clientName, newStatus);

            setEmailSending(prev => ({ ...prev, [clientId]: false }));

            if (emailResult.success) {
                setEmailSuccess(prev => ({ ...prev, [clientId]: true }));
                setTimeout(() => {
                    setEmailSuccess(prev => ({ ...prev, [clientId]: false }));
                }, 3000);
            }

            // Recharger les clients
            loadClients();
        } catch (err) {
            console.error('Erreur:', err);
            setEmailSending(prev => ({ ...prev, [clientId]: false }));
        }
    };

    const deleteClient = async (clientId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
            try {
                const { error } = await supabase
                    .from('clients')
                    .delete()
                    .eq('id', clientId);

                if (error) {
                    console.error('Erreur:', error);
                } else {
                    loadClients();
                }
            } catch (err) {
                console.error('Erreur:', err);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'en_attente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'confirmé':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'en_cours':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'terminé':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'en_attente':
                return '⏳ En attente';
            case 'confirmé':
                return '✅ Confirmé';
            case 'en_cours':
                return '🔄 En cours';
            case 'terminé':
                return '🎉 Terminé';
            default:
                return status;
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
                            <p className="text-gray-600">Clients inscrits</p>
                            <p className="text-4xl font-bold text-blue-600">{clients.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <p className="text-gray-600">En attente de confirmation</p>
                            <p className="text-4xl font-bold text-yellow-600">
                                {clients.filter(c => c.status === 'en_attente').length}
                            </p>
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestion des clients</h2>

                        {loadingClients ? (
                            <p className="text-gray-500">Chargement des clients...</p>
                        ) : clients.length === 0 ? (
                            <p className="text-gray-500">Aucun client pour le moment.</p>
                        ) : (
                            <div className="space-y-4">
                                {clients.map((client) => (
                                    <div key={client.id} className="border-2 border-gray-300 rounded-lg p-6 hover:shadow-lg transition">
                                        {/* Message de succès email */}
                                        {emailSuccess[client.id] && (
                                            <div className="bg-green-100 border-l-4 border-green-600 p-4 mb-4 text-green-700 font-semibold">
                                                ✅ Email envoyé avec succès à {client.email}
                                            </div>
                                        )}

                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            {/* Infos Client */}
                                            <div>
                                                <p className="font-bold text-lg text-gray-800">{client.name}</p>
                                                <p className="text-gray-600">📧 {client.email}</p>
                                                <p className="text-gray-600">📱 {client.phone}</p>
                                                <p className="text-gray-600">📍 {client.address}</p>
                                                <p className="text-gray-600 mt-2">
                                                    <strong>Services :</strong> {client.services && client.services.length > 0 ? client.services.join(', ') : 'Aucun'}
                                                </p>
                                                <p className="text-gray-500 text-sm mt-2">
                                                    Inscrit le : {new Date(client.created_at).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>

                                            {/* Gestion Status */}
                                            <div className="flex flex-col justify-between">
                                                <div>
                                                    <p className="font-bold text-gray-700 mb-2">Statut actuel :</p>
                                                    <div className={`inline-block px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(client.status)}`}>
                                                        {getStatusLabel(client.status)}
                                                    </div>
                                                </div>

                                                {/* Boutons Status */}
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    <button
                                                        onClick={() => updateClientStatus(client.id, 'en_attente', client.email, client.name)}
                                                        disabled={emailSending[client.id]}
                                                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                                                            client.status === 'en_attente'
                                                                ? 'bg-yellow-500 text-white'
                                                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                        } ${emailSending[client.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {emailSending[client.id] ? '📧...' : '⏳ Attente'}
                                                    </button>
                                                    <button
                                                        onClick={() => updateClientStatus(client.id, 'confirmé', client.email, client.name)}
                                                        disabled={emailSending[client.id]}
                                                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                                                            client.status === 'confirmé'
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                                        } ${emailSending[client.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {emailSending[client.id] ? '📧...' : '✅ Confirmé'}
                                                    </button>
                                                    <button
                                                        onClick={() => updateClientStatus(client.id, 'en_cours', client.email, client.name)}
                                                        disabled={emailSending[client.id]}
                                                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                                                            client.status === 'en_cours'
                                                                ? 'bg-purple-500 text-white'
                                                                : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                                        } ${emailSending[client.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {emailSending[client.id] ? '📧...' : '🔄 En cours'}
                                                    </button>
                                                    <button
                                                        onClick={() => updateClientStatus(client.id, 'terminé', client.email, client.name)}
                                                        disabled={emailSending[client.id]}
                                                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                                                            client.status === 'terminé'
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        } ${emailSending[client.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {emailSending[client.id] ? '📧...' : '🎉 Terminé'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bouton Supprimer */}
                                        <div className="border-t pt-4">
                                            <button
                                                onClick={() => deleteClient(client.id)}
                                                className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium transition"
                                            >
                                                <Trash2 size={18} />
                                                Supprimer ce client
                                            </button>
                                        </div>
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