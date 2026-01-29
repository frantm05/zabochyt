import { jwtDecode } from 'jwt-decode';

// Pomocná funkce pro získání ID přihlášeného uživatele z tokenu
const getCurrentUserId = () => {
    const token = localStorage.getItem('zabochyt_token');
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        // Backend používá standardní claim "nameid" nebo "sub" pro ID
        return decoded.nameid || decoded.sub || decoded.id;
    } catch {
        return null;
    }
};

export const mapShiftFromApi = (slot) => {
    const currentUserId = getCurrentUserId();

    // Konverze času
    const startDate = new Date(slot.start);
    const endDate = new Date(slot.end);

    const formatTime = (date) => date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
    const dateString = startDate.toISOString().split('T')[0];

    // Získání seznamu dobrovolníků z "Registrations"
    // Backend vrací: Registrations: [{ user: { nickname: '...', phone: '...' } }, ...]
    const volunteersList = slot.registrations
        ? slot.registrations.map(reg => ({
            id: reg.userId,
            name: reg.user?.nickname || 'Neznámý',
            phone: reg.user?.phone || ''
        }))
        : [];

    // Zjištění, zda jsem přihlášen (hledáme své ID v registracích)
    // Porovnáváme jako String, abychom se vyhnuli problémům int vs string
    const isSignedUp = slot.registrations?.some(r => String(r.userId) === String(currentUserId));

    return {
        id: slot.id,
        date: dateString,
        startTime: formatTime(startDate),
        endTime: formatTime(endDate),
        location: slot.location,
        capacity: slot.maxCapacity, // Backend má MaxCapacity
        currentVolunteers: slot.registrations ? slot.registrations.length : 0, // Počítáme délku pole registrací
        note: slot.note,
        volunteers: volunteersList,
        isSignedUp: !!isSignedUp // Boolean
    };
};