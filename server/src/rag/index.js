const documentStore = [
  {
    id: "fifa-lost-child",
    title: "FIFA Lost and Found Protocol Sec.3.2",
    content: `When a child is reported lost near stadium gates, the following protocol must be activated immediately:
    1. Security team secures the location
    2. Designated child-safe zone activated
    3. PA announcement broadcast every 2 minutes
    4. Parent directed to nearest help desk
    5. Child description shared with all volunteer teams
    6. Social media team posts on official channels
    All volunteers must wear visible ID. Response time target: under 5 minutes.`,
    keywords: ["child", "lost", "missing", "parent", "gate", "security"],
  },
  {
    id: "fifa-child-safety",
    title: "FIFA Child Safety Guidelines  Sec.2.1",
    content: `Child safety zones are located at Gate B help desk, Zone 2 information booth, and the main concourse.
    Each zone must have at least 2 trained volunteers. Children must not be moved outside their zone of discovery.
    Parents must provide ID matching their ticket registration. Emergency medical support available at all zones.`,
    keywords: ["child", "safety", "zone", "volunteer", "medical"],
  },
  {
    id: "fifa-medical-response",
    title: "FIFA Medical Emergency Response Manual  Sec.4",
    content: `Medical emergency response: Level 1 (minor) resolved by on-site paramedics. Level 2 (moderate) requires ambulance dispatch. Level 3 (critical) activates full emergency protocol. All medical events must be logged within 2 minutes. Nearest medical post dispatches first responder immediately. CPR-trained volunteers are positioned in every zone.`,
    keywords: ["medical", "emergency", "ambulance", "paramedic", "first aid", "collapse"],
  },
  {
    id: "fifa-crowd-management",
    title: "FIFA Crowd Management Protocol  Sec.7",
    content: `When gate occupancy exceeds 85%, the following actions are mandatory:
    1. Open alternative gates
    2. Deploy additional volunteers to congestion points
    3. Activate digital signage for rerouting
    4. PA announcements every 30 seconds
    5. Monitor for 15 minutes post-intervention
    If occupancy reaches 95%, initiate full crowd redistribution plan.
    Critical threshold: 100% occupancy requires immediate evacuation protocol.`,
    keywords: ["crowd", "gate", "congestion", "capacity", "occupancy", "redistribution"],
  },
  {
    id: "fifa-weather-response",
    title: "FIFA Weather Emergency Response Plan",
    content: `Severe weather protocol: Upon detection of heavy rain, lightning, or high winds within 5km of stadium:
    1. Activate covered area shelters (Gates C, D, concourse level)
    2. Halt outdoor activities
    3. Direct fans to indoor areas
    4. Deploy weather response volunteers (minimum 12)
    5. Secure all loose equipment
    6. Monitor weather radar every 2 minutes
    7. Prepare for potential evacuation if conditions worsen`,
    keywords: ["rain", "weather", "storm", "lightning", "wind", "shelter", "evacuation"],
  },
  {
    id: "fifa-transport-guide",
    title: "FIFA Transport & Parking Guide",
    content: `Stadium parking capacity: 6000 vehicles across 3 lots. Parking A (2000) reserved for VIP and media. Parking B (1500) general admission. Parking C (2500) overflow. Shuttle buses run every 5 minutes from lots to gates. Metro stations East and West connect to major transit lines. Bus terminal handles 50 buses/hour. Accessible parking available at all lots.`,
    keywords: ["parking", "transport", "metro", "bus", "shuttle", "traffic"],
  },
  {
    id: "fifa-accessibility",
    title: "FIFA Accessibility Guidelines",
    content: `Accessibility services: Wheelchair ramps at all gates. Elevators at Zones 1, 2, 4. Accessible seating in all sections. Service animals welcome. Audio description headsets available at information booths. Sign language interpreters on request. Accessible parking in all lots. Wheelchair-friendly routes marked on all maps. Volunteers trained in accessibility assistance at every zone.`,
    keywords: ["wheelchair", "accessible", "disability", "ramp", "elevator", "sign language"],
  },
  {
    id: "fifa-volunteer-manual",
    title: "FIFA Volunteer Response Manual  Sec.5",
    content: `Volunteer deployment: Minimum 2 volunteers per gate during peak hours. Rapid response teams (4 persons) positioned at each zone. All volunteers must have radio communication. Incident reporting via mobile app within 1 minute. Volunteer shifts: 4 hours with 30-minute break. Language support: each zone must have at least one bilingual volunteer. Emergency training: all volunteers complete basic first aid.`,
    keywords: ["volunteer", "deployment", "response", "team", "radio", "first aid"],
  },
];

export const PROMPTS = {
  rag: `You are ArenaMind AI's Policy Agent. Based on the following FIFA documents, answer the stadium operations query.
Documents: {documents}
Query: {query}
Response:`,
};

export async function searchRelevantDocs(query) {
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(/\s+/).filter((w) => w.length > 2);

  const scored = documentStore.map((doc) => {
    const keywordMatches = doc.keywords.filter((k) => queryLower.includes(k.toLowerCase())).length;
    const contentMatches = keywords.filter((k) => doc.content.toLowerCase().includes(k)).length;
    return { doc, score: keywordMatches * 3 + contentMatches };
  });

  const sorted = scored.sort((a, b) => b.score - a.score);
  const top = sorted.filter((s) => s.score > 0).slice(0, 3);

  if (top.length === 0) {
    return [documentStore[0]];
  }

  return top.map((s) => s.doc);
}

export async function generateGroundedResponse(query) {
  const docs = await searchRelevantDocs(query);
  const docTexts = docs.map((d) => `[${d.title}]: ${d.content}`).join("\n\n");

  const prompt = PROMPTS.rag
    .replace("{documents}", docTexts)
    .replace("{query}", query);

  const { generateResponse } = await import("../config/gemini.js");
  return await generateResponse(prompt);
}

export function getDocumentCount() {
  return documentStore.length;
}
