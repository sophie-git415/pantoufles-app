import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

function Login({ setCurrentPage, onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const success = onLogin(password);

            if (success) {
                setPassword('');
            } else {
                setError('Mot de passe incorrect !');
            }
        } catch (err) {
            setError('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Bouton retour */}
                <button
                    onClick={() => setCurrentPage('landing')}
                    className="flex items-center gap-2 text-white hover:text-gray-200 font-medium mb-8"
                >
                    <ArrowLeft size={20} />
                    Retour
                </button>

                {/* Card de login */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">🩴</div>
                        <h1 className="text-3xl font-bold text-gray-800">PANTOUFLES</h1>
                        <p className="text-gray-600 mt-2">Accès administrateur</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center font-semibold">
                            ❌ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-3">🔐 Mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200 text-lg"
                                placeholder="Entrez le mot de passe"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 disabled:opacity-50 text-lg"
                        >
                            {loading ? '⏳ Vérification...' : '🔓 Accéder au dashboard'}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 text-sm mt-6">
                        Vous n'êtes pas autorisé ?
                        <button
                            onClick={() => setCurrentPage('landing')}
                            className="text-purple-600 hover:underline ml-1 font-medium"
                        >
                            Retour à l'accueil
                        </button>
                    </p>
                </div>

                {/* Info */}
                <p className="text-white text-center text-sm mt-8 opacity-80">
                    🩴 PANTOUFLES - Service Adhoc © 2024
                </p>
            </div>
        </div>
    );
}

export default Login;