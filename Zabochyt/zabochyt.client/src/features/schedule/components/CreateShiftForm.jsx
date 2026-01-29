import { useState, useEffect } from 'react';
import styles from './CreateShiftForm.module.css';

const CreateShiftForm = ({ onShiftCreated }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], 
        startTime: '18:00',
        endTime: '22:00',
        location: 'Lokalita A - Rybník',
        capacity: 4,
        note: ''
    });

    const [isOvernight, setIsOvernight] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Automatická detekce přelomu dne
    useEffect(() => {
        if (formData.startTime && formData.endTime) {
            setIsOvernight(formData.endTime < formData.startTime);
        } else {
            setIsOvernight(false);
        }
    }, [formData.startTime, formData.endTime]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulace API volání
            await new Promise(r => setTimeout(r, 600));

            const newShift = {
                id: Date.now(),
                ...formData,
                isOvernight: isOvernight,
                currentVolunteers: 0,
                volunteers: []
            };

            onShiftCreated(newShift);

            setFormData(prev => ({ ...prev, note: '' }));
            alert("Termín vypsán! 🐸");

        } catch (error) {
            console.error("Chyba", error);
            alert("Nepodařilo se vytvořit směnu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formCard}>
            <h3 className={styles.header}>➕ Vypsat nový termín</h3>

            <form onSubmit={handleSubmit}>
                <div className={styles.row}>
                    <div className={styles.col}>
                        <label className={styles.label}>Datum začátku</label>
                        <input
                            type="date"
                            name="date"
                            required
                            className={styles.input}
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.col}>
                        <label className={styles.label}>Místo</label>
                        <select
                            name="location"
                            className={styles.select}
                            value={formData.location}
                            onChange={handleChange}
                        >
                            <option>Lokalita A - Rybník</option>
                            <option>Lokalita B - Silnice u lesa</option>
                            <option>Lokalita C - Mokřad</option>
                        </select>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.col}>
                        <label className={styles.label}>Začátek</label>
                        <input
                            type="time"
                            name="startTime"
                            required
                            className={styles.input}
                            value={formData.startTime}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.col}>
                        <label className={styles.label}>
                            Konec
                            {isOvernight && <span style={{ color: '#d32f2f', marginLeft: 5, fontSize: '0.8em' }}>(+1 den)</span>}
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="time"
                                name="endTime"
                                required
                                className={styles.input}
                                style={isOvernight ? { borderColor: '#ff9800', backgroundColor: '#fffbf0' } : {}}
                                value={formData.endTime}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.col} style={{ flex: 0.5 }}>
                        <label className={styles.label}>Kapacita</label>
                        <input
                            type="number"
                            name="capacity"
                            min="1"
                            max="20"
                            required
                            className={styles.input}
                            value={formData.capacity}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.col}>
                        <label className={styles.label}>Poznámka</label>
                        <textarea
                            name="note"
                            rows="2"
                            className={styles.textarea}
                            placeholder="Např. Holínky nutné, sraz u závory."
                            value={formData.note}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? 'Ukládám...' : 'Vypsat termín'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateShiftForm;