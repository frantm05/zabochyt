import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Oprava importu pro pojmenovaný export
import api from '../../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Pøi startu zkusíme obnovit session z localStorage
        const token = localStorage.getItem('zabochyt_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Zde pøedpokládám, že claims v tokenu mají standardní klíèe nebo tvé vlastní
                // Upravíme podle reálného backendu. Èasto role bývá v klíèi role nebo "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
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
        // Reálné volání na tvùj .NET Controller (napø. AuthController)
        // const response = await api.post('/auth/login', { email, password });
        // const { token } = response.data;

        // --- SIMULACE (dokud nemáme bìžící backend endpoint) ---
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

    const logout = () => {
        localStorage.removeItem('zabochyt_token');
        setUser(null);
    };

    const value = {
        user,
        login,
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