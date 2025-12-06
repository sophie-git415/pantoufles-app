import React, { useState } from 'react';
import { Calendar, Archive, AlertCircle } from 'lucide-react';
import { archiveMissionsOfMonth } from '../utils/archiveService';

export default function ArchiveMissionsModal({ isOpen, onClose, onSuccess }) {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
    ];

    const handleArchive = async () => {
        setLoading(true);
        setMessage('');

        const result = await archiveMissionsOfMonth(selectedYear, selectedMonth + 1);
        setMessage(result.message);

        if (result.success && result.archivedCount > 0) {
            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 1500);
        }

        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Archive className="w-6 h-6 text-orange-500" />
                    <h2 className="text-2xl font-bold text-gray-800">Archiver Missions</h2>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-700">
                        Archiver les missions <strong>complétées</strong> de ce mois.
                        Les données seront conservées dans l'historique.
                    </p>
                </div>

                {/* Date Selection */}
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Année
                        </label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            {[2024, 2025, 2026].map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mois
                        </label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            {monthNames.map((month, idx) => (
                                <option key={idx} value={idx}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div
                        className={`p-3 rounded-lg mb-6 text-sm font-medium ${
                            message.includes('✅')
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                    >
                        {message}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleArchive}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                Archivage...
                            </>
                        ) : (
                            <>
                                <Calendar className="w-4 h-4" />
                                Archiver
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}