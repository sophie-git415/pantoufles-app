import React, { useState, useEffect } from 'react';
import { Calendar, Filter, BarChart3 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import {
    BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function BouleDeCristal({ clients, intervenants }) {
    const [archivedMissions, setArchivedMissions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filtres
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());
    const [filterMonth, setFilterMonth] = useState('');
    const [filterDateDebut, setFilterDateDebut] = useState('');
    const [filterDateFin, setFilterDateFin] = useState('');
    const [filterClient, setFilterClient] = useState('');
    const [filterService, setFilterService] = useState('');
    const [filterIntervenant, setFilterIntervenant] = useState('');

    // Charger les missions archivées au montage et au changement de filtres
    useEffect(() => {
        loadArchivedMissions();
    }, [filterYear, filterMonth, filterDateDebut, filterDateFin, filterClient, filterService, filterIntervenant]);

    const loadArchivedMissions = async () => {
        setLoading(true);
        try {
            let startDate, endDate;

            // Si dates personnalisées remplies, les utiliser
            if (filterDateDebut && filterDateFin) {
                startDate = filterDateDebut;
                endDate = filterDateFin;
            } else if (filterMonth) {
                // Sinon, utiliser mois/année si mois sélectionné
                startDate = `${filterYear}-${String(filterMonth).padStart(2, '0')}-01`;
                endDate = new Date(filterYear, filterMonth, 0).toISOString().split('T')[0];
            } else {
                // Si "Tous les mois", prendre toute l'année
                startDate = `${filterYear}-01-01`;
                endDate = `${filterYear}-12-31`;
            }

            let query = supabase
                .from('missions_archived')
                .select('*')
                .gte('date_mission', startDate)
                .lte('date_mission', endDate);

            if (filterClient) query = query.eq('client_id', filterClient);
            if (filterIntervenant) query = query.eq('intervenant_id', filterIntervenant);
            if (filterService) query = query.eq('service', filterService);

            const { data, error } = await query.order('date_mission', { ascending: false });

            if (error) throw error;
            setArchivedMissions(data || []);
        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    // ===== CALCULS POUR GRAPHIQUES =====

    // 1. CA par service
    const caByService = archivedMissions.reduce((acc, mission) => {
        const existing = acc.find(m => m.service === mission.service);
        const amount = parseFloat(mission.montant_ttc) || 0;
        if (existing) {
            existing.montant += amount;
        } else {
            acc.push({ service: mission.service, montant: amount });
        }
        return acc;
    }, []);

    // 2. CA par intervenant
    const caByIntervenant = archivedMissions.reduce((acc, mission) => {
        if (!mission.intervenant_id) return acc;
        const intervenant = intervenants.find(i => i.id === mission.intervenant_id);
        const name = intervenant ? intervenant.name : 'Non assigné';
        const existing = acc.find(m => m.name === name);
        const amount = parseFloat(mission.montant_ttc) || 0;
        if (existing) {
            existing.montant += amount;
        } else {
            acc.push({ name, montant: amount });
        }
        return acc;
    }, []);

    // 3. Distribution statuts
    const statusDistribution = archivedMissions.reduce((acc, mission) => {
        const existing = acc.find(m => m.status === mission.status);
        if (existing) {
            existing.count += 1;
        } else {
            acc.push({ status: mission.status, count: 1 });
        }
        return acc;
    }, []);

    // 4. Totaux
    const totalCA = archivedMissions.reduce((sum, m) => sum + (parseFloat(m.montant_ttc) || 0), 0);
    const totalMissions = archivedMissions.length;
    const moyenneMission = totalMissions > 0 ? (totalCA / totalMissions).toFixed(2) : 0;

    // Couleurs pour les charts
    const COLORS = ['#f97316', '#8b5cf6', '#3b82f6', '#10b981', '#ec4899', '#f59e0b'];

    const monthNames = [
        '', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    return (
        <div className="space-y-8">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">🔮</span>
                    <h1 className="text-3xl font-bold">Boule de Cristal</h1>
                </div>
                <p className="text-purple-100">Analyse des performances et données archivées</p>
            </div>

            {/* Filtres */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Filter size={20} />
                    Filtres
                </h2>
                <div className="grid md:grid-cols-6 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Année</label>
                        <select
                            value={filterYear}
                            onChange={(e) => setFilterYear(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            {[2024, 2025, 2026].map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Mois</label>
                        <select
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">-- Tous les mois --</option>
                            {monthNames.map((month, idx) => idx > 0 && (
                                <option key={idx} value={idx}>{month}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Du</label>
                        <input
                            type="date"
                            value={filterDateDebut}
                            onChange={(e) => setFilterDateDebut(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Au</label>
                        <input
                            type="date"
                            value={filterDateFin}
                            onChange={(e) => setFilterDateFin(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Service</label>
                        <select
                            value={filterService}
                            onChange={(e) => setFilterService(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">-- Tous --</option>
                            <option value="Ménage">🧹 Ménage</option>
                            <option value="Repassage">👕 Repassage</option>
                            <option value="Courses">🛒 Courses</option>
                            <option value="Diététique">🥗 Diététique</option>
                            <option value="Aide au repas">🍽️ Aide au repas</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Intervenant</label>
                        <select
                            value={filterIntervenant}
                            onChange={(e) => setFilterIntervenant(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">-- Tous --</option>
                            {intervenants.map(intervenant => (
                                <option key={intervenant.id} value={intervenant.id}>{intervenant.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Client</label>
                    <select
                        value={filterClient}
                        onChange={(e) => setFilterClient(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="">-- Tous --</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-600 text-sm font-bold">CA TOTAL</p>
                    <p className="text-3xl font-bold text-green-600">{totalCA.toFixed(2)}€</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-600 text-sm font-bold">MISSIONS</p>
                    <p className="text-3xl font-bold text-blue-600">{totalMissions}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-600 text-sm font-bold">MOYENNE/MISSION</p>
                    <p className="text-3xl font-bold text-purple-600">{moyenneMission}€</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-600 text-sm font-bold">PÉRIODE</p>
                    <p className="text-lg font-bold text-orange-600">
                        {filterMonth ? monthNames[filterMonth] : 'Année complète'} {filterYear}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                    Chargement...
                </div>
            ) : archivedMissions.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                    Aucune mission archivée pour cette période.
                </div>
            ) : (
                <>
                    {/* Graphiques */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* CA par Service */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">CA par Service</h3>
                            {caByService.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={caByService}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="service" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `${value.toFixed(2)}€`} />
                                        <Bar dataKey="montant" fill="#f97316" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-500">Pas de données</p>
                            )}
                        </div>

                        {/* CA par Intervenant */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">CA par Intervenant</h3>
                            {caByIntervenant.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={caByIntervenant}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `${value.toFixed(2)}€`} />
                                        <Bar dataKey="montant" fill="#8b5cf6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-500">Pas de données</p>
                            )}
                        </div>

                        {/* Distribution des Statuts */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Distribution des Statuts</h3>
                            {statusDistribution.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={statusDistribution}
                                            dataKey="count"
                                            nameKey="status"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >
                                            {statusDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-500">Pas de données</p>
                            )}
                        </div>

                        {/* Moyens de paiement */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Moyens de Paiement</h3>
                            <div className="space-y-2">
                                {archivedMissions.reduce((acc, mission) => {
                                    const existing = acc.find(m => m.moyen === mission.moyen_paiement);
                                    if (existing) {
                                        existing.count += 1;
                                    } else {
                                        acc.push({ moyen: mission.moyen_paiement, count: 1 });
                                    }
                                    return acc;
                                }, []).map((item, idx) => (
                                    <div key={idx} className="flex justify-between p-2 border-b">
                                        <span className="font-medium">{item.moyen}</span>
                                        <span className="text-purple-600 font-bold">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tableau détaillé */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Détail des Missions</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Date</th>
                                    <th className="px-4 py-2 text-left">Client</th>
                                    <th className="px-4 py-2 text-left">Intervenant</th>
                                    <th className="px-4 py-2 text-left">Service</th>
                                    <th className="px-4 py-2 text-left">Montant</th>
                                    <th className="px-4 py-2 text-left">Paiement</th>
                                    <th className="px-4 py-2 text-left">Statut</th>
                                </tr>
                                </thead>
                                <tbody>
                                {archivedMissions.map((mission) => (
                                    <tr key={mission.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">
                                            {new Date(mission.date_mission).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-4 py-2">
                                            {clients.find(c => c.id === mission.client_id)?.name || 'N/A'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {intervenants.find(i => i.id === mission.intervenant_id)?.name || 'N/A'}
                                        </td>
                                        <td className="px-4 py-2">{mission.service}</td>
                                        <td className="px-4 py-2 font-bold text-green-600">
                                            {mission.montant_ttc}€
                                        </td>
                                        <td className="px-4 py-2 text-xs">{mission.moyen_paiement}</td>
                                        <td className="px-4 py-2">
                        <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-800">
                          {mission.status}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}