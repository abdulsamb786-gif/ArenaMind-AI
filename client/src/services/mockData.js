const mockData = {
  agents: [
    { id: 'nav-agent', name: 'Navigation Agent', status: 'online' },
    { id: 'crowd-agent', name: 'Crowd Intel Agent', status: 'online' },
    { id: 'incident-agent', name: 'Incident Agent', status: 'online' },
    { id: 'mission-agent', name: 'Mission Agent', status: 'online' },
    { id: 'briefing-agent', name: 'Briefing Agent', status: 'online' },
    { id: 'policy-agent', name: 'Policy Agent', status: 'online' },
  ],

  kpi: {
    aiDecisionsToday: 47,
    incidentsResolved: 18,
    predictionAccuracy: 94,
    averageResponseSeconds: 38,
  },

  dashboard: {
    totalOccupancy: 72,
    gates: [
      { name: 'Gate A', occupancy: 85, riskLevel: 'elevated' },
      { name: 'Gate B', occupancy: 62, riskLevel: 'normal' },
      { name: 'Gate C', occupancy: 45, riskLevel: 'normal' },
      { name: 'Gate D', occupancy: 78, riskLevel: 'elevated' },
      { name: 'Gate E', occupancy: 34, riskLevel: 'low' },
      { name: 'Gate F', occupancy: 91, riskLevel: 'critical' },
    ],
    crowdInsight: 'Gate F approaching critical capacity. Consider opening auxiliary exits.',
    foodCourts: [
      { name: 'Pizza Stand', queueTime: 8 },
      { name: 'Burger Point', queueTime: 12 },
      { name: 'Taco Bell', queueTime: 5 },
      { name: 'Coffee Cart', queueTime: 3 },
      { name: 'Ice Cream', queueTime: 2 },
      { name: 'Sandwich Bar', queueTime: 7 },
    ],
    medicalPosts: [
      { zone: 'North Stand', status: 'available' },
      { zone: 'South Stand', status: 'available' },
      { zone: 'East Stand', status: 'busy' },
      { zone: 'West Stand', status: 'available' },
    ],
    securityIncidents: [
      { summary: 'Suspicious bag near Gate C', severity: 'high' },
      { summary: 'Minor altercation Section 204', severity: 'low' },
      { summary: 'Unauthorized access attempt VIP zone', severity: 'critical' },
    ],
    transport: [
      { name: 'Metro Line 1', status: 'busy', queueMinutes: 15 },
      { name: 'Metro Line 2', status: 'normal', queueMinutes: 5 },
      { name: 'Shuttle Bus', status: 'normal', queueMinutes: 8 },
    ],
    parking: [
      { name: 'Parking A', status: 'full', current: 500, capacity: 500 },
      { name: 'Parking B', status: 'busy', current: 380, capacity: 500 },
      { name: 'Parking C', status: 'available', current: 120, capacity: 400 },
    ],
    weather: {
      condition: 'clear',
      temperature: 28,
      humidity: 45,
      windSpeed: 12,
      rainProbability: 10,
    },
  },

  aiInsight: 'Crowd flow is steady with peak expected at halftime. Gate F needs monitoring.',
  mission: {
    mission_name: 'Gate F Crowd Management',
    mission_id: 'M-2026-07-19-001',
    mission_type: 'crowd_control',
    priority: 'high',
    status: 'active',
    recommendation: {
      tasks: [
        { action: 'Dispatch 4 stewards to Gate F', assignee: 'Security Lead' },
        { action: 'Open auxiliary exit Gate F2', assignee: 'Operations' },
        { action: 'Broadcast crowd redistribution announcement', assignee: 'Announcement System' },
      ],
      resources: { volunteers: 4, eta_minutes: 3 },
    },
    impact: 'High',
    risk_level: 'critical',
    eta_minutes: 3,
    confidence: 87,
    explanation: {
      primaryReason: 'Gate F occupancy at 91% with match starting in 15 minutes',
      supportingFactors: [
        { factor: 'Historical congestion pattern matches', status: 'positive' },
        { factor: 'Weather is clear, no external delays', status: 'positive' },
        { factor: 'Nearby gates are also elevated', status: 'warning' },
      ],
      whatIfNot: 'Without intervention, Gate F may reach 100% capacity within 10 minutes causing hazardous crowding',
    },
    announcement: 'Attention fans. Gate F is experiencing high traffic. Please use Gates E and D for entry. Additional staff has been deployed to assist.',
  },

  copilot: {
    response: 'Your seat is in Section 204, Row 12, Seat 8. Head to the East Stand entrance. The nearest food court is the Pizza Stand with only 5 minutes queue time! 🍕',
    agent: { agent: 'CopilotAgent' },
    latency: '0.8s',
    memory: { seat: '204-12-8', language: 'en' },
  },
  translate: { translated: 'Translated text would appear here based on the selected language.' },

  incident: {
    timeline: [
      { step: 'understand', label: 'AI Understanding', status: 'completed', durationMs: 230 },
      { step: 'retrieve', label: 'RAG Retrieval', status: 'completed', durationMs: 410 },
      { step: 'predict', label: 'AI Prediction', status: 'completed', durationMs: 320 },
      { step: 'recommend', label: 'AI Recommendation', status: 'active', durationMs: 180 },
      { step: 'explain', label: 'AI Explanation', status: 'pending', durationMs: 0 },
      { step: 'execute', label: 'AI Execution', status: 'pending', durationMs: 0 },
    ],
    processingTime: { totalSeconds: 1.2, aiSource: 'Gemini 1.5 Flash' },
    summary: 'Lost child reported near Gate B. Activating Lost Child Protocol.',
    category: 'incident',
    priorityScore: 8,
    ragPolicies: [
      { title: 'FIFA Lost and Found Protocol §3.2' },
      { title: 'FIFA Child Safety Guidelines §2.1' },
    ],
    prediction: {
      impact: 'High - child safety critical within 10 minutes',
      riskScore: 92,
      affectedFans: 50,
      timeToCritical: 12,
      confidence: 88,
    },
    recommendation: {
      action: 'Activate Lost Child Protocol',
      mission: {
        name: 'Lost Child Recovery - Gate B',
        impact: 'Critical',
        risk_level: 'critical',
        eta_minutes: 5,
      },
      tasks: [
        { action: 'Secure the area around Gate B', assignee: 'Security Team Alpha' },
        { action: 'Broadcast child description to all staff', assignee: 'Ops Center' },
        { action: 'Guide child to nearest medical post', assignee: 'Volunteer Lead' },
      ],
    },
    confidence: 88,
    explanation: {
      primaryReason: 'Child safety matches FIFA critical incident criteria',
      supportingFactors: [
        { factor: 'High crowd density in area', status: 'positive' },
        { factor: 'Multiple exits require coordination', status: 'warning' },
        { factor: 'Staff available for immediate response', status: 'positive' },
      ],
      whatIfNot: 'Delay of more than 10 minutes increases risk of child leaving stadium premises',
    },
    announcement: 'Security teams, attention. Lost child reported near Gate B. Child is 6 years old, wearing blue jersey. All staff please be on alert.',
  },

  demoScenarios: {
    scenarios: [
      { id: 'lost-child', name: 'Lost Child', description: 'Child separated from parents near Gate C', icon: '👶' },
      { id: 'medical-emergency', name: 'Medical Emergency', description: 'Fan collapses in Section 102', icon: '🚑' },
      { id: 'weather-alert', name: 'Weather Alert', description: 'Sudden thunderstorm approaching stadium', icon: '🌧' },
      { id: 'crowd-congestion', name: 'Crowd Congestion', description: 'Gate A reaching critical capacity', icon: '🚶' },
      { id: 'transport-delay', name: 'Transport Delay', description: 'Metro line stalled after match', icon: '🚇' },
    ],
  },

  demoRun: {
    scenario: 'Lost Child',
    description: 'Child separated from parents near Gate C during halftime rush',
    prediction: { riskLevel: 'critical', riskScore: 92, confidence: 87, affectedFans: 200 },
    agentsActivated: [
      { name: 'Crowd Intel Agent', durationMs: 340 },
      { name: 'Incident Agent', durationMs: 520 },
      { name: 'Policy Agent', durationMs: 280 },
    ],
    recommendation: { primaryAction: 'Activate Lost Child Protocol and deploy 3 volunteers to Gate C' },
    announcement: 'Attention staff. Lost child reported at Gate C. Child is 7 years old wearing red jersey. Please be on lookout.',
    explanation: { why: 'High crowd density near Gate C combined with child safety protocols requires immediate action' },
  },

  simulateRun: {
    scenario: 'Gate Closure',
    trigger: 'Close Gate A due to structural concern',
    impact: { totalFansAffected: 3500, fansInSurge: 1200, fansInUncoveredZones: 400 },
    riskScore: 85,
    estimatedCompletionMinutes: 25,
    recommendation: 'Redirect Gate A traffic to Gates B and E. Deploy 6 additional stewards.',
    announcement: 'Gate A is temporarily closed. Please use Gates B or E for entry. We apologize for the inconvenience.',
    redistribution: [
      { gate: 'Gate B', currentOccupancy: 62, projectedOccupancy: 84, status: 'elevated' },
      { gate: 'Gate E', currentOccupancy: 34, projectedOccupancy: 65, status: 'normal' },
      { gate: 'Gate C', currentOccupancy: 45, projectedOccupancy: 45, status: 'normal' },
    ],
  },

  briefing: {
    generatedAt: new Date().toISOString(),
    stadiumName: 'ArenaMind Stadium',
    operational_status: 'elevated',
    decisions_made_today: 47,
    incidents_resolved: 18,
    average_response_time: '38s',
    crowd_summary: 'Current occupancy at 72% across all zones. Gate F at critical (91%). Gate A and D elevated.',
    security_summary: '3 active incidents. 1 critical (unauthorized access attempt). All under monitoring.',
    medical_summary: '3 of 4 medical posts available. East Stand post currently attending to a fan.',
    volunteer_summary: '24 volunteers on duty. 6 additional available for deployment.',
    transport_summary: 'Metro Line 1 running with 15min delays. Parking A full. Parking B at 76%.',
    key_risks: [
      'Gate F approaching critical capacity - intervention recommended within 5 min',
      'Metro Line 1 delays causing congestion at North entrance',
      'Weather forecast shows 40% rain probability in next hour',
    ],
    ai_recommendations: [
      'Open auxiliary exit at Gate F immediately',
      'Increase shuttle bus frequency to compensate for Metro delays',
      'Pre-deploy rain contingency team at open seating sections',
    ],
    next_hour_outlook: 'Conditions expected to remain stable with possible weather deterioration. Monitor Gate F and Metro situation closely.',
  },

  stadiumUpdate: {
    crowd: { totalOccupancy: 72, gates: [{ name: 'Gate A', occupancy: 85 }, { name: 'Gate B', occupancy: 62 }, { name: 'Gate C', occupancy: 45 }, { name: 'Gate D', occupancy: 78 }, { name: 'Gate E', occupancy: 34 }, { name: 'Gate F', occupancy: 91 }] },
    foodCourts: [{ name: 'Pizza Stand', queueTime: 8 }, { name: 'Burger Point', queueTime: 12 }, { name: 'Taco Bell', queueTime: 5 }, { name: 'Coffee Cart', queueTime: 3 }, { name: 'Ice Cream', queueTime: 2 }],
    medicalPosts: [{ zone: 'North Stand', status: 'available' }, { zone: 'South Stand', status: 'available' }, { zone: 'East Stand', status: 'busy' }, { zone: 'West Stand', status: 'available' }],
    securityIncidents: [{ summary: 'Suspicious bag near Gate C', severity: 'high' }, { summary: 'Minor altercation Section 204', severity: 'low' }],
    weather: { condition: 'clear', temperature: 28, humidity: 45, windSpeed: 12, rainProbability: 10 },
    transport: [{ name: 'Metro Line 1', status: 'busy', queueMinutes: 15 }, { name: 'Shuttle Bus', status: 'normal', queueMinutes: 8 }],
    parking: [{ name: 'Parking A', status: 'full', current: 500, capacity: 500 }, { name: 'Parking B', status: 'busy', current: 380, capacity: 500 }],
  },
};

export default mockData;
