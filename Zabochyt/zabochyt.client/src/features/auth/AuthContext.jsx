import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../../services/api';

const AuthContext = createContext(null);

// Move processToken above useEffect to avoid temporal dead zone
const processToken = (token, setUser, logout) => {
    try {
        const decoded = jwtDecode(token);
        setUser({
            id: decoded.sub || decoded.nameid,
            email: decoded.email,
            role: decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 'dobrovolnik',
            name: decoded.unique_name || decoded.name || 'Uživatel'
        });
    } catch (e) {
        console.error("Chyba tokenu:", e);
        logout();
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('zabochyt_token');
        if (token) {
            processToken(token, setUser, logout);
        }
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (email, password) => {
        try {
            // VOLÁNÍ BACKENDU
            const response = await api.post('/auth/login', { email, password });
            const { token } = response.data;

            if (token) {
                localStorage.setItem('zabochyt_token', token);
                processToken(token, setUser, logout);
                return true;
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error; 
        }
    };

    const logout = () => {
        localStorage.removeItem('zabochyt_token');
        setUser(null);
    };

    // Jednoduchá registrace (pokud ji děláš na frontendu)
    const register = async (email, password, name) => {
        await api.post('/auth/register', { 
            email, 
            password, 
            name 
        });
    };

    const value = {
        user,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        isCoordinator: user?.role === 'koordinator' || user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);