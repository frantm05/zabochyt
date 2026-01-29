import { useState, useEffect } from 'react';
import CreateShiftForm from '../components/CreateShiftForm';
import ShiftList from '../components/ShiftList';
import styles from './PlanningPage.module.css';
import api from '../../../services/api';

const PlanningPage = () => {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Načtení dat při startu
    useEffect(() => {
        const fetchShifts = async () => {
            try {
                // await api.get('/shifts');
                // FAKE DATA
                await new Promise(r => setTimeout(r, 500));
                setShifts([
                    { id: 1, date: '2024-04-10', startTime: '18:00', endTime: '22:00', location: 'Lokalita A - Rybník', capacity: 5, currentVolunteers: 2, note: '' },
                    { id: 2, date: '2024-04-12', startTime: '19:00', endTime: '23:00', location: 'Lokalita B - Silnice', capacity: 3, currentVolunteers: 3, note: 'Vemte si baterky' },
                ]);
            } catch (err) {
                console.error("Chyba při načítání směn");
            } finally {
                setLoading(false);
            }
        };

        fetchShifts();
    }, []);

    const handleShiftCreated = (newShift) => {
        setShifts(prev => [...prev, newShift]);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Opravdu chcete zrušit tento termín?")) return;

        // await api.delete(`/shifts/${id}`);
        setShifts(prev => prev.filter(s => s.id !== id));
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Plánování směn</h1>
                    <p className={styles.subtitle}>Jako koordinátor vypisujete termíny pro dobrovolníky.</p>
                </div>
            </div>

            {/* Sekce 1: Formulář */}
            <CreateShiftForm onShiftCreated={handleShiftCreated} />

            {/* Sekce 2: Seznam */}
            <h3 style={{ color: 'var(--color-text-main)', marginTop: '2rem' }}>📅 Aktivní vypsané termíny</h3>
            {loading ? (
                <p>Načítám data...</p>
            ) : (
                <ShiftList shifts={shifts} onDelete={handleDelete} />
            )}
        </div>
    );
};

export default PlanningPage;