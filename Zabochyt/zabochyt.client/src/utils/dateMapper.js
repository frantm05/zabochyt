// Převede backend formát (TimeSlot) na frontend formát
export const mapShiftFromApi = (slot) => {
    // slot.start je např. "2024-05-01T18:00:00"
    const startDate = new Date(slot.start);
    const endDate = new Date(slot.end);

    // Formátování času na HH:MM
    const formatTime = (date) => date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });

    // Získání YYYY-MM-DD pro input type="date"
    const dateString = startDate.toISOString().split('T')[0];

    return {
        id: slot.id,
        date: dateString, // Pro seskupování v kalendáři
        startTime: formatTime(startDate),
        endTime: formatTime(endDate),
        location: slot.location,
        capacity: slot.maxCapacity, // Pozor na názvy z backendu
        currentVolunteers: slot.currentCapacity || slot.volunteers?.length || 0,
        note: slot.note,
        volunteers: slot.volunteers || [], // Seznam lidí
        isSignedUp: slot.isSignedUp // Backend by měl ideálně poslat, jestli jsem přihlášen
    };
};