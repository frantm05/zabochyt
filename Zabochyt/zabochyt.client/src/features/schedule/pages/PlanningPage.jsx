import { useState, useEffect, useMemo } from 'react';
import CreateShiftForm from '../components/CreateShiftForm';
import ShiftList from '../components/ShiftList';
import ShiftControls from '../components/ShiftControls';
import styles from './PlanningPage.module.css';

const PlanningPage = () => {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [locationFilter, setLocationFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list'); // 'list', 'month', 'week'
    const [currentDate, setCurrentDate] = useState(new Date()); 

    useEffect(() => {
        const fetchShifts = async () => {
            // FAKE DATA
            await new Promise(r => setTimeout(r, 500));
            setShifts([
                { id: 1, date: '2026-04-10', startTime: '18:00', endTime: '22:00', location: 'Lokalita A', capacity: 5, currentVolunteers: 2, volunteers: [{ name: 'Petr', phone: '775 858 425' }] },
                { id: 2, date: '2026-04-10', startTime: '19:00', endTime: '23:00', location: 'Lokalita B', capacity: 3, currentVolunteers: 3, volunteers: [] },
                { id: 3, date: '2026-05-01', startTime: '18:00', endTime: '22:00', location: 'Lokalita A', capacity: 5, currentVolunteers: 0, volunteers: [] },
            ]);
            setLoading(false);
        };
        fetchShifts();
    }, []);

    const uniqueLocations = useMemo(() => [...new Set(shifts.map(s => s.location))], [shifts]);

    const handleNavigate = (direction) => { 
        const newDate = new Date(currentDate);

        if (direction === 0) {
            setCurrentDate(new Date());
            return;
        }

        if (viewMode === 'month') {
            newDate.setMonth(newDate.getMonth() + direction);
        } else if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + (direction * 7));
        }
        setCurrentDate(newDate);
    };

    const filteredShifts = useMemo(() => {
        let result = [...shifts];

        // 1. Filtr Lokality
        if (locationFilter !== 'all') {
            result = result.filter(s => s.location === locationFilter);
        }

        // 2. Filtr podle Času (View Mode)
        if (viewMode === 'month') {
            result = result.filter(s => {
                const d = new Date(s.date);
                return d.getMonth() === currentDate.getMonth() &&
                    d.getFullYear() === currentDate.getFullYear();
            });
        }
        else if (viewMode === 'week') {
            const startOfWeek = new Date(currentDate);
            const day = startOfWeek.getDay() || 7; // Sunday is 7
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
    }, [shifts, locationFilter, viewMode, currentDate]);

    const handleShiftCreated = (newShift) => setShifts(prev => [...prev, newShift]);
    const handleDelete = (id) => {
        if (window.confirm("Opravdu smazat?")) setShifts(prev => prev.filter(s => s.id !== id));
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Plánování směn</h1>
                    <p className={styles.subtitle}>Přehled všech nadcházejících akcí.</p>
                </div>
            </div>

            <CreateShiftForm onShiftCreated={handleShiftCreated} />

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>📅 Kalendář akcí</h3>

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
                <ShiftList shifts={filteredShifts} onDelete={handleDelete} />
            )}
        </div>
    );
};

export default PlanningPage;