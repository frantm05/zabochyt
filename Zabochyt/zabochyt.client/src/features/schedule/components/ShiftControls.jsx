import styles from './ShiftControls.module.css';

const ShiftControls = ({
    locations,
    locationFilter,
    onLocationChange,
    viewMode,       // 'list' | 'month' | 'week'
    onViewChange,
    currentDate,    // Datum, které zrovna prohlížíme
    onNavigate      // Funkce pro posun (prev/next)
}) => {

    // Pomocná funkce pro formátování nadpisu data
    const getDateLabel = () => {
        if (viewMode === 'month') {
            return currentDate.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' });
        }
        if (viewMode === 'week') {
            // Získáme začátek a konec týdne pro label
            const start = new Date(currentDate);
            const day = start.getDay() || 7; // Sunday = 7
            start.setDate(start.getDate() - day + 1);

            const end = new Date(start);
            end.setDate(end.getDate() + 6);

            return `${start.getDate()}. - ${end.getDate()}. ${end.toLocaleDateString('cs-CZ', { month: 'long' })}`;
        }
        return 'Nadcházející akce';
    };

    return (
        <div className={styles.controlsContainer}>

            {/* 1. SEKCE: Přepínač pohledů */}
            <div className={styles.viewSwitcher}>
                <button
                    className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                    onClick={() => onViewChange('list')}
                >
                    Seznam
                </button>
                <button
                    className={`${styles.viewBtn} ${viewMode === 'month' ? styles.active : ''}`}
                    onClick={() => onViewChange('month')}
                >
                    Měsíc
                </button>
                <button
                    className={`${styles.viewBtn} ${viewMode === 'week' ? styles.active : ''}`}
                    onClick={() => onViewChange('week')}
                >
                    Týden
                </button>
            </div>

            {/* 2. SEKCE: Navigace v čase */}
            {viewMode !== 'list' && (
                <div className={styles.navigation}>
                    <button onClick={() => onNavigate(-1)} className={styles.navBtn}>◀</button>
                    <span className={styles.dateLabel}>{getDateLabel()}</span>
                    <button onClick={() => onNavigate(1)} className={styles.navBtn}>▶</button>
                    <button onClick={() => onNavigate(0)} className={styles.todayBtn}>Dnes</button>
                </div>
            )}

            <div className={styles.divider}></div>

            {/* 3. SEKCE: Filtr lokality */}
            <div className={styles.group}>
                <select
                    value={locationFilter}
                    onChange={(e) => onLocationChange(e.target.value)}
                    className={styles.select}
                >
                    <option value="all">🌍 Všechny lokality</option>
                    {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ShiftControls;