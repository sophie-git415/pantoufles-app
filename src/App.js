import React, { useState } from 'react';
import './App.css';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

function App() {
    const [currentPage, setCurrentPage] = useState('landing');
    const [isAdmin, setIsAdmin] = useState(false);

    const handleAdminLogin = () => {
        setIsAdmin(true);
        setCurrentPage('admin');
    };

    const handleLogout = () => {
        setIsAdmin(false);
        setCurrentPage('landing');
    };

    return (
        <div className="App">
            {!isAdmin && currentPage === 'landing' && (
                <LandingPage setCurrentPage={setCurrentPage} />
            )}

            {currentPage === 'login' && (
                <Login onLoginSuccess={handleAdminLogin} setCurrentPage={setCurrentPage} />
            )}

            {isAdmin && currentPage === 'admin' && (
                <AdminDashboard onLogout={handleLogout} />
            )}



        </div>
    );
}

export default App;