import styles from './VolunteerShiftList.module.css';
import clsx from 'clsx'; // Utility pro spojování tříd (nainstalovali jsme v kroku 1)

const VolunteerShiftList = ({ shifts, variant = 'available', onAction }) => {

    if (!shifts || shifts.length === 0) {
        return <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>
            {variant === 'available' ? 'Žádné volné termíny.' : 'Zatím nemáte naplánované žádné směny.'}
        </div>;
    }

    return (
        <div className={styles.listContainer}>
            {shifts.map(shift => {
                const isFull = shift.currentVolunteers >= shift.capacity;
                // Pokud je varianta 'available' a je plno, tlačítko bude disabled
                const canSignUp = variant === 'available' && !isFull;

                return (
                    <div
                        key={shift.id}
                        className={clsx(styles.card, variant === 'available' ? styles.cardAvailable : styles.cardSigned)}
                    >
                        {/* Datum a Čas */}
                        <div className={styles.dateSection}>
                            <span className={styles.date}>
                                {new Date(shift.date).toLocaleDateString('cs-CZ', { weekday: 'short', day: 'numeric', month: 'numeric' })}
                            </span>
                            <span className={styles.time}>
                                🕒 {shift.startTime} - {shift.endTime}
                            </span>
                        </div>

                        {/* Detaily */}
                        <div className={styles.meta}>
                            <span className={styles.location}>📍 {shift.location}</span>
                            <span className={clsx(styles.capacity, isFull && styles.capacityFull)}>
                                👥 {shift.currentVolunteers} / {shift.capacity} dobrovolníků
                            </span>
                            {shift.note && <span style={{ fontSize: '0.8rem', color: '#888' }}>ℹ️ {shift.note}</span>}
                        </div>

                        {/* Akce */}
                        <div>
                            {variant === 'available' ? (
                                <button
                                    className={clsx(styles.actionBtn, canSignUp ? styles.btnSignUp : styles.btnDisabled)}
                                    onClick={() => canSignUp && onAction(shift.id)}
                                    disabled={!canSignUp}
                                >
                                    {isFull ? 'Obsazeno' : 'Přihlásit se'}
                                </button>
                            ) : (
                                <button
                                    className={clsx(styles.actionBtn, styles.btnCancel)}
                                    onClick={() => onAction(shift.id)}
                                >
                                    Omluvit se
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default VolunteerShiftList;