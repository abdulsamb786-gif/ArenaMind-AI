export const stadium = {
  name: "ArenaMind Stadium",
  capacity: 80000,
  gates: [
    { id: "A", name: "Gate A", capacity: 20000, currentOccupancy: 92, status: "critical" },
    { id: "B", name: "Gate B", capacity: 18000, currentOccupancy: 65, status: "busy" },
    { id: "C", name: "Gate C", capacity: 22000, currentOccupancy: 40, status: "normal" },
    { id: "D", name: "Gate D", capacity: 20000, currentOccupancy: 55, status: "normal" },
  ],
  zones: [
    { id: "Z1", name: "VIP Zone", capacity: 5000, currentOccupancy: 78 },
    { id: "Z2", name: "Grand Stand", capacity: 25000, currentOccupancy: 85 },
    { id: "Z3", name: "East Wing", capacity: 20000, currentOccupancy: 60 },
    { id: "Z4", name: "West Wing", capacity: 20000, currentOccupancy: 45 },
    { id: "Z5", name: "South Stand", capacity: 10000, currentOccupancy: 35 },
  ],
  foodCourts: [
    { id: "F1", name: "Stall 1", zone: "Z2", queueTime: 8 },
    { id: "F2", name: "Stall 2", zone: "Z3", queueTime: 12 },
    { id: "F3", name: "Stall 3", zone: "Z4", queueTime: 4 },
    { id: "F4", name: "Stall 4", zone: "Z5", queueTime: 6 },
    { id: "F5", name: "Stall 5", zone: "Z1", queueTime: 2 },
    { id: "F6", name: "Stall 6", zone: "Z2", queueTime: 15 },
  ],
  medicalPosts: [
    { id: "M1", zone: "Z2", status: "available" },
    { id: "M2", zone: "Z4", status: "available" },
    { id: "M3", zone: "Z5", status: "busy" },
  ],
  parkingLots: [
    { id: "P1", name: "Parking A", capacity: 2000, current: 1800, status: "full" },
    { id: "P2", name: "Parking B", capacity: 1500, current: 900, status: "busy" },
    { id: "P3", name: "Parking C", capacity: 2500, current: 600, status: "available" },
  ],
  transportHubs: [
    { id: "T1", name: "Metro Station East", queueMinutes: 10, status: "busy" },
    { id: "T2", name: "Metro Station West", queueMinutes: 3, status: "normal" },
    { id: "T3", name: "Bus Terminal", queueMinutes: 15, status: "busy" },
  ],
};

export const seatLayout = {
  "A-203": { gate: "A", zone: "Z2", level: 2, row: 10, nearestFood: "F1", nearestMedical: "M1" },
  "B-105": { gate: "B", zone: "Z3", level: 1, row: 5, nearestFood: "F2", nearestMedical: "M2" },
  "C-308": { gate: "C", zone: "Z4", level: 3, row: 8, nearestFood: "F3", nearestMedical: "M2" },
  "D-412": { gate: "D", zone: "Z5", level: 4, row: 12, nearestFood: "F4", nearestMedical: "M3" },
};

export const accessibilityRoutes = {
  "A-203": { wheelchairFriendly: true, alternateRoute: "Elevator 2 → Corridor 5 → Gate A" },
  "B-105": { wheelchairFriendly: false, alternateRoute: "Ramp 1 → Corridor 3 → Gate B" },
};
