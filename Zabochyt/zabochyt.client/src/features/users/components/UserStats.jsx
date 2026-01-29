import styles from './UserStats.module.css';
import clsx from 'clsx';

const UserStats = ({ shiftsCompleted, totalHours }) => {

    const getRank = (count) => {
        if (count >= 20) return { title: 'Žabí Král', icon: '👑' };
        if (count >= 10) return { title: 'Zachránce', icon: '🦸‍♂️' };
        if (count >= 5) return { title: 'Skokan', icon: '🐸' };
        if (count >= 1) return { title: 'Pulec', icon: '🐟' };
        return { title: 'Nováček', icon: '🥚' };
    };

    const rank = getRank(shiftsCompleted);

    return (
        <div className={styles.statsContainer}>
            {/* Karta Hodnosti */}
            <div className={clsx(styles.statCard, styles.rankCard)}>
                <div className={styles.rankIcon}>{rank.icon}</div>
                <div className={styles.value} style={{ fontSize: '1.5rem' }}>{rank.title}</div>
                <div className={styles.label}>Aktuální hodnost</div>
            </div>

            {/* Karta Směn */}
            <div className={styles.statCard}>
                <div className={styles.value}>{shiftsCompleted}</div>
                <div className={styles.label}>Odsloužených směn</div>
            </div>

            {/* Karta Hodin */}
            <div className={styles.statCard}>
                <div className={styles.value}>{totalHours}</div>
                <div className={styles.label}>Hodin v terénu</div>
            </div>
        </div>
    );
};

export default UserStats;