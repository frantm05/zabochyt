import axios from 'axios';

// Vytvoření instance s base URL (ASP.NET Core defaultně běží na portech, které určí Vite proxy, nebo přímo)
// Pokud používáš Vite proxy (viz vite.config.js), stačí '/api'
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Přidá Token do hlavičky každého požadavku
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('zabochyt_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Ošetření vypršení tokenu (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token vypršel nebo je neplatný -> odhlásit
            localStorage.removeItem('zabochyt_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;