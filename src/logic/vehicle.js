/**
 * Vehicle Rules based on Pax and Luggage
 */
export const VEHICLE_TYPES = {
    PREMIUM_MINIVAN: { id: 'premium_minivan', name: 'Premium Mini Van', models: ['Kia Carnival High Limousine', 'Staria Lounge'], maxPax: 4, maxLuggage: 4 },
    GENERAL_MINIVAN: { id: 'general_minivan', name: 'General Mini Van', models: ['Staria 11-Seater'], maxPax: 6, maxLuggage: 6 },
    CARGO_MINIVAN: { id: 'cargo_minivan', name: 'Mini Van(Wide Cargo)', models: ['Staria 9-Seater Tourer'], maxPax: 7, maxLuggage: 9 },
    JUMBO_VAN: { id: 'jumbo_van', name: 'Jumbo Van', models: ['Solati', 'Master'], maxPax: 13, maxLuggage: 13 },
    MINI_BUS: { id: 'mini_bus', name: 'Mini Bus', models: ['County'], maxPax: 17, maxLuggage: 17 },
    LARGE_BUS: { id: 'large_bus', name: 'Large Bus', models: ['Universe'], maxPax: 40, maxLuggage: 40 },
};

export function recommendVehicle(pax, luggage) {
    const p = parseInt(pax);
    const l = parseInt(luggage);

    // Logic from prompt
    if (p <= 4 && l <= 4) return VEHICLE_TYPES.PREMIUM_MINIVAN;
    if (p <= 6 && l <= 6) return VEHICLE_TYPES.GENERAL_MINIVAN;
    if (p <= 7 && l <= 9) return VEHICLE_TYPES.CARGO_MINIVAN;
    if (p <= 13 && l <= 13) return VEHICLE_TYPES.JUMBO_VAN; // Covers 10-13 constraint
    if (p <= 17 && l <= 17) return VEHICLE_TYPES.MINI_BUS;
    if (p <= 40 && l <= 40) return VEHICLE_TYPES.LARGE_BUS;

    return null; // Over capacity or no match
}

export function getSuitableVehicles(pax, luggage) {
    const p = parseInt(pax);
    const l = parseInt(luggage);

    // Return ALL vehicles that fit constraints
    return Object.values(VEHICLE_TYPES).filter(v => {
        return p <= v.maxPax && l <= v.maxLuggage;
    }).sort((a, b) => {
        // Sort by capacity (ascending) or some "premium" score?
        // Let's sort by maxPax for now
        return a.maxPax - b.maxPax;
    });
}
