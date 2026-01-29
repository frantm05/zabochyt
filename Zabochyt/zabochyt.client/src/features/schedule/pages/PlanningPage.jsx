import { useState, useEffect, useMemo } from 'react';
import CreateShiftForm from '../components/CreateShiftForm';
import ShiftList from '../components/ShiftList';
import ShiftControls from '../components/ShiftControls';
import styles from './PlanningPage.module.css';
import api from '../../../services/api'; 
import { mapShiftFromApi } from '../../../utils/dateMapper'; 

const PlanningPage = () => {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtry
    const [locationFilter, setLocationFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list');
    const [currentDate, setCurrentDate] = useState(new Date());

    // 1. NAČTENÍ DAT Z API
    const fetchShifts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/timeslots'); 
            const formattedShifts = response.data.map(mapShiftFromApi);
            setShifts(formattedShifts);
        } catch (error) {
            console.error("Chyba při načítání směn:", error);
            alert("Nepodařilo se načíst data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShifts();
    }, []);

    const uniqueLocations = useMemo(() => [...new Set(shifts.map(s => s.location))], [shifts]);

    // Navigace v kalendáři
    const handleNavigate = (direction) => {
        const newDate = new Date(currentDate);
        if (direction === 0) { setCurrentDate(new Date()); return; }
        if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + direction);
        else if (viewMode === 'week') newDate.setDate(newDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
    };

    // Filtrování
    const filteredShifts = useMemo(() => {
        let result = [...shifts];
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
    }, [shifts, locationFilter, viewMode, currentDate]);

    // 2. VYTVOŘENÍ SMĚNY (Callback)
    const handleShiftCreated = () => {
        fetchShifts();
    };

    // 3. SMAZÁNÍ SMĚNY
    const handleDelete = async (id) => {
        if (!window.confirm("Opravdu smazat tento termín?")) return;

        try {
            await api.delete(`/timeslots/${id}`);
            setShifts(prev => prev.filter(s => s.id !== id)); 
        } catch (error) {
            console.error("Chyba při mazání:", error);
            alert("Smazání se nezdařilo.");
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Plánování směn</h1>
                    <p className={styles.subtitle}>Správa termínů a dobrovolníků.</p>
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