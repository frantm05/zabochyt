// src/layouts/MainLayout/MainLayout.jsx
import { Outlet, NavLink } from 'react-router-dom';
import styles from './MainLayout.module.css';

// Poznámka: Role budeme později tahat z AuthContextu
const MainLayout = ({ userRole = 'dobrovolnik' }) => {
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