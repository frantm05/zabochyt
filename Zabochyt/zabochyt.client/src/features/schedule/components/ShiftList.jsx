import styles from './ShiftList.module.css';

const ShiftList = ({ shifts, onDelete }) => {

    if (!shifts || shifts.length === 0) {
        return <div className={styles.emptyState}>Zatím nejsou vypsány žádné termíny.</div>;
    }

    // Seřadíme směny podle data
    const sortedShifts = [...shifts].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className={styles.listContainer}>
            {sortedShifts.map((shift) => (
                <div key={shift.id} className={styles.shiftItem}>
                    <div className={styles.info}>
                        <div className={styles.dateRow}>
                            <span>{new Date(shift.date).toLocaleDateString('cs-CZ')}</span>
                            <span className={styles.timeBadge}>{shift.startTime} - {shift.endTime}</span>
                        </div>
                        <div className={styles.details}>
                            📍 {shift.location}
                            <span style={{ margin: '0 8px' }}>|</span>
                            👤 Obsazeno: <span className={styles.capacity}>{shift.currentVolunteers} / {shift.capacity}</span>
                        </div>
                        {shift.note && <div style={{ fontSize: '0.85rem', color: '#888', marginTop: 4 }}>📝 {shift.note}</div>}
                    </div>

                    <button
                        onClick={() => onDelete(shift.id)}
                        className={styles.deleteBtn}
                        title="Zrušit termín"
                    >
                        🗑️ Zrušit
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ShiftList;