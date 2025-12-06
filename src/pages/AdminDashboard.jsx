import React, { useState, useEffect } from 'react';
import { LogOut, Users, Home, Settings, Trash2, Calendar, Plus, Edit2, X, Archive } from 'lucide-react';
import { supabase } from '../supabaseClient';
import ArchiveMissionsModal from '../components/ArchiveMissionsModal';

function AdminDashboard({ onLogout }) {
    const [activeTab, setActiveTab] = useState('accueil');
    const [intervenants, setIntervenants] = useState([]);
    const [clients, setClients] = useState([]);
    const [missions, setMissions] = useState([]);
    const [loadingClients, setLoadingClients] = useState(false);
    const [loadingIntervenants, setLoadingIntervenants] = useState(false);
    const [loadingMissions, setLoadingMissions] = useState(false);
    const [archiveModalOpen, setArchiveModalOpen] = useState(false);

    const [editingClient, setEditingClient] = useState(null);
    const [editingIntervenant, setEditingIntervenant] = useState(null);
    const [editingMission, setEditingMission] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const [newMission, setNewMission] = useState({
        client_id: '',
        intervenant_id: '',
        service: '',
        date_mission: '',
        heure_debut: '',
        heure_fin: '',
        description: '',
        moyen_paiement: '',
        duree_heures: '',
        duree_minutes: '',
        tarif_horaire: '',
        montant_ttc: ''
    });

    // Charger les données au changement d'onglet
    useEffect(() => {
        if (activeTab === 'clients') loadClients();
        if (activeTab === 'intervenantes') loadIntervenants();
        if (activeTab === 'missions') loadMissions();
    }, [activeTab]);

    const loadClients = async () => {
        setLoadingClients(true);
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) console.error('Erreur:', error);
            else setClients(data || []);
        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            setLoadingClients(false);
        }
    };

    const loadIntervenants = async () => {
        setLoadingIntervenants(true);
        try {
            const { data, error } = await supabase
                .from('intervenants')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) console.error('Erreur:', error);
            else setIntervenants(data || []);
        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            setLoadingIntervenants(false);
        }
    };

    const loadMissions = async () => {
        setLoadingMissions(true);
        try {
            const { data, error } = await supabase
                .from('missions')
                .select('*')
                .order('date_mission', { ascending: true });
            if (error) console.error('Erreur:', error);
            else setMissions(data || []);
        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            setLoadingMissions(false);
        }
    };

    // ===== CALCUL AUTOMATIQUE MONTANT =====
    const calculateMontant = (heures, minutes, tarif) => {
        if (!heures && heures !== 0) heures = 0;
        if (!minutes && minutes !== 0) minutes = 0;
        if (!tarif) return '';

        const totalHeures = parseFloat(heures) + (parseFloat(minutes) / 60);
        const montant = (totalHeures * parseFloat(tarif)).toFixed(2);
        return montant;
    };

    const updateMissionAndCalculate = (updates) => {
        const updated = { ...newMission, ...updates };
        const montant = calculateMontant(updated.duree_heures, updated.duree_minutes, updated.tarif_horaire);
        setNewMission({ ...updated, montant_ttc: montant });
    };

    // ===== ÉDITION CLIENTS =====
    const startEditingClient = (client) => {
        setEditingClient(client.id);
        setEditFormData({...client});
    };

    const cancelEditingClient = () => {
        setEditingClient(null);
        setEditFormData({});
    };

    const saveClientChanges = async () => {
        try {
            const { error } = await supabase
                .from('clients')
                .update(editFormData)
                .eq('id', editingClient);

            if (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la modification');
            } else {
                setEditingClient(null);
                setEditFormData({});
                loadClients();
                alert('✅ Client modifié avec succès !');
            }
        } catch (err) {
            console.error('Erreur:', err);
        }
    };

    // ===== ÉDITION INTERVENANTS =====
    const startEditingIntervenant = (intervenant) => {
        setEditingIntervenant(intervenant.id);
        setEditFormData({...intervenant});
    };

    const cancelEditingIntervenant = () => {
        setEditingIntervenant(null);
        setEditFormData({});
    };

    const saveIntervenantChanges = async () => {
        try {
            const { error } = await supabase
                .from('intervenants')
                .update(editFormData)
                .eq('id', editingIntervenant);

            if (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la modification');
            } else {
                setEditingIntervenant(null);
                setEditFormData({});
                loadIntervenants();
                alert('✅ Intervenante modifiée avec succès !');
            }
        } catch (err) {
            console.error('Erreur:', err);
        }
    };

    // ===== ÉDITION MISSIONS =====
    const startEditingMission = (mission) => {
        setEditingMission(mission.id);
        setEditFormData({...mission});
    };

    const cancelEditingMission = () => {
        setEditingMission(null);
        setEditFormData({});
    };

    const saveMissionChanges = async () => {
        try {
            const { error } = await supabase
                .from('missions')
                .update(editFormData)
                .eq('id', editingMission);

            if (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la modification');
            } else {
                setEditingMission(null);
                setEditFormData({});
                loadMissions();
                alert('✅ Mission modifiée avec succès !');
            }
        } catch (err) {
            console.error('Erreur:', err);
        }
    };

    // ===== MISSIONS =====
    const handleCreateMission = async (e) => {
        e.preventDefault();

        if (!newMission.client_id || !newMission.service || !newMission.date_mission) {
            alert('Veuillez remplir les champs obligatoires !');
            return;
        }

        try {
            const { error } = await supabase
                .from('missions')
                .insert([newMission]);

            if (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la création de la mission');
            } else {
                setNewMission({
                    client_id: '',
                    intervenant_id: '',
                    service: '',
                    date_mission: '',
                    heure_debut: '',
                    heure_fin: '',
                    description: '',
                    moyen_paiement: '',
                    duree_heures: '',
                    duree_minutes: '',
                    tarif_horaire: '',
                    montant_ttc: ''
                });
                loadMissions();
                alert('✅ Mission créée avec succès !');
            }
        } catch (err) {
            console.error('Erreur:', err);
        }
    };

    const updateMissionStatus = async (missionId, newStatus) => {
        try {
            const { error } = await supabase
                .from('missions')
                .update({ status: newStatus })
                .eq('id', missionId);

            if (error) console.error('Erreur:', error);
            else loadMissions();
        } catch (err) {
            console.error('Erreur:', err);
        }
    };

    const deleteIntervenant = async (intervenantId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette intervenante ?')) {
            try {
                const { error } = await supabase
                    .from('intervenants')
                    .delete()
                    .eq('id', intervenantId);

                if (error) console.error('Erreur:', error);
                else loadIntervenants();
            } catch (err) {
                console.error('Erreur:', err);
            }
        }
    };

    const deleteClient = async (clientId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
            try {
                const { error } = await supabase
                    .from('clients')
                    .delete()
                    .eq('id', clientId);

                if (error) console.error('Erreur:', error);
                else loadClients();
            } catch (err) {
                console.error('Erreur:', err);
            }
        }
    };

    const deleteMission = async (missionId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) {
            try {
                const { error } = await supabase
                    .from('missions')
                    .delete()
                    .eq('id', missionId);

                if (error) console.error('Erreur:', error);
                else loadMissions();
            } catch (err) {
                console.error('Erreur:', err);
            }
        }
    };

    const getClientName = (clientId) => {
        const client = clients.find(c => c.id === clientId);
        return client ? client.name : 'Inconnu';
    };

    const getIntervenantName = (intervenantId) => {
        const intervenant = intervenants.find(i => i.id === intervenantId);
        return intervenant ? intervenant.name : 'Non assignée';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'en_attente':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmée':
                return 'bg-blue-100 text-blue-800';
            case 'en_cours':
                return 'bg-purple-100 text-purple-800';
            case 'terminée':
                return 'bg-green-100 text-green-800';
            case 'annulée':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'en_attente':
                return '⏳ En attente';
            case 'confirmée':
                return '✅ Confirmée';
            case 'en_cours':
                return '🔄 En cours';
            case 'terminée':
                return '🎉 Terminée';
            case 'annulée':
                return '❌ Annulée';
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
            <nav className="bg-white border-b overflow-x-auto">
                <div className="max-w-7xl mx-auto px-4 flex gap-8">
                    <button
                        onClick={() => setActiveTab('accueil')}
                        className={`py-4 px-2 border-b-2 transition whitespace-nowrap ${
                            activeTab === 'accueil'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <Home className="inline mr-2" size={20} />
                        Accueil
                    </button>
                    <button
                        onClick={() => setActiveTab('missions')}
                        className={`py-4 px-2 border-b-2 transition whitespace-nowrap ${
                            activeTab === 'missions'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <Calendar className="inline mr-2" size={20} />
                        Missions ({missions.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('intervenantes')}
                        className={`py-4 px-2 border-b-2 transition whitespace-nowrap ${
                            activeTab === 'intervenantes'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <Users className="inline mr-2" size={20} />
                        Intervenantes ({intervenants.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={`py-4 px-2 border-b-2 transition whitespace-nowrap ${
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
                        className={`py-4 px-2 border-b-2 transition whitespace-nowrap ${
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
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <p className="text-gray-600">Intervenantes</p>
                            <p className="text-4xl font-bold text-purple-600">{intervenants.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <p className="text-gray-600">Clients inscrits</p>
                            <p className="text-4xl font-bold text-blue-600">{clients.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <p className="text-gray-600">Missions totales</p>
                            <p className="text-4xl font-bold text-green-600">{missions.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <p className="text-gray-600">Missions en cours</p>
                            <p className="text-4xl font-bold text-orange-600">
                                {missions.filter(m => m.status === 'en_cours').length}
                            </p>
                        </div>
                    </div>
                )}

                {/* TAB: Missions */}
                {activeTab === 'missions' && (
                    <div className="space-y-8">
                        {/* Bouton Archiver */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => setArchiveModalOpen(true)}
                                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition"
                            >
                                <Archive className="w-5 h-5" />
                                Archiver Missions
                            </button>
                        </div>

                        {/* Créer une nouvelle mission */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Plus size={24} />
                                Créer une nouvelle mission
                            </h2>
                            <form onSubmit={handleCreateMission} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">👤 Client *</label>
                                        <select
                                            value={newMission.client_id}
                                            onChange={(e) => setNewMission({...newMission, client_id: e.target.value})}
                                            required
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                        >
                                            <option value="">Sélectionner un client</option>
                                            {clients.map(client => (
                                                <option key={client.id} value={client.id}>
                                                    {client.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">👩‍💼 Intervenant (optionnel)</label>
                                        <select
                                            value={newMission.intervenant_id}
                                            onChange={(e) => setNewMission({...newMission, intervenant_id: e.target.value})}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                        >
                                            <option value="">Non assignée</option>
                                            {intervenants.map(intervenant => (
                                                <option key={intervenant.id} value={intervenant.id}>
                                                    {intervenant.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">🛎️ Service *</label>
                                        <select
                                            value={newMission.service}
                                            onChange={(e) => setNewMission({...newMission, service: e.target.value})}
                                            required
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                        >
                                            <option value="">Sélectionner un service</option>
                                            <option value="Ménage">🧹 Ménage</option>
                                            <option value="Repassage">👕 Repassage</option>
                                            <option value="Courses">🛒 Courses</option>
                                            <option value="Diététique">🥗 Diététique</option>
                                            <option value="Aide au repas">🍽️ Aide au repas</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">💳 Moyen de paiement *</label>
                                        <select
                                            value={newMission.moyen_paiement}
                                            onChange={(e) => setNewMission({...newMission, moyen_paiement: e.target.value})}
                                            required
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                        >
                                            <option value="">Sélectionner un moyen de paiement</option>
                                            <option value="Carte bancaire">💳 Carte bancaire</option>
                                            <option value="Virement bancaire">🏦 Virement bancaire</option>
                                            <option value="PayPal">💰 PayPal</option>
                                            <option value="Chèques services">🎫 Chèques services</option>
                                            <option value="Chèque">✅ Chèque</option>
                                            <option value="Espèces">💵 Espèces</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">📅 Date *</label>
                                        <input
                                            type="date"
                                            value={newMission.date_mission}
                                            onChange={(e) => setNewMission({...newMission, date_mission: e.target.value})}
                                            required
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">🕐 Heure début</label>
                                        <input
                                            type="time"
                                            value={newMission.heure_debut}
                                            onChange={(e) => setNewMission({...newMission, heure_debut: e.target.value})}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">🕐 Heure fin</label>
                                        <input
                                            type="time"
                                            value={newMission.heure_fin}
                                            onChange={(e) => setNewMission({...newMission, heure_fin: e.target.value})}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">⏱️ Durée Heures</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={newMission.duree_heures}
                                            onChange={(e) => updateMissionAndCalculate({duree_heures: e.target.value})}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                            placeholder="ex: 1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">⏱️ Durée Minutes (0-59)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={newMission.duree_minutes}
                                            onChange={(e) => updateMissionAndCalculate({duree_minutes: e.target.value})}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                            placeholder="ex: 25"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">💰 Tarif horaire (€/h)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={newMission.tarif_horaire}
                                            onChange={(e) => updateMissionAndCalculate({tarif_horaire: e.target.value})}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                                            placeholder="ex: 15.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">💵 Montant TTC (€) - Auto-calculé</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={newMission.montant_ttc}
                                            onChange={(e) => setNewMission({...newMission, montant_ttc: e.target.value})}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none bg-gray-50"
                                            placeholder="Auto-calculé"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">📝 Description</label>
                                    <textarea
                                        value={newMission.description}
                                        onChange={(e) => setNewMission({...newMission, description: e.target.value})}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none h-20"
                                        placeholder="Détails de la mission..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
                                >
                                    ➕ Créer la mission
                                </button>
                            </form>
                        </div>

                        {/* Liste des missions */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Liste des missions</h2>

                            {loadingMissions ? (
                                <p className="text-gray-500">Chargement des missions...</p>
                            ) : missions.length === 0 ? (
                                <p className="text-gray-500">Aucune mission créée pour le moment.</p>
                            ) : (
                                <div className="space-y-4">
                                    {missions.map((mission) => (
                                        <div key={mission.id} className="border-2 border-gray-300 rounded-lg p-6 hover:shadow-lg transition">
                                            {editingMission === mission.id ? (
                                                // Mode édition
                                                <div className="space-y-4">
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-gray-700 font-bold mb-2">Client</label>
                                                            <select
                                                                value={editFormData.client_id || ''}
                                                                onChange={(e) => setEditFormData({...editFormData, client_id: e.target.value})}
                                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                            >
                                                                {clients.map(client => (
                                                                    <option key={client.id} value={client.id}>{client.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-gray-700 font-bold mb-2">Intervenant</label>
                                                            <select
                                                                value={editFormData.intervenant_id || ''}
                                                                onChange={(e) => setEditFormData({...editFormData, intervenant_id: e.target.value})}
                                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                            >
                                                                <option value="">Non assignée</option>
                                                                {intervenants.map(intervenant => (
                                                                    <option key={intervenant.id} value={intervenant.id}>{intervenant.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-gray-700 font-bold mb-2">Service</label>
                                                            <select
                                                                value={editFormData.service || ''}
                                                                onChange={(e) => setEditFormData({...editFormData, service: e.target.value})}
                                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                            >
                                                                <option value="Ménage">🧹 Ménage</option>
                                                                <option value="Repassage">👕 Repassage</option>
                                                                <option value="Courses">🛒 Courses</option>
                                                                <option value="Diététique">🥗 Diététique</option>
                                                                <option value="Aide au repas">🍽️ Aide au repas</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-gray-700 font-bold mb-2">Date</label>
                                                            <input
                                                                type="date"
                                                                value={editFormData.date_mission || ''}
                                                                onChange={(e) => setEditFormData({...editFormData, date_mission: e.target.value})}
                                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-gray-700 font-bold mb-2">Heure début</label>
                                                            <input
                                                                type="time"
                                                                value={editFormData.heure_debut || ''}
                                                                onChange={(e) => setEditFormData({...editFormData, heure_debut: e.target.value})}
                                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-gray-700 font-bold mb-2">Heure fin</label>
                                                            <input
                                                                type="time"
                                                                value={editFormData.heure_fin || ''}
                                                                onChange={(e) => setEditFormData({...editFormData, heure_fin: e.target.value})}
                                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-gray-700 font-bold mb-2">Moyen de paiement</label>
                                                            <select
                                                                value={editFormData.moyen_paiement || ''}
                                                                onChange={(e) => setEditFormData({...editFormData, moyen_paiement: e.target.value})}
                                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                            >
                                                                <option value="">Sélectionner</option>
                                                                <option value="Carte bancaire">💳 Carte bancaire</option>
                                                                <option value="Virement bancaire">🏦 Virement bancaire</option>
                                                                <option value="PayPal">💰 PayPal</option>
                                                                <option value="Chèques services">🎫 Chèques services</option>
                                                                <option value="Chèque">✅ Chèque</option>
                                                                <option value="Espèces">💵 Espèces</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-gray-700 font-bold mb-2">Montant TTC (€)</label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={editFormData.montant_ttc || ''}
                                                                onChange={(e) => setEditFormData({...editFormData, montant_ttc: e.target.value})}
                                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-700 font-bold mb-2">Description</label>
                                                        <textarea
                                                            value={editFormData.description || ''}
                                                            onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg h-20"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={saveMissionChanges}
                                                            className="flex-1 bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition"
                                                        >
                                                            ✅ Sauvegarder
                                                        </button>
                                                        <button
                                                            onClick={cancelEditingMission}
                                                            className="flex-1 bg-gray-400 text-white font-bold py-2 rounded-lg hover:bg-gray-500 transition"
                                                        >
                                                            ❌ Annuler
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // Mode affichage
                                                <>
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500">👤 Client :</p>
                                                            <p className="font-bold text-lg">{getClientName(mission.client_id)}</p>

                                                            <p className="text-sm text-gray-500 mt-3">👩‍💼 Intervenant :</p>
                                                            <p className="font-bold">{getIntervenantName(mission.intervenant_id)}</p>

                                                            <p className="text-sm text-gray-500 mt-3">🛎️ Service :</p>
                                                            <p className="font-bold">{mission.service}</p>

                                                            <p className="text-sm text-gray-500 mt-3">📅 Date :</p>
                                                            <p className="font-bold">{new Date(mission.date_mission).toLocaleDateString('fr-FR')}</p>

                                                            {mission.heure_debut && (
                                                                <>
                                                                    <p className="text-sm text-gray-500 mt-3">🕐 Horaire :</p>
                                                                    <p className="font-bold">{mission.heure_debut} - {mission.heure_fin}</p>
                                                                </>
                                                            )}

                                                            {mission.moyen_paiement && (
                                                                <>
                                                                    <p className="text-sm text-gray-500 mt-3">💳 Moyen de paiement :</p>
                                                                    <p className="font-bold">{mission.moyen_paiement}</p>
                                                                </>
                                                            )}

                                                            {mission.montant_ttc && (
                                                                <>
                                                                    <p className="text-sm text-gray-500 mt-3">💰 Montant :</p>
                                                                    <p className="font-bold text-green-600">{mission.montant_ttc}€ TTC</p>
                                                                </>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-col justify-between">
                                                            <div>
                                                                <p className="font-bold text-gray-700 mb-2">Statut :</p>
                                                                <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${getStatusColor(mission.status)}`}>
                                                                    {getStatusLabel(mission.status)}
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-wrap gap-2 mt-4">
                                                                <button
                                                                    onClick={() => updateMissionStatus(mission.id, 'en_attente')}
                                                                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                                                                        mission.status === 'en_attente'
                                                                            ? 'bg-yellow-500 text-white'
                                                                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                                    }`}
                                                                >
                                                                    ⏳ Attente
                                                                </button>
                                                                <button
                                                                    onClick={() => updateMissionStatus(mission.id, 'confirmée')}
                                                                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                                                                        mission.status === 'confirmée'
                                                                            ? 'bg-blue-500 text-white'
                                                                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                                                    }`}
                                                                >
                                                                    ✅ Confirmée
                                                                </button>
                                                                <button
                                                                    onClick={() => updateMissionStatus(mission.id, 'en_cours')}
                                                                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                                                                        mission.status === 'en_cours'
                                                                            ? 'bg-purple-500 text-white'
                                                                            : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                                                    }`}
                                                                >
                                                                    🔄 En cours
                                                                </button>
                                                                <button
                                                                    onClick={() => updateMissionStatus(mission.id, 'terminée')}
                                                                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                                                                        mission.status === 'terminée'
                                                                            ? 'bg-green-500 text-white'
                                                                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                    }`}
                                                                >
                                                                    🎉 Terminée
                                                                </button>
                                                                <button
                                                                    onClick={() => updateMissionStatus(mission.id, 'annulée')}
                                                                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                                                                        mission.status === 'annulée'
                                                                            ? 'bg-red-500 text-white'
                                                                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                                    }`}
                                                                >
                                                                    ❌ Annulée
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="border-t pt-4 mt-4 flex gap-2">
                                                        <button
                                                            onClick={() => startEditingMission(mission)}
                                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium flex-1"
                                                        >
                                                            <Edit2 size={18} />
                                                            Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => deleteMission(mission.id)}
                                                            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium flex-1"
                                                        >
                                                            <Trash2 size={18} />
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: Intervenantes */}
                {activeTab === 'intervenantes' && (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestion des intervenantes</h2>

                        {loadingIntervenants ? (
                            <p className="text-gray-500">Chargement...</p>
                        ) : intervenants.length === 0 ? (
                            <p className="text-gray-500">Aucune intervenante.</p>
                        ) : (
                            <div className="space-y-4">
                                {intervenants.map((intervenant) => (
                                    <div key={intervenant.id} className="border-2 border-gray-300 rounded-lg p-6">
                                        {editingIntervenant === intervenant.id ? (
                                            // Mode édition
                                            <div className="space-y-4">
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-gray-700 font-bold mb-2">Nom</label>
                                                        <input
                                                            type="text"
                                                            value={editFormData.name || ''}
                                                            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-700 font-bold mb-2">Email</label>
                                                        <input
                                                            type="email"
                                                            value={editFormData.email || ''}
                                                            onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-700 font-bold mb-2">Téléphone</label>
                                                        <input
                                                            type="tel"
                                                            value={editFormData.phone || ''}
                                                            onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={saveIntervenantChanges}
                                                        className="flex-1 bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition"
                                                    >
                                                        ✅ Sauvegarder
                                                    </button>
                                                    <button
                                                        onClick={cancelEditingIntervenant}
                                                        className="flex-1 bg-gray-400 text-white font-bold py-2 rounded-lg hover:bg-gray-500 transition"
                                                    >
                                                        ❌ Annuler
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Mode affichage
                                            <>
                                                <p className="font-bold text-lg">{intervenant.name}</p>
                                                <p className="text-gray-600">📧 {intervenant.email}</p>
                                                <p className="text-gray-600">📱 {intervenant.phone}</p>
                                                <div className="flex gap-2 mt-4">
                                                    <button
                                                        onClick={() => startEditingIntervenant(intervenant)}
                                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        <Edit2 size={18} />
                                                        Modifier
                                                    </button>
                                                    <button
                                                        onClick={() => deleteIntervenant(intervenant.id)}
                                                        className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
                                                    >
                                                        <Trash2 size={18} />
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: Clients */}
                {activeTab === 'clients' && (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestion des clients</h2>

                        {loadingClients ? (
                            <p className="text-gray-500">Chargement...</p>
                        ) : clients.length === 0 ? (
                            <p className="text-gray-500">Aucun client.</p>
                        ) : (
                            <div className="space-y-4">
                                {clients.map((client) => (
                                    <div key={client.id} className="border-2 border-gray-300 rounded-lg p-6">
                                        {editingClient === client.id ? (
                                            // Mode édition
                                            <div className="space-y-4">
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-gray-700 font-bold mb-2">Nom</label>
                                                        <input
                                                            type="text"
                                                            value={editFormData.name || ''}
                                                            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-700 font-bold mb-2">Email</label>
                                                        <input
                                                            type="email"
                                                            value={editFormData.email || ''}
                                                            onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-700 font-bold mb-2">Téléphone</label>
                                                        <input
                                                            type="tel"
                                                            value={editFormData.phone || ''}
                                                            onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-700 font-bold mb-2">Adresse</label>
                                                        <input
                                                            type="text"
                                                            value={editFormData.address || ''}
                                                            onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-700 font-bold mb-2">Superficie (m²)</label>
                                                        <input
                                                            type="text"
                                                            value={editFormData.superficie || ''}
                                                            onChange={(e) => setEditFormData({...editFormData, superficie: e.target.value})}
                                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                            placeholder="ex: 80 m²"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-700 font-bold mb-2">Nombre de pièces</label>
                                                        <input
                                                            type="text"
                                                            value={editFormData.nombre_pieces || ''}
                                                            onChange={(e) => setEditFormData({...editFormData, nombre_pieces: e.target.value})}
                                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                                            placeholder="ex: 4 pièces"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-bold mb-2">Souhaits / Préférences (max 200 caractères)</label>
                                                    <textarea
                                                        value={editFormData.souhaits || ''}
                                                        onChange={(e) => setEditFormData({...editFormData, souhaits: e.target.value.slice(0, 200)})}
                                                        maxLength="200"
                                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg h-20"
                                                        placeholder="Vos souhaits, préférences, doléances..."
                                                    />
                                                    <p className="text-sm text-gray-500 mt-1">{(editFormData.souhaits || '').length}/200</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={saveClientChanges}
                                                        className="flex-1 bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition"
                                                    >
                                                        ✅ Sauvegarder
                                                    </button>
                                                    <button
                                                        onClick={cancelEditingClient}
                                                        className="flex-1 bg-gray-400 text-white font-bold py-2 rounded-lg hover:bg-gray-500 transition"
                                                    >
                                                        ❌ Annuler
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Mode affichage
                                            <>
                                                <p className="font-bold text-lg">{client.name}</p>
                                                <p className="text-gray-600">📧 {client.email}</p>
                                                <p className="text-gray-600">📱 {client.phone}</p>
                                                <p className="text-gray-600">📍 {client.address}</p>
                                                {client.superficie && <p className="text-gray-600">📐 {client.superficie}</p>}
                                                {client.nombre_pieces && <p className="text-gray-600">🏠 {client.nombre_pieces}</p>}
                                                {client.souhaits && <p className="text-gray-600 mt-2"><strong>Souhaits:</strong> {client.souhaits}</p>}
                                                <div className="flex gap-2 mt-4">
                                                    <button
                                                        onClick={() => startEditingClient(client)}
                                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        <Edit2 size={18} />
                                                        Modifier
                                                    </button>
                                                    <button
                                                        onClick={() => deleteClient(client.id)}
                                                        className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
                                                    >
                                                        <Trash2 size={18} />
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </>
                                        )}
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
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Email de contact</label>
                                <input
                                    type="email"
                                    placeholder="contact@pantoufles.fr"
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                                />
                            </div>
                            <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                                💾 Sauvegarder
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Modal Archiver */}
            <ArchiveMissionsModal
                isOpen={archiveModalOpen}
                onClose={() => setArchiveModalOpen(false)}
                onSuccess={() => {
                    loadMissions();
                }}
            />
        </div>
    );
}

export default AdminDashboard;
