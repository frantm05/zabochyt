import { useState } from 'react';
import styles from './ShiftList.module.css';

const ShiftList = ({ shifts, onDelete }) => {
    const [expandedId, setExpandedId] = useState(null);

    if (!shifts || shifts.length === 0) {
        return <div className={styles.emptyState}>Žádné směny k zobrazení.</div>;
    }

    // 1. Seskupení podle MĚSÍCŮ 
    const groupedByMonth = shifts.reduce((groups, shift) => {
        const date = new Date(shift.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!groups[key]) {
            groups[key] = {
                dateObj: date,
                items: []
            };
        }
        groups[key].items.push(shift);
        return groups;
    }, {});

    const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

    return (
        <div className={styles.calendarContainer}>
            {Object.keys(groupedByMonth).map(monthKey => {
                const group = groupedByMonth[monthKey];
                const monthTitle = group.dateObj.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' });

                // 2. Vnořené seskupení podle DNE v rámci měsíce
                const shiftsByDay = group.items.reduce((days, shift) => {
                    const dayKey = shift.date; // "YYYY-MM-DD" 
                    if (!days[dayKey]) days[dayKey] = [];
                    days[dayKey].push(shift);
                    return days;
                }, {});

                const sortedDays = Object.keys(shiftsByDay).sort();

                return (
                    <div key={monthKey} className={styles.monthSection}>
                        <div className={styles.monthHeader}>{monthTitle}</div>

                        <div className={styles.monthGrid}>
                            {sortedDays.map(dayKey => {
                                const dayShifts = shiftsByDay[dayKey];
                                const dateObj = new Date(dayKey);

                                return (
                                    <div key={dayKey} className={styles.dayRow}>

                                        {/* LEVÝ SLOUPEC: Datum (pouze jednou pro všechny směny dne) */}
                                        <div className={styles.dateBox}>
                                            <span className={styles.dayName}>
                                                {dateObj.toLocaleDateString('cs-CZ', { weekday: 'short' })}
                                            </span>
                                            <span className={styles.dayNumber}>
                                                {dateObj.getDate()}
                                            </span>
                                        </div>

                                        {/* PRAVÝ SLOUPEC: Seznam kartiček (Stack) */}
                                        <div className={styles.shiftsStack}>
                                            {dayShifts.map(shift => {
                                                const isExpanded = expandedId === shift.id;

                                                return (
                                                    <div
                                                        key={shift.id}
                                                        className={`${styles.shiftCard} ${isExpanded ? styles.expanded : ''}`}
                                                        onClick={() => toggleExpand(shift.id)}
                                                    >
                                                        <div className={styles.cardHeader}>
                                                            <div className={styles.timeInfo}>
                                                                <span className={styles.timeBadge}>{shift.startTime} - {shift.endTime}</span>
                                                                <strong className={styles.locationTitle}>{shift.location}</strong>
                                                            </div>

                                                            <div className={styles.cardActions}>
                                                                <span className={styles.capacityInfo}>
                                                                    👥 {shift.currentVolunteers}/{shift.capacity}
                                                                </span>
                                                                <button
                                                                    className={styles.deleteBtn}
                                                                    onClick={(e) => { e.stopPropagation(); onDelete(shift.id); }}
                                                                >
                                                                    🗑️
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {isExpanded && (
                                                            <div className={styles.participantsBody} onClick={e => e.stopPropagation()}>
                                                                <h5 style={{ margin: '0 0 10px 0', color: '#888', fontSize: '0.8rem' }}>DOBROVOLNÍCI:</h5>
                                                                {shift.volunteers?.length > 0 ? (
                                                                    <div className={styles.pList}>
                                                                        {shift.volunteers.map((vol, i) => (
                                                                            <div key={i} className={styles.pTag}>
                                                                                {vol.name} <small>({vol.phone})</small>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <span style={{ fontStyle: 'italic', color: '#aaa' }}>Nikdo není přihlášen.</span>
                                                                )}
                                                                {shift.note && <div style={{ marginTop: 10, fontSize: '0.9rem' }}>📝 {shift.note}</div>}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ShiftList;