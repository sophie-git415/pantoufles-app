import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

function MapSection() {
    const [mapsKey, setMapsKey] = useState(null);
    const [error, setError] = useState(null);
    const mapRef = React.useRef(null);

    useEffect(() => {
        // Récupérer la clé Google Maps depuis le backend
        const fetchMapsKey = async () => {
            try {
                const response = await fetch('http://localhost:5003/api/maps-key');
                const data = await response.json();

                if (data.success) {
                    setMapsKey(data.mapsKey);
                } else {
                    setError('Impossible de charger la carte');
                }
            } catch (err) {
                console.error('Erreur:', err);
                setError('Erreur de connexion au serveur');
            }
        };

        fetchMapsKey();
    }, []);

    useEffect(() => {
        if (!mapsKey || !mapRef.current) return;

        // Charger la librairie Google Maps
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsKey}&language=fr`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            // Coordonnées de Limoges
            const limogesCenter = { lat: 45.8355, lng: 1.2622 };

            const map = new window.google.maps.Map(mapRef.current, {
                zoom: 12,
                center: limogesCenter,
                mapTypeControl: true,
                fullscreenControl: true,
                zoomControl: true,
                streetViewControl: false
            });

            // Marqueur principal Limoges
            new window.google.maps.Marker({
                position: limogesCenter,
                map: map,
                title: 'PANTOUFLES - Limoges',
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });

            // Cercle pour montrer la zone de service
            new window.google.maps.Circle({
                center: limogesCenter,
                radius: 15000, // 15km
                map: map,
                fillColor: '#9333ea',
                fillOpacity: 0.1,
                strokeColor: '#9333ea',
                strokeOpacity: 0.3,
                strokeWeight: 2
            });

            // Info window
            const infoWindow = new window.google.maps.InfoWindow({
                content: `
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 10px 0; color: #333;">🩴 PANTOUFLES</h3>
            <p style="margin: 5px 0; color: #666;">Service Adhoc</p>
            <p style="margin: 5px 0; font-size: 12px; color: #999;">Zone de service : Limoges et alentours (15km)</p>
          </div>
        `
            });

            new window.google.maps.Marker({
                position: limogesCenter,
                map: map,
                title: 'PANTOUFLES'
            }).addListener('click', () => {
                infoWindow.open(map);
            });
        };

        script.onerror = () => {
            setError('Impossible de charger Google Maps');
        };

        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, [mapsKey]);

    if (error) {
        return (
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
                        <MapPin className="inline mr-3" size={32} />
                        Notre zone de service
                    </h2>
                    <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-2xl text-center">
                        ❌ {error}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
                    <MapPin className="inline mr-3" size={32} />
                    Notre zone de service
                </h2>

                <div className="rounded-2xl shadow-lg overflow-hidden border-4 border-purple-200">
                    <div
                        ref={mapRef}
                        style={{
                            width: '100%',
                            height: '500px',
                            backgroundColor: '#e5e7eb'
                        }}
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <div className="text-4xl mb-3">📍</div>
                        <h3 className="font-bold text-gray-800 mb-2">Limoges</h3>
                        <p className="text-gray-600">Centre-ville et proche banlieue</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <div className="text-4xl mb-3">🗺️</div>
                        <h3 className="font-bold text-gray-800 mb-2">15km</h3>
                        <p className="text-gray-600">Rayon de couverture maximum</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <div className="text-4xl mb-3">🚗</div>
                        <h3 className="font-bold text-gray-800 mb-2">Rapide</h3>
                        <p className="text-gray-600">Intervention en moins de 24h</p>
                    </div>
                </div>

                <div className="mt-12 bg-purple-50 p-8 rounded-2xl border-2 border-purple-200 text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        Vous êtes hors de notre zone ?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Contactez-nous quand même ! Nous étudions chaque demande.
                    </p>
                    <button className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition">
                        📞 Nous contacter
                    </button>
                </div>
            </div>
        </section>
    );
}

export default MapSection;