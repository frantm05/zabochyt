import { useState, useEffect } from 'react';
import VolunteerShiftList from '../components/VolunteerShiftList';

const MyShiftsPage = () => {
    const [myShifts, setMyShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulace načtení "směn, kde JSEM přihlášen"
        const fetchData = async () => {
            await new Promise(r => setTimeout(r, 500));
            setMyShifts([
                { id: 201, date: '2024-04-20', startTime: '18:00', endTime: '22:00', location: 'Lokalita B', capacity: 4, currentVolunteers: 2, note: 'Moje nadcházející směna' }
            ]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleCancel = async (shiftId) => {
        if (!confirm("Opravdu se chcete odhlásit z této směny? Koordinátorovi to zkomplikuje situaci.")) return;

        // await api.post(`/shifts/${shiftId}/signoff`);

        setMyShifts(prev => prev.filter(s => s.id !== shiftId));
        alert("Byli jste odhlášeni.");
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-text-main)' }}>Moje směny</h1>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
                Přehled termínů, na které jste se zapsali. Pokud nemůžete dorazit, prosím omluvte se včas.
            </p>

            {loading ? <p>Načítám...</p> : (
                <VolunteerShiftList
                    shifts={myShifts}
                    variant="signed"
                    onAction={handleCancel}
                />
            )}
        </div>
    );
};

export default MyShiftsPage;