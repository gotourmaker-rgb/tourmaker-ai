import { VEHICLE_TYPES } from './vehicle';

// Mock Rates (KRW)
const RATES = {
    [VEHICLE_TYPES.PREMIUM_MINIVAN.id]: { base: 100000, perKm: 1000, perMin: 500 },
    [VEHICLE_TYPES.GENERAL_MINIVAN.id]: { base: 80000, perKm: 800, perMin: 400 },
    [VEHICLE_TYPES.CARGO_MINIVAN.id]: { base: 90000, perKm: 900, perMin: 450 },
    [VEHICLE_TYPES.JUMBO_VAN.id]: { base: 150000, perKm: 1500, perMin: 600 },
    [VEHICLE_TYPES.MINI_BUS.id]: { base: 200000, perKm: 2000, perMin: 800 },
    [VEHICLE_TYPES.LARGE_BUS.id]: { base: 350000, perKm: 3000, perMin: 1000 },
};

export function calculateFare(vehicleId, distanceKm, durationMin) {
    const rate = RATES[vehicleId];
    if (!rate) return 0;

    const cost = rate.base + (distanceKm * rate.perKm) + (durationMin * rate.perMin);

    // Round to nearest 1000 won
    return Math.ceil(cost / 1000) * 1000;
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
}
