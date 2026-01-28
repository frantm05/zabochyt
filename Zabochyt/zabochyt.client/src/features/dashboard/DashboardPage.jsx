import { useState, useEffect } from 'react';
import VolunteerShiftList from '../schedule/components/VolunteerShiftList';
import api from '../../services/api';

const DashboardPage = () => {
    const [availableShifts, setAvailableShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulace načtení "všech budoucích směn, kde NEJSEM přihlášen"
        const fetchData = async () => {
            await new Promise(r => setTimeout(r, 600));
            setAvailableShifts([
                { id: 101, date: '2024-05-01', startTime: '17:00', endTime: '21:00', location: 'Lokalita A - Rybník', capacity: 5, currentVolunteers: 1, note: '' },
                { id: 102, date: '2024-05-02', startTime: '17:00', endTime: '21:00', location: 'Lokalita A - Rybník', capacity: 3, currentVolunteers: 3, note: 'Už je plno' }, // Full test
                { id: 103, date: '2024-05-05', startTime: '18:00', endTime: '22:00', location: 'Lokalita C - Mokřad', capacity: 4, currentVolunteers: 0, note: 'Vezměte si holínky!' },
            ]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleSignUp = async (shiftId) => {
        // await api.post(`/shifts/${shiftId}/signup`);
        alert(`Úspěšně přihlášeno na směnu ID: ${shiftId} 🐸`);

        // Optimistický update UI - odebereme z nabídky, protože už je "moje"
        setAvailableShifts(prev => prev.filter(s => s.id !== shiftId));
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Vítejte v Zabochytu!</h1>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
                Zde vidíte seznam záchranných akcí, kde potřebujeme vaši pomoc. Vyberte si termín a přidejte se k nám.
            </p>

            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10 }}>🗓️ Dostupné termíny</h3>

            {loading ? <p>Načítám nabídku...</p> : (
                <VolunteerShiftList
                    shifts={availableShifts}
                    variant="available"
                    onAction={handleSignUp}
                />
            )}
        </div>
    );
};

export default DashboardPage;