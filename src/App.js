import React, { useState } from 'react';
import './App.css';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import IntervenantsForm from './pages/IntervenantsForm';

function App() {
    const [currentPage, setCurrentPage] = useState('landing');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = (password) => {
        if (password === 'pantoufles2024') {
            setIsLoggedIn(true);
            setCurrentPage('dashboard');
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentPage('landing');
    };

    return (
        <div className="App">
            {currentPage === 'landing' && <LandingPage setCurrentPage={setCurrentPage} />}
            {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} onLogin={handleLogin} />}
            {currentPage === 'dashboard' && isLoggedIn && <AdminDashboard onLogout={handleLogout} />}
            {currentPage === 'intervenants' && <IntervenantsForm setCurrentPage={setCurrentPage} />}
        </div>
    );
}

export default App;