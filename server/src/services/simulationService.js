import { stadium } from "../data/stadium.js";

export function simulateScenario(scenario) {
  switch (scenario) {
    case "close-gate-a":
      return simulateGateClosure("A");
    case "heavy-rain":
      return simulateHeavyRain();
    case "power-outage":
      return simulatePowerOutage();
    case "crowd-surge":
      return simulateCrowdSurge();
    default:
      return { error: "Unknown scenario" };
  }
}

function simulateGateClosure(gateId) {
  const gate = stadium.gates.find((g) => g.id === gateId);
  if (!gate) return { error: "Gate not found" };

  const redistributedFans = Math.round(gate.currentOccupancy * 0.01 * gate.capacity);
  const remainingGates = stadium.gates.filter((g) => g.id !== gateId);
  const perGate = Math.round(redistributedFans / remainingGates.length);

  const updatedGates = remainingGates.map((g) => ({
    ...g,
    newOccupancy: Math.min(100, g.currentOccupancy + Math.round((perGate / g.capacity) * 100)),
  }));

  return {
    scenario: `Gate ${gateId} Closed`,
    trigger: `${gate.name} has been closed due to operational requirements`,
    impact: {
      totalFansAffected: redistributedFans,
      gatesAffected: remainingGates.length,
    },
    redistribution: updatedGates.map((g) => ({
      gate: g.name,
      currentOccupancy: `${g.currentOccupancy}%`,
      projectedOccupancy: `${g.newOccupancy}%`,
      status: g.newOccupancy > 85 ? "critical" : g.newOccupancy > 60 ? "elevated" : "normal",
    })),
    volunteerRequirement: Math.max(4, Math.round(redistributedFans / 500)),
    estimatedDelay: `${Math.round(redistributedFans / 200) + 5} minutes`,
    riskScore: Math.min(95, Math.round(redistributedFans / 100) + 20),
    riskLevel: redistributedFans > 5000 ? "critical" : redistributedFans > 2000 ? "high" : "medium",
    recommendation: `Immediately deploy ${Math.max(4, Math.round(redistributedFans / 500))} volunteers to manage rerouting at ${remainingGates.map((g) => g.name).join(", ")}`,
    alternativeRoute: `Fans redirected via ${remainingGates.map((g) => g.name).join(" → ")}`,
    announcement: `Attention: ${gate.name} is now closed. Please use ${remainingGates.map((g) => g.name).join(" or ")} for entry and exit. Volunteers will guide you.`,
  };
}

function simulateHeavyRain() {
  const uncoveredZones = stadium.zones.filter((z) => z.id === "Z3" || z.id === "Z5");
  const affectedFans = uncoveredZones.reduce(
    (sum, z) => sum + Math.round((z.currentOccupancy / 100) * z.capacity),
    0
  );
  const coveredGates = stadium.gates.filter((g) => g.id === "C" || g.id === "D");

  return {
    scenario: "Heavy Rainfall Detected",
    trigger: "Sudden heavy rain within 5km radius. Duration: estimated 45 minutes.",
    impact: {
      fansInUncoveredZones: affectedFans,
      uncoveredZones: uncoveredZones.map((z) => z.name),
      coveredGatesAvailable: coveredGates.map((g) => g.name),
    },
    responsePlan: {
      volunteerCount: 12,
      medicalUnitsToMove: 1,
      coveredAreas: ["Gate C concourse", "Gate D concourse", "Indoor zones (Z1, Z2, Z4)"],
      tasks: [
        "Open all covered gates",
        "Deploy umbrella distribution at Zone 3 and 5",
        "Move medical unit from Zone 5 to Zone 4 indoor",
        "Activate PA announcements every 30 seconds",
        "Redirect parking to covered lots",
      ],
    },
    estimatedCompletionMinutes: 8,
    riskScore: 82,
    riskLevel: "high",
    recommendation: "Activate Weather Emergency Response Plan immediately. Deploy 12 volunteers. Move fans from uncovered zones.",
    announcement: "Attention fans: Heavy rainfall detected. Please move to covered areas immediately. Gates C and D are open for shelter. Volunteers in yellow jackets will assist you.",
  };
}

function simulatePowerOutage() {
  return {
    scenario: "Partial Power Outage",
    trigger: "Electrical fault detected in Zone 2 and Zone 3",
    impact: {
      zonesAffected: ["Zone 2 - Grand Stand", "Zone 3 - East Wing"],
      fansAffected: Math.round(
        stadium.zones
          .filter((z) => z.id === "Z2" || z.id === "Z3")
          .reduce((sum, z) => sum + (z.currentOccupancy / 100) * z.capacity, 0)
      ),
      emergencyLighting: "Activated automatically",
    },
    responsePlan: {
      tasks: [
        "Activate backup generators",
        "Deploy emergency lighting teams",
        "Station volunteers at stairwells",
        "Guide fans to illuminated zones",
        "Technical team dispatched to electrical room",
      ],
    },
    estimatedCompletionMinutes: 15,
    riskScore: 75,
    riskLevel: "high",
  };
}

function simulateCrowdSurge() {
  const surgeGate = stadium.gates[0];
  const surgeAmount = Math.round(Math.random() * 15 + 10);
  const newOccupancy = Math.min(100, surgeGate.currentOccupancy + surgeAmount);

  return {
    scenario: "Crowd Surge at Gate A",
    trigger: `Unexpected crowd arrival. ${surgeGate.name} occupancy surging from ${surgeGate.currentOccupancy}% to ${newOccupancy}%`,
    impact: {
      gate: surgeGate.name,
      currentOccupancy: `${surgeGate.currentOccupancy}%`,
      projectedOccupancy: `${newOccupancy}%`,
      timeToCritical: `${Math.round(surgeAmount / 2)} minutes`,
      fansInSurge: Math.round((surgeAmount / 100) * surgeGate.capacity),
    },
    responsePlan: {
      tasks: [
        "Deploy 6 volunteers to Gate A immediately",
        "Open Gate C as alternative entry",
        "Activate digital signage for rerouting",
        "PA announcement: redirect to Gate C",
        "Monitor Gate A for 15 minutes",
      ],
    },
    estimatedCompletionMinutes: 8,
    riskScore: Math.min(95, 50 + surgeAmount * 3),
    riskLevel: newOccupancy > 90 ? "critical" : "high",
    recommendation: "Open Gate C immediately. Deploy 6 volunteers to Gate A corridor. Activate rerouting signage.",
    announcement: `Attention: ${surgeGate.name} is experiencing high volume. Please use Gate C for faster entry. Volunteers are stationed to assist.`,
  };
}
