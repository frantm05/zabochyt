import { useState, useEffect, useMemo } from 'react';
import VolunteerShiftList from '../schedule/components/VolunteerShiftList';
import ShiftControls from '../schedule/components/ShiftControls'; // Znovupoužití!
import api from '../../services/api';

const DashboardPage = () => {
    const [availableShifts, setAvailableShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Stavy pro filtrování (stejné jako v PlanningPage)
    const [locationFilter, setLocationFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list');
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            // FAKE DATA
            await new Promise(r => setTimeout(r, 600));
            setAvailableShifts([
                { id: 101, date: '2024-05-01', startTime: '17:00', endTime: '21:00', location: 'Lokalita A', capacity: 5, currentVolunteers: 1, note: '' },
                { id: 102, date: '2024-05-02', startTime: '17:00', endTime: '21:00', location: 'Lokalita A', capacity: 3, currentVolunteers: 3, note: 'Už je plno' },
                { id: 103, date: '2024-05-05', startTime: '18:00', endTime: '02:00', location: 'Lokalita C', capacity: 4, currentVolunteers: 0, note: 'Holínky nutné' },
                { id: 104, date: '2024-06-10', startTime: '18:00', endTime: '02:00', location: 'Lokalita B', capacity: 4, currentVolunteers: 0, note: 'Letní akce' },
            ]);
            setLoading(false);
        };
        fetchData();
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
        // await api.post(`/shifts/${shiftId}/signup`);
        alert(`Úspěšně přihlášeno!`);
        setAvailableShifts(prev => prev.filter(s => s.id !== shiftId));
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