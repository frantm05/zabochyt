import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    // Stavy pro formulář
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');

    // UI stavy
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, register } = useAuth(); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validace shody hesel při registraci
        if (isRegistering && password !== confirmPassword) {
            return setError('Hesla se neshodují.');
        }

        setIsSubmitting(true);

        try {
            if (isRegistering) {
                // Volání registrace
                await register(email, password, name);
                alert('Registrace úspěšná! Nyní se můžete přihlásit.');
                setIsRegistering(false); // Přepneme na login
            } else {
                // Volání loginu
                await login(email, password);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Akce se nezdařila. Zkontrolujte údaje.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>🐸 Zabochyt</h1>
                <h2 className={styles.subtitle}>
                    {isRegistering ? 'Vytvořit účet' : 'Vítejte zpět'}
                </h2>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    {isRegistering && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Jméno</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Tvé jméno"
                            />
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="jan@zaba.cz"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Heslo</label>
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {isRegistering && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Potvrzení hesla</label>
                            <input
                                type="password"
                                className={styles.input}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? 'Pracuji...'
                            : (isRegistering ? 'Zaregistrovat se' : 'Přihlásit se')}
                    </button>
                </form>

                <div className={styles.toggleMode}>
                    {isRegistering ? (
                        <p>
                            Již máte účet? {' '}
                            <button onClick={() => setIsRegistering(false)} className={styles.linkButton}>
                                Přihlaste se
                            </button>
                        </p>
                    ) : (
                        <p>
                            Nemáte účet? {' '}
                            <button onClick={() => setIsRegistering(true)} className={styles.linkButton}>
                                Vytvořit registraci
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;