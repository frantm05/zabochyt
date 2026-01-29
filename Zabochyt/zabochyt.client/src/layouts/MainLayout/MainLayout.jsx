// src/layouts/MainLayout/MainLayout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import styles from './MainLayout.module.css';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userRole = user?.role || 'dobrovolnik';

    return (
        <div className={styles.container}>
            {/* LEVÝ SIDEBAR */}
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    🐸 Zabochyt
                </div>

                <nav className={styles.nav}>
                    {/* Společné linky */}
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
                    >
                        Přehled
                    </NavLink>

                    {/* Specifické pro Koordinátora */}
                    {userRole === 'koordinator' && (
                        <NavLink
                            to="/planovani"
                            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
                        >
                            Plánování směn
                        </NavLink>
                    )}

                    {/* Specifické pro Dobrovolníka */}
                    {userRole === 'dobrovolnik' && (
                        <NavLink
                            to="/moje-smeny"
                            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
                        >
                            Moje směny
                        </NavLink>
                    )}
                </nav>

                {/* Editace profilu v sidebaru (Požadavek 3) */}
                <div className={styles.userProfile}>
                    <NavLink
                        to="/profil"
                        className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
                    >
                        👤 Můj Profil
                    </NavLink>
                    
                    
                </div>
                {/* Sign Out Button */}
                <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                >
                    🚪 Odhlásit se
                </button>
            </aside>

            {/* HLAVNÍ OBSAH */}
            <main className={styles.contentArea}>
                {/* Outlet renderuje child route */}
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;