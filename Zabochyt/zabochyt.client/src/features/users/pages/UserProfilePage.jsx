import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import UserStats from '../components/UserStats';
import styles from './UserProfilePage.module.css';
import clsx from 'clsx';
import api from '../../../services/api';

const AVATAR_COLORS = ['#2e7d32', '#1976d2', '#d32f2f', '#ed6c02', '#9c27b0', '#555555'];

const UserProfilePage = () => {
    const { user } = useAuth(); 

    const [profile, setProfile] = useState({
        nickname: '',
        email: '',
        phone: '',
        avatarColor: '#2e7d32',
        shiftsCompleted: 0,
        totalHours: 0
    });

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Načtení dat (Simulace API GET /profile)
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/users/profile'); 

                const data = response.data;

                setProfile({
                    nickname: data.nickname || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    avatarColor: data.avatarColor || '#2e7d32',
                    shiftsCompleted: data.shiftsCompleted || 0,
                    totalHours: data.totalHours || 0
                });
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleColorChange = (color) => {
        setProfile({ ...profile, avatarColor: color });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.put('/users/profile', profile);  // ✅ Fixed (removed user.id)
            alert("Uloženo!");
        } catch (err) {
            alert("Chyba ukládání.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div>Načítám profil...</div>;

    const initials = profile.nickname
        ? profile.nickname.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : '??';

    return (
        <div className={styles.container}>
            <h1 className={styles.headerTitle}>Můj Profil</h1>

            {/* 1. Část: Statistiky a Motivace */}
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>🏆 Moje žabí statistiky</h3>
                <UserStats
                    shiftsCompleted={profile.shiftsCompleted}
                    totalHours={profile.totalHours}
                />
            </section>

            {/* 2. Část: Editace údajů */}
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>👤 Osobní údaje</h3>

                <form onSubmit={handleSubmit}>
                    {/* Výběr Avatara */}
                    <div className={styles.avatarSection}>
                        <div
                            className={styles.avatarPreview}
                            style={{ backgroundColor: profile.avatarColor }}
                            title="Váš avatar"
                        >
                            {initials}
                        </div>
                        <div>
                            <label className={styles.label}>Barva profilu</label>
                            <div className={styles.colorPicker}>
                                {AVATAR_COLORS.map(c => (
                                    <div
                                        key={c}
                                        className={clsx(styles.colorOption, profile.avatarColor === c && styles.colorOptionActive)}
                                        style={{ backgroundColor: c }}
                                        onClick={() => handleColorChange(c)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Přezdívka / Jméno</label>
                        <input
                            type="text"
                            name="nickname"
                            className={styles.input}
                            value={profile.nickname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Telefon</label>
                        <input
                            type="tel"
                            name="phone"
                            className={styles.input}
                            value={profile.phone}
                            onChange={handleChange}
                            placeholder="+420 777 666 555"
                        />
                        <div className={styles.helperText}>
                            Doporučeno pro rychlou komunikaci v případě změny srazu.
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email (Login)</label>
                        <input
                            type="email"
                            className={styles.input}
                            value={profile.email}
                            disabled
                            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                        />
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                            {isSaving ? 'Ukládám...' : 'Uložit změny'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default UserProfilePage;