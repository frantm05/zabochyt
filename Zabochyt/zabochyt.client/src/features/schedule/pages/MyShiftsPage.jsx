import { useState, useEffect, useMemo } from 'react';
import VolunteerShiftList from '../components/VolunteerShiftList';
import ShiftControls from '../components/ShiftControls';
import api from '../../../services/api';
import { mapShiftFromApi } from '../../../utils/dateMapper';

const MyShiftsPage = () => {
    const [myShifts, setMyShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [locationFilter, setLocationFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list');
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const fetchMyShifts = async () => {
            try {
                // Endpoint, který vrací jen MOJE směny
                const response = await api.get('/timeslots/my');
                const formatted = response.data.map(mapShiftFromApi);
                setMyShifts(formatted);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyShifts();
    }, []);

    const uniqueLocations = useMemo(() => [...new Set(myShifts.map(s => s.location))], [myShifts]);

    const handleNavigate = (direction) => {
        const newDate = new Date(currentDate);
        if (direction === 0) { setCurrentDate(new Date()); return; }
        if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + direction);
        else if (viewMode === 'week') newDate.setDate(newDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
    };

    const filteredShifts = useMemo(() => {
        let result = [...myShifts];
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
    }, [myShifts, locationFilter, viewMode, currentDate]);

    // ODHLÁŠENÍ
    const handleCancel = async (shiftId) => {
        if (!confirm("Opravdu se odhlásit?")) return;

        try {
            await api.post(`/timeslots/${shiftId}/signoff`);
            alert("Byli jste odhlášeni.");
            setMyShifts(prev => prev.filter(s => s.id !== shiftId));
        } catch (error) {
            alert("Chyba při odhlašování.");
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-text-main)' }}>Moje směny</h1>

            <ShiftControls
                locations={uniqueLocations}
                locationFilter={locationFilter}
                onLocationChange={setLocationFilter}
                viewMode={viewMode}
                onViewChange={setViewMode}
                currentDate={currentDate}
                onNavigate={handleNavigate}
            />

            {loading ? <p>Načítám...</p> : (
                <VolunteerShiftList
                    shifts={filteredShifts}
                    variant="signed"
                    onAction={handleCancel}
                />
            )}
        </div>
    );
};

export default MyShiftsPage;