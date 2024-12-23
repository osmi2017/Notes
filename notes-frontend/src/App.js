import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import Home from './components/Home';
import { SignupForm } from './components/SignupForm'; // Import the SignupForm component
import { checkAndRefreshToken } from './utils/tokenUtils';

const App = () => {
    const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('token'));

    // Check and refresh token on mount and periodically
    useEffect(() => {
        const refreshToken = async () => {
            await checkAndRefreshToken();
            setAuthenticated(!!localStorage.getItem('token'));
        };

        refreshToken();

        const interval = setInterval(refreshToken, 300000); // Refresh every 5 minutes
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                {/* Default route - redirects to Home if authenticated, else shows LoginForm */}
                <Route
                    path="/"
                    element={
                        authenticated ? <Navigate to="/home" /> : <LoginForm onAuth={() => setAuthenticated(true)} />
                    }
                />
                
                {/* Home page - accessible only if authenticated */}
                <Route
                    path="/home"
                    element={authenticated ? <Home /> : <Navigate to="/" />}
                />
                
                {/* Signup page - does not require authentication */}
                <Route
                    path="/signup"
                    element={<SignupForm />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
