import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import api from '../../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Při startu zkusíme obnovit session z localStorage
        const token = localStorage.getItem('zabochyt_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Zde předpokládám, že claims v tokenu mají standardní klíče nebo tvé vlastní
                // Upravíme podle reálného backendu. Často role bývá v klíči role nebo "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                setUser({
                    id: decoded.sub || decoded.id,
                    email: decoded.email,
                    role: decoded.role || 'dobrovolnik', // Fallback
                    name: decoded.unique_name || decoded.name
                });
            } catch (e) {
                console.error("Neplatný token", e);
                localStorage.removeItem('zabochyt_token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Reálné volání na tvůj .NET Controller (např. AuthController)
        // const response = await api.post('/auth/login', { email, password });
        // const { token } = response.data;

        // --- SIMULACE (dokud nemáme běžící backend endpoint) ---
        // TODO: Až bude backend hotový, odkomentuj kód výše a smaž tuto simulaci
        await new Promise(r => setTimeout(r, 800)); // Fake delay

        let fakeRole = 'dobrovolnik';
        if (email.includes('admin')) fakeRole = 'koordinator';

        const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulace";
        const fakeUser = { email, role: fakeRole, name: 'Jan Žabák' };

        // Uložení
        localStorage.setItem('zabochyt_token', fakeToken);
        setUser(fakeUser);
        return true;
        // --- KONEC SIMULACE ---
    };

    const register = async (email, password, name) => {
        // Reálné volání na tvůj .NET Controller (např. AuthController)
        // const response = await api.post('/auth/register', { email, password, name });
        // return response.data;
        // --- SIMULACE (dokud nemáme běžící backend endpoint) ---
        await new Promise(r => setTimeout(r, 800)); // Fake delay
        return { success: true };
        // --- KONEC SIMULACE ---
    };

    const logout = () => {
        localStorage.removeItem('zabochyt_token');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isCoordinator: user?.role === 'koordinator'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);