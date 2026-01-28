import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import MyShiftsPage from './features/schedule/pages/MyShiftsPage';
import PlanningPage from './features/schedule/pages/PlanningPage';
import { AuthProvider, useAuth } from './features/auth/AuthContext';

// --- PLACEHOLDERY (Zatím je necháme, budeme nahrazovat v další fázi) ---
const Profile = () => <div style={{ padding: 20 }}><h1>Profil</h1></div>;

// --- OCHRANA ROUT ---
// Komponenta, která pustí dál jen přihlášeného uživatele
const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Outlet />;
};

// Komponenta pro layout, která předá userRole do MainLayoutu
const LayoutWrapper = () => {
    const { user } = useAuth();
    return <MainLayout userRole={user?.role} />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<LayoutWrapper />}>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="dashboard" element={<DashboardPage />} />
                            <Route path="profil" element={<Profile />} />
                            <Route path="moje-smeny" element={<MyShiftsPage />} />
                            <Route path="planovani" element={<PlanningPage />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;