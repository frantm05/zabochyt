import { useState } from 'react';
import styles from './VolunteerShiftList.module.css';
import clsx from 'clsx';

const VolunteerShiftList = ({ shifts, variant = 'available', onAction }) => {
    const [expandedId, setExpandedId] = useState(null);

    if (!shifts || shifts.length === 0) {
        return <div className={styles.emptyState}>
            {variant === 'available' ? 'Žádné volné termíny v tomto zobrazení.' : 'Zatím nemáte naplánované žádné směny.'}
        </div>;
    }

    // 1. Seskupení podle MĚSÍCŮ
    const groupedByMonth = shifts.reduce((groups, shift) => {
        const date = new Date(shift.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!groups[key]) {
            groups[key] = { dateObj: date, items: [] };
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

                // 2. Seskupení podle DNE
                const shiftsByDay = group.items.reduce((days, shift) => {
                    const dayKey = shift.date;
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

                                        {/* Datum (levý sloupec) */}
                                        <div className={styles.dateBox}>
                                            <span className={styles.dayName}>
                                                {dateObj.toLocaleDateString('cs-CZ', { weekday: 'short' })}
                                            </span>
                                            <span className={styles.dayNumber}>
                                                {dateObj.getDate()}
                                            </span>
                                        </div>

                                        {/* Stack karet (pravý sloupec) */}
                                        <div className={styles.shiftsStack}>
                                            {dayShifts.map(shift => {
                                                const isFull = shift.currentVolunteers >= shift.capacity;
                                                const canSignUp = variant === 'available' && !isFull;
                                                const isExpanded = expandedId === shift.id;

                                                return (
                                                    <div
                                                        key={shift.id}
                                                        className={clsx(
                                                            styles.shiftCard,
                                                            variant === 'available' ? styles.cardAvailable : styles.cardSigned,
                                                            isExpanded && styles.expanded
                                                        )}
                                                        onClick={() => toggleExpand(shift.id)}
                                                    >
                                                        <div className={styles.cardHeader}>
                                                            <div className={styles.timeInfo}>
                                                                <span className={styles.timeBadge}>{shift.startTime} - {shift.endTime}</span>
                                                                <strong className={styles.locationTitle}>{shift.location}</strong>
                                                            </div>

                                                            <div className={styles.cardActions}>
                                                                <span className={clsx(styles.capacityInfo, isFull && styles.fullCapacity)}>
                                                                    👥 {shift.currentVolunteers}/{shift.capacity}
                                                                </span>

                                                                {/* Tlačítko akce */}
                                                                {variant === 'available' ? (
                                                                    <button
                                                                        className={clsx(styles.actionBtn, canSignUp ? styles.btnSignUp : styles.btnDisabled)}
                                                                        onClick={(e) => { e.stopPropagation(); canSignUp && onAction(shift.id); }}
                                                                        disabled={!canSignUp}
                                                                    >
                                                                        {isFull ? 'Plno' : 'Přihlásit'}
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        className={clsx(styles.actionBtn, styles.btnCancel)}
                                                                        onClick={(e) => { e.stopPropagation(); onAction(shift.id); }}
                                                                    >
                                                                        Omluvit
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Detail (Poznámka) */}
                                                        {isExpanded && shift.note && (
                                                            <div className={styles.cardDetail}>
                                                                <div className={styles.note}>ℹ️ {shift.note}</div>
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

export default VolunteerShiftList;