import React, { useState, useEffect } from 'react';
import { MapPin, Loader } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function IntervenantMap({ intervenants, clients }) {
    const [selectedIntervenant, setSelectedIntervenant] = useState('');
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [geocodeCache, setGeocodeCache] = useState({});

    // Adresse HQ PANTOUFLES
    const PANTOUFLES_HQ = {
        address: '46 rue ste Claire 87000 limoges',
        name: 'PANTOUFLES HQ'
    };

    // Formule Haversine pour calculer distance à vol d'oiseau
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Rayon terre en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(2);
    };

    // Géocoder une adresse via Nominatim (gratuit)
    const geocodeAddress = async (address) => {
        // Vérifier le cache
        if (geocodeCache[address]) {
            return geocodeCache[address];
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
                {
                    headers: {
                        'User-Agent': 'PANTOUFLES-App (contact@pantoufles.fr)'
                    }
                }
            );
            const data = await response.json();

            console.log('📍 Nominatim response for:', address, data);

            if (data && data.length > 0) {
                const addressData = data[0].address || {};
                console.log('📍 Address data:', addressData);

                const result = {
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon),
                    commune: addressData.city || addressData.town || addressData.village || 'N/A',
                    code_postal: addressData.postcode || 'N/A'
                };

                console.log('📍 Parsed result:', result);

                // Sauvegarder en cache
                setGeocodeCache(prev => ({
                    ...prev,
                    [address]: result
                }));

                return result;
            }
        } catch (err) {
            console.error('Erreur géocodage:', err);
        }

        return null;
    };

    // Charger les missions de l'intervenante sélectionnée
    const loadMissions = async () => {
        if (!selectedIntervenant) {
            setMissions([]);
            return;
        }

        setLoading(true);
        try {
            // Récupérer les missions actives de l'intervenante
            const { data, error } = await supabase
                .from('missions')
                .select('*')
                .eq('intervenant_id', selectedIntervenant)
                .in('status', ['en_attente', 'confirmée', 'en_cours', 'terminée']);

            if (error) throw error;

            // Récupérer l'intervenante
            const intervenant = intervenants.find(i => i.id === selectedIntervenant);

            // Géocoder les adresses et calculer les distances
            const missionsAvecDistances = [];

            for (const mission of data) {
                const client = clients.find(c => c.id === mission.client_id);
                if (!client) continue;

                // Géocoder adresse client
                const clientCoords = await geocodeAddress(client.address);
                if (!clientCoords) continue;

                // Géocoder adresse PANTOUFLES
                const pantouflesCoords = await geocodeAddress(PANTOUFLES_HQ.address);

                // Géocoder adresse intervenante
                const intervenantCoords = intervenant?.address
                    ? await geocodeAddress(intervenant.address)
                    : null;

                // Calculer distances
                const distancePantouffles = pantouflesCoords
                    ? calculateDistance(
                        pantouflesCoords.lat,
                        pantouflesCoords.lon,
                        clientCoords.lat,
                        clientCoords.lon
                    )
                    : 'N/A';

                const distanceIntervenant = intervenantCoords
                    ? calculateDistance(
                        intervenantCoords.lat,
                        intervenantCoords.lon,
                        clientCoords.lat,
                        clientCoords.lon
                    )
                    : 'N/A';

                missionsAvecDistances.push({
                    id: mission.id,
                    client_name: client.name,
                    client_address: client.address,
                    commune: clientCoords.commune,
                    code_postal: clientCoords.code_postal,
                    service: mission.service,
                    date_mission: mission.date_mission,
                    distance_pantoufles: distancePantouffles,
                    distance_intervenant: distanceIntervenant,
                    status: mission.status
                });
            }

            setMissions(missionsAvecDistances);
        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMissions();
    }, [selectedIntervenant]);

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
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <MapPin size={32} />
                    <h1 className="text-3xl font-bold">Carte des Missions</h1>
                </div>
                <p className="text-blue-100">Visualisez les clients et optimisez les trajets</p>
            </div>

            {/* Filtres */}
            <div className="bg-white p-6 rounded-lg shadow">
                <label className="block text-gray-700 font-bold mb-3">👩‍💼 Sélectionner une intervenante</label>
                <select
                    value={selectedIntervenant}
                    onChange={(e) => setSelectedIntervenant(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                >
                    <option value="">-- Toutes les intervenantes --</option>
                    {intervenants.map(intervenant => (
                        <option key={intervenant.id} value={intervenant.id}>
                            {intervenant.name} ({intervenant.secteur_intervention || 'Non défini'})
                        </option>
                    ))}
                </select>
            </div>

            {/* Tableau */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {selectedIntervenant
                        ? `Missions - ${intervenants.find(i => i.id === selectedIntervenant)?.name}`
                        : 'Sélectionnez une intervenante'}
                </h2>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader className="animate-spin text-purple-600" size={32} />
                        <span className="ml-2 text-gray-600">Calcul des distances...</span>
                    </div>
                ) : missions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Aucune mission trouvée</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Client</th>
                                <th className="px-4 py-2 text-left">Service</th>
                                <th className="px-4 py-2 text-left">Date</th>
                                <th className="px-4 py-2 text-right">📍 PANTOUFLES→Client</th>
                                <th className="px-4 py-2 text-right">📍 Intervenante→Client</th>
                                <th className="px-4 py-2 text-center">Statut</th>
                            </tr>
                            </thead>
                            <tbody>
                            {missions.map((mission) => (
                                <tr key={mission.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2 font-medium">{mission.client_name}</td>
                                    <td className="px-4 py-2">{mission.service}</td>
                                    <td className="px-4 py-2">
                                        {new Date(mission.date_mission).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-4 py-2 text-right font-bold text-blue-600">
                                        {mission.distance_pantoufles} km
                                    </td>
                                    <td className="px-4 py-2 text-right font-bold text-green-600">
                                        {mission.distance_intervenant} km
                                    </td>
                                    <td className="px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(mission.status)}`}>
                        {mission.status}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Stats */}
                {missions.length > 0 && (
                    <div className="mt-6 grid md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-blue-600 text-sm font-bold">Total missions</p>
                            <p className="text-2xl font-bold text-blue-700">{missions.length}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-green-600 text-sm font-bold">Distance moy (HQ→Client)</p>
                            <p className="text-2xl font-bold text-green-700">
                                {(missions.reduce((sum, m) => sum + parseFloat(m.distance_pantoufles || 0), 0) / missions.length).toFixed(2)} km
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-purple-600 text-sm font-bold">Distance moy (Intervenante→Client)</p>
                            <p className="text-2xl font-bold text-purple-700">
                                {(missions.reduce((sum, m) => sum + parseFloat(m.distance_intervenant || 0), 0) / missions.length).toFixed(2)} km
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}