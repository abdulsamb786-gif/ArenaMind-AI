export const demoScenarios = [
  {
    id: "lost-child",
    title: "Lost Child",
    description: "A child has been reported lost near Gate B",
    trigger: {
      type: "incident",
      input: "Child crying near Gate B. Approximately 6 years old, wearing blue shirt. Parents are nearby and panicking.",
    },
    expectedWorkflow: [
      "Incident Agent activated",
      "Policy retrieval - FIFA Lost Child Protocol",
      "Severity prediction",
      "Response plan generated",
      "Announcement created (EN + ES + HI)",
      "Volunteers assigned",
    ],
  },
  {
    id: "medical-emergency",
    title: "Medical Emergency",
    description: "Fan collapsed in Grand Stand Zone 2",
    trigger: {
      type: "incident",
      input: "Medical emergency at Grand Stand, Zone 2. A fan has collapsed and appears unconscious. Bystanders are gathering.",
    },
    expectedWorkflow: [
      "Incident Agent activated",
      "Medical protocol retrieved",
      "Severity: CRITICAL",
      "Nearest medical team dispatched",
      "Emergency route cleared",
      "Ambulance access coordinated",
    ],
  },
  {
    id: "heavy-rain",
    title: "Heavy Rain Alert",
    description: "Sudden heavy rainfall detected, 14,000 fans at risk",
    trigger: {
      type: "weather",
      input: "Heavy rain detected. Intensity: high. Duration: estimated 45 minutes. Temperature: 18°C. Wind: moderate.",
    },
    expectedWorkflow: [
      "Weather alert received",
      "Affected zones calculated",
      "Mission created: Heavy Rain Response",
      "Covered gates identified",
      "Volunteer deployment plan",
      "Medical units repositioned",
      "Public announcement generated",
    ],
  },
  {
    id: "gate-congestion",
    title: "Gate Congestion",
    description: "Gate A at 92% capacity, crowd growing rapidly",
    trigger: {
      type: "congestion",
      input: "Gate A occupancy at 92% and rising. Historical data shows peak inflow expected in 10 minutes. Event starts in 2 hours.",
    },
    expectedWorkflow: [
      "Crowd threshold breached",
      "Pattern analysis triggered",
      "Alternative gate recommendation",
      "Volunteer redistribution plan",
      "Public announcement generated",
      "Risk score calculated",
    ],
  },
  {
    id: "transport-delay",
    title: "Transport Delay",
    description: "Metro line disruption affecting 3,000 arriving fans",
    trigger: {
      type: "transport",
      input: "Metro East line disruption. Delay: 25 minutes. Affected fans: estimated 3,000. Bus terminal queue at 15 minutes. Parking C still available.",
    },
    expectedWorkflow: [
      "Transport disruption detected",
      "Impact analysis",
      "Alternative routing suggested",
      "Parking capacity checked",
      "Shuttle bus deployment plan",
      "Crowd redistribution strategy",
    ],
  },
];
