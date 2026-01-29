import { useState, useEffect, useMemo } from 'react';
import VolunteerShiftList from '../schedule/components/VolunteerShiftList';
import ShiftControls from '../schedule/components/ShiftControls'; // Znovupoužití!
import api from '../../services/api';
import { mapShiftFromApi } from '../../utils/dateMapper';

const DashboardPage = () => {
    const [availableShifts, setAvailableShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Stavy pro filtrování (stejné jako v PlanningPage)
    const [locationFilter, setLocationFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list');
    const [currentDate, setCurrentDate] = useState(new Date());

    // 1. NAČTENÍ VOLNÝCH TERMÍNŮ
    useEffect(() => {
        const fetchShifts = async () => {
            try {
                const response = await api.get('/timeslots');
                const formatted = response.data.map(mapShiftFromApi);
                setAvailableShifts(formatted);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchShifts();
    }, []);

    const uniqueLocations = useMemo(() => [...new Set(availableShifts.map(s => s.location))], [availableShifts]);

    // --- NAVIGACE ---
    const handleNavigate = (direction) => {
        const newDate = new Date(currentDate);
        if (direction === 0) {
            setCurrentDate(new Date()); return;
        }
        if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + direction);
        else if (viewMode === 'week') newDate.setDate(newDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
    };

    // --- FILTROVÁNÍ ---
    const filteredShifts = useMemo(() => {
        let result = [...availableShifts];

        if (locationFilter !== 'all') result = result.filter(s => s.location === locationFilter);

        if (viewMode === 'month') {
            result = result.filter(s => {
                const d = new Date(s.date);
                return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
            });
        } else if (viewMode === 'week') {
            const startOfWeek = new Date(currentDate);
            const day = startOfWeek.getDay() || 7;
            startOfWeek.setDate(startOfWeek.getDate() - day + 1);
            startOfWeek.setHours(0, 0, 0, 0);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            result = result.filter(s => {
                const d = new Date(s.date);
                return d >= startOfWeek && d <= endOfWeek;
            });
        }

        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        return result;
    }, [availableShifts, locationFilter, viewMode, currentDate]);

    const handleSignUp = async (shiftId) => {
        try {
            await api.post(`/timeslots/${shiftId}/signup`);

            alert(`Úspěšně přihlášeno! 🐸`);

            // ZMĚNA: Nemažeme shift ze seznamu, ale aktualizujeme jeho stav
            setAvailableShifts(prev => prev.map(shift => {
                if (shift.id === shiftId) {
                    return {
                        ...shift,
                        isSignedUp: true,
                        currentVolunteers: shift.currentVolunteers + 1
                    };
                }
                return shift;
            }));
        } catch (error) {
            console.error("Chyba přihlášení:", error);
            // Lepší error handling
            if (error.response && error.response.status === 400) {
                alert(error.response.data || "Nelze se přihlásit (chyba dat).");
            } else {
                alert("Nepodařilo se přihlásit.");
            }
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}> 
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Nabídka směn</h1>
            <p style={{ marginBottom: '2rem', color: '#666' }}>Vyberte si termín a přidejte se k nám.</p>

            <ShiftControls
                locations={uniqueLocations}
                locationFilter={locationFilter}
                onLocationChange={setLocationFilter}
                viewMode={viewMode}
                onViewChange={setViewMode}
                currentDate={currentDate}
                onNavigate={handleNavigate}
            />

            {loading ? <p>Načítám nabídku...</p> : (
                <VolunteerShiftList
                    shifts={filteredShifts}
                    variant="available"
                    onAction={handleSignUp}
                />
            )}
        </div>
    );
};

export default DashboardPage;