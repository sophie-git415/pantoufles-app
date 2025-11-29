import React, { useState } from 'react';

function Login({ onLoginSuccess, setCurrentPage }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Mot de passe par défaut pour le MVP (à changer en production!)
    const ADMIN_PASSWORD = 'pantoufles2024';

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulation d'une vérification
        setTimeout(() => {
            if (password === ADMIN_PASSWORD) {
                onLoginSuccess();
            } else {
                setError('Mot de passe incorrect');
                setPassword('');
            }
            setLoading(false);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-400px">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🩴</div>
                    <h1 className="text-3xl font-bold text-gray-800">PANTOUFLES</h1>
                    <p className="text-gray-600 text-sm mt-2">Accès Admin</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">
                            Mot de passe admin
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Entrez le mot de passe"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? '⏳ Vérification...' : '🔓 Se connecter'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setCurrentPage('landing')}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                        ← Retour à l'accueil
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-gray-500 text-xs text-center">
                        MVP - Mot de passe par défaut : <code className="bg-gray-100 px-2 py-1 rounded">pantoufles2024</code>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;