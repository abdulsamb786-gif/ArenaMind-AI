export const agents = {
  navigation: {
    name: "Navigation Agent",
    id: "nav-agent",
    status: "online",
    icon: "🧭",
    capabilities: ["seat_guidance", "crowd_aware_routing", "wheelchair_routing", "food_recommendation"],
    lastActive: null,
  },
  crowd: {
    name: "Crowd Intelligence Agent",
    id: "crowd-agent",
    status: "online",
    icon: "📊",
    capabilities: ["density_analysis", "congestion_prediction", "flow_optimization"],
    lastActive: null,
  },
  incident: {
    name: "Incident Response Agent",
    id: "incident-agent",
    status: "online",
    icon: "🚨",
    capabilities: ["incident_classification", "severity_assessment", "response_planning"],
    lastActive: null,
  },
  mission: {
    name: "Mission Control Agent",
    id: "mission-agent",
    status: "online",
    icon: "🎯",
    capabilities: ["mission_creation", "resource_deployment", "task_management"],
    lastActive: null,
  },
  briefing: {
    name: "Executive Briefing Agent",
    id: "briefing-agent",
    status: "online",
    icon: "📋",
    capabilities: ["operational_summary", "risk_analysis", "trend_reporting"],
    lastActive: null,
  },
  policy: {
    name: "Policy Agent",
    id: "policy-agent",
    status: "online",
    icon: "📜",
    capabilities: ["rag_retrieval", "policy_grounding", "compliance_check"],
    lastActive: null,
  },
};

export function getOnlineAgentCount() {
  return Object.values(agents).filter((a) => a.status === "online").length;
}

export function setAgentStatus(agentId, status) {
  if (agents[agentId]) {
    agents[agentId].status = status;
    agents[agentId].lastActive = new Date().toISOString();
  }
}
