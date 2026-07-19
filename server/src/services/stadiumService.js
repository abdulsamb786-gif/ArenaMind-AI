import { stadium } from "../data/stadium.js";

let simulationInterval = null;
let listeners = [];

export function getStadiumStatus() {
  const totalCapacity = stadium.capacity;
  const totalOccupancy = stadium.zones.reduce((sum, z) => sum + z.currentOccupancy, 0);
  const averageOccupancy = Math.round((totalOccupancy / (stadium.zones.length * 100)) * 100);

  return {
    overallOccupancy: Math.min(averageOccupancy, 100),
    totalCapacity,
    estimatedFans: Math.round((averageOccupancy / 100) * totalCapacity),
    gates: stadium.gates.map((g) => ({
      ...g,
      riskLevel: g.currentOccupancy > 85 ? "critical" : g.currentOccupancy > 60 ? "elevated" : "normal",
    })),
    zones: stadium.zones,
    foodCourts: stadium.foodCourts,
    medicalPosts: stadium.medicalPosts,
    parkingLots: stadium.parkingLots,
    transportHubs: stadium.transportHubs,
    timestamp: new Date().toISOString(),
  };
}

export function getCrowdData() {
  return {
    gates: stadium.gates.map((g) => ({ name: g.name, occupancy: g.currentOccupancy, capacity: g.capacity })),
    zones: stadium.zones.map((z) => ({ name: z.name, occupancy: z.currentOccupancy, capacity: z.capacity })),
    totalOccupancy: Math.round(
      (stadium.zones.reduce((s, z) => s + z.currentOccupancy, 0) / (stadium.zones.length * 100)) * 100
    ),
  };
}

export function getTransportData() {
  return {
    parking: stadium.parkingLots,
    transport: stadium.transportHubs,
    timestamp: new Date().toISOString(),
  };
}

export function getWeatherData() {
  const conditions = ["clear", "cloudy", "rain", "storm"];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  return {
    condition,
    temperature: Math.round(22 + Math.random() * 12),
    humidity: Math.round(40 + Math.random() * 40),
    windSpeed: Math.round(5 + Math.random() * 25),
    rainProbability: Math.round(Math.random() * 100),
    forecast: condition === "rain" || condition === "storm" ? "adverse" : "favorable",
    timestamp: new Date().toISOString(),
  };
}

export function getIncidents() {
  const types = ["medical", "security", "crowd", "service", "accessibility"];
  const severities = ["low", "medium", "high"];
  const statuses = ["resolved", "active", "monitoring"];

  return Array.from({ length: 5 }, (_, i) => ({
    id: `INC-${100 + i}`,
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    location: `Zone ${Math.floor(Math.random() * 5) + 1}`,
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    summary: `Sample incident ${i + 1}`,
  }));
}

export function subscribeToUpdates(callback) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

export function broadcastUpdate(data) {
  listeners.forEach((l) => l(data));
}

function randomFluctuation() {
  return Math.round((Math.random() - 0.5) * 6);
}

export function simulateTick() {
  stadium.gates.forEach((gate) => {
    gate.currentOccupancy = Math.min(100, Math.max(5, gate.currentOccupancy + randomFluctuation()));
    gate.status =
      gate.currentOccupancy > 85 ? "critical" : gate.currentOccupancy > 60 ? "busy" : "normal";
  });
  stadium.zones.forEach((zone) => {
    zone.currentOccupancy = Math.min(100, Math.max(5, zone.currentOccupancy + randomFluctuation()));
  });
  stadium.foodCourts.forEach((fc) => {
    fc.queueTime = Math.min(30, Math.max(1, fc.queueTime + Math.round((Math.random() - 0.5) * 4)));
  });

  broadcastUpdate(getStadiumStatus());
}

export function startSimulation(intervalMs = 5000) {
  if (simulationInterval) clearInterval(simulationInterval);
  simulationInterval = setInterval(simulateTick, intervalMs);
}

export function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}
