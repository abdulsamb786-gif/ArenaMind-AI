import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-key");

const models = {
  flash: genAI.getGenerativeModel({ model: "gemini-1.5-flash" }),
  pro: genAI.getGenerativeModel({ model: "gemini-1.5-pro" }),
};

let mockMode = true;

export function isMockMode() {
  return mockMode;
}

function cleanJSON(text) {
  let cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);
  return cleaned;
}

export async function generateResponse(prompt, modelType = "flash", temperature = 0.2, step = "") {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key-here") {
    return contextAwareMock(prompt, step);
  }

  mockMode = false;
  try {
    const model = models[modelType] || models.flash;
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature, topK: 40, topP: 0.95, maxOutputTokens: 2048 },
    });
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error.message);
    return contextAwareMock(prompt, step);
  }
}

export async function generateJSON(prompt, modelType = "flash", temperature = 0.2, step = "") {
  const text = await generateResponse(prompt, modelType, temperature, step);
  try {
    const cleaned = cleanJSON(text);
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON parse error:", e.message);
    return JSON.parse(contextAwareMock(prompt, step));
  }
}

function extractData(text) {
  const data = {};
  const gateMatch = text.match(/Gate\s*([A-D])\s*:?\s*(\d+)%/gi);
  if (gateMatch) data.gates = gateMatch.map(m => {
    const parts = m.match(/Gate\s*([A-D])[^0-9]*(\d+)/i);
    return parts ? { id: parts[1], occupancy: parseInt(parts[2]) } : null;
  }).filter(Boolean);

  const weatherMatch = text.match(/Weather\s*:?\s*([^.]+)/i);
  if (weatherMatch) data.weather = weatherMatch[1].trim();

  const crowdMatch = text.match(/(\d+)%\s*(capacity|occupancy)/i);
  if (crowdMatch) data.overallCrowd = parseInt(crowdMatch[1]);

  const parkMatch = text.match(/Parking\s*:?\s*(\d+)%/i);
  if (parkMatch) data.parking = parseInt(parkMatch[1]);

  const inputMatch = text.match(/child|crying|lost|missing/i);
  if (inputMatch) data.hasChildIncident = true;

  const medicalMatch = text.match(/medical|collapsed|unconscious|emergency/i);
  if (medicalMatch) data.hasMedical = true;

  const rainMatch = text.match(/rain|rainfall|storm|wet/i);
  if (rainMatch) data.hasRain = true;

  const seatMatch = text.match(/[A-D]-?\d{3}/i);
  if (seatMatch) data.seat = seatMatch[0].toUpperCase();

  const foodMatch = text.match(/food|eat|hungry|stall|restaurant/i);
  if (foodMatch) data.wantsFood = true;

  const transportMatch = text.match(/metro|bus|train|delay|disrupt/i);
  if (transportMatch) data.hasTransportIssue = true;

  return data;
}

function addLatency(result, stepName) {
  const latencyMap = {
    understand: 350, retrieve: 180, predict: 420, recommend: 600,
    explain: 250, execute: 120, mission: 500, briefing: 800, copilot: 400, translate: 300,
  };
  return { ...result, _latencyMs: latencyMap[stepName] || 200, _step: stepName };
}

function contextAwareMock(prompt, step) {
  const ctx = extractData(prompt);
  const gateA = ctx.gates?.find(g => g.id === "A");
  const gateAocc = gateA?.occupancy || 92;
  const t = (ms) => addLatency(ms, step);

  if (step === "understand") {
    let category = "general", severity = "low", score = 3;
    if (ctx.hasChildIncident) { category = "incident"; severity = "high"; score = 8; }
    else if (ctx.hasMedical) { category = "emergency"; severity = "critical"; score = 10; }
    else if (ctx.hasRain) { category = "weather"; severity = "high"; score = 7; }
    else if (gateAocc > 80) { category = "congestion"; severity = "medium"; score = 6; }
    else if (ctx.hasTransportIssue) { category = "transport"; severity = "medium"; score = 5; }
    else if (ctx.wantsFood) { category = "food"; severity = "low"; score = 2; }
    else if (ctx.seat) { category = "navigation"; severity = "low"; score = 1; }

    return JSON.stringify(t({
      category,
      severity,
      entities: {
        people: ctx.hasChildIncident ? ["child", "parent"] : ctx.hasMedical ? ["fan"] : [],
        locations: ctx.seat ? [ctx.seat] : [gateA ? `Gate ${gateA.id}` : "Stadium"],
        descriptions: [prompt.split(".")[0]?.slice(0, 80) || "Event detected"],
      },
      summary: ctx.hasChildIncident ? "Lost child reported near Gate B" :
               ctx.hasMedical ? "Medical emergency - fan collapsed in seating area" :
               ctx.hasRain ? "Adverse weather conditions detected" :
               gateAocc > 80 ? `Gate ${gateA?.id || "A"} congestion detected at ${gateAocc}%` :
               ctx.hasTransportIssue ? "Transport disruption affecting arrivals" :
               ctx.wantsFood ? "Food recommendation requested" :
               ctx.seat ? "Seat navigation requested" : "Stadium event detected",
      priority_score: score,
      confidence: Math.min(score * 10 + 10, 95),
    }));
  }

  if (step === "predict") {
    const level = gateAocc > 90 ? "critical" : gateAocc > 70 ? "high" : "medium";
    const riskScore = Math.min(95, gateAocc + (ctx.hasRain ? 15 : 0) + (ctx.hasMedical ? 20 : 0));
    return JSON.stringify(t({
      predicted_impact: ctx.hasMedical ? "Medical situation requires immediate response. Fan condition may deteriorate without rapid intervention." :
                         ctx.hasChildIncident ? "Situation will escalate if not addressed within 12 minutes. Parental distress may cause crowd disturbance." :
                         ctx.hasRain ? "14,000 fans in uncovered zones at risk of exposure. Potential crowd movement to covered areas." :
                         `Gate ${gateA?.id || "A"} to reach 100% capacity within 10 minutes. Bottleneck expected.`,
      time_to_critical: ctx.hasMedical ? 5 : ctx.hasChildIncident ? 12 : ctx.hasRain ? 8 : 10,
      affected_fans: ctx.hasMedical ? 20 : ctx.hasChildIncident ? 50 : ctx.hasRain ? 14000 : Math.round(gateAocc * 200),
      risk_score: riskScore,
      risk_level: level,
      confidence: Math.min(96, 82 + (ctx.hasMedical ? 8 : 0) + (ctx.hasChildIncident ? 6 : 0)),
      factors: [
        ctx.hasMedical ? "Medical emergencies require immediate response" : `Gate ${gateA?.id || "A"} occupancy at ${gateAocc}%`,
        ctx.hasRain ? "Weather conditions deteriorating rapidly" : "Peak inflow expected within 10 minutes",
        "Historical pattern indicates escalation risk",
      ],
    }));
  }

  if (step === "recommend") {
    const altGate = ctx.gates?.find(g => g.id !== "A" && g.occupancy < 70);
    const tasks = [];
    const safetyNotes = [];

    if (ctx.hasMedical) {
      tasks.push({ action: "Dispatch nearest medical team to location", assignee: "Medical Unit 1", location: "Zone 2", status: "pending" });
      tasks.push({ action: "Clear emergency corridor", assignee: "Security Team", location: "Zone 2 corridor", status: "pending" });
      tasks.push({ action: "Prepare ambulance access at Gate D", assignee: "Transport Team", location: "Gate D", status: "pending" });
      safetyNotes.push("Do not move the patient until paramedics arrive", "Keep bystanders at least 5 meters away");
    } else if (ctx.hasChildIncident) {
      tasks.push({ action: "Secure child at nearest help desk", assignee: "Security Team 2", location: "Gate B", status: "pending" });
      tasks.push({ action: "Broadcast child description to all volunteers", assignee: "Command Center", location: "All zones", status: "pending" });
      tasks.push({ action: "Guide parents to child-safe zone", assignee: "Volunteer Team 1", location: "Gate B help desk", status: "pending" });
      safetyNotes.push("Verify parent identity before releasing child", "Keep child calm with trained volunteer");
    } else if (ctx.hasRain) {
      tasks.push({ action: "Open covered gates (C, D)", priority: "high", assignee: "volunteer", location: "Gate C, Gate D", status: "pending" });
      tasks.push({ action: "Deploy umbrella distribution", priority: "medium", assignee: "volunteer", location: "Zone 2, Zone 3", status: "pending" });
      tasks.push({ action: "Move medical unit to indoor post", priority: "high", assignee: "medical", location: "Zone 4 Indoor", status: "pending" });
      safetyNotes.push("Avoid open areas", "Follow volunteer directions to covered zones");
    } else {
      tasks.push({ action: `Direct crowd to Gate ${altGate?.id || "C"}`, assignee: "Volunteer Team 3", location: `Gate ${gateA?.id || "A"}`, status: "pending" });
      tasks.push({ action: "Activate PA announcement", assignee: "Command Center", location: "All zones", status: "pending" });
      tasks.push({ action: "Deploy signage team", assignee: "Volunteer Team 1", location: `${gateA?.id || "A"} corridor`, status: "pending" });
      safetyNotes.push("Keep pathways clear", "Follow volunteer directions");
    }

    const conf = Math.max(88, 100 - (ctx.hasRain ? 8 : 0));
    return JSON.stringify(t({
      recommendation: ctx.hasMedical ? "Activate Code Blue - Dispatch medical team immediately" :
                      ctx.hasChildIncident ? "Activate Lost Child Protocol - Secure and locate parents" :
                      ctx.hasRain ? "Activate Weather Emergency Response Plan" :
                      `Open Gate ${altGate?.id || "C"} for exit flow`,
      alternative: ctx.hasMedical ? "Activate backup medical team from Zone 4" :
                   ctx.hasChildIncident ? "Escalate to FIFA child safety team" :
                   ctx.hasRain ? "Begin partial evacuation if rain intensifies" :
                   "Activate overflow queue at Gate D",
      confidence: conf,
      confidence_reasons: [
        ctx.hasMedical ? "Medical team within 90m of incident" : `Gate ${gateA?.id || "A"} at ${gateAocc}% capacity`,
        "Response protocol aligned with FIFA guidelines",
        ctx.hasRain ? "Covered shelters within 50m of all zones" : `Gate ${altGate?.id || "C"} at ${altGate?.occupancy || 40}% capacity`,
      ],
      volunteer_count: ctx.hasMedical ? 4 : ctx.hasChildIncident ? 3 : ctx.hasRain ? 12 : 6,
      estimated_resolution_minutes: ctx.hasMedical ? 15 : ctx.hasChildIncident ? 8 : ctx.hasRain ? 8 : 5,
      priority: ctx.hasMedical ? "critical" : gateAocc > 85 ? "high" : "medium",
      tasks,
      mission: {
        name: ctx.hasMedical ? "Medical Emergency Response" :
              ctx.hasChildIncident ? "Lost Child Recovery" :
              ctx.hasRain ? "Heavy Rain Response" :
              `Gate ${gateA?.id || "A"} Congestion Relief`,
        impact: ctx.hasMedical ? "Fan requires urgent medical attention" :
                ctx.hasChildIncident ? "Child safety and parent distress" :
                ctx.hasRain ? "14,000 fans in uncovered areas" :
                `${Math.round(gateAocc * 200)} fans affected by congestion`,
        risk_level: ctx.hasMedical ? "critical" : gateAocc > 85 ? "high" : "medium",
        eta_minutes: ctx.hasMedical ? 15 : ctx.hasChildIncident ? 8 : ctx.hasRain ? 8 : 5,
      },
      announcement_text: ctx.hasMedical ? "ATTENTION: Medical emergency in progress. Medical team is responding. Please clear the area and follow volunteer instructions." :
                         ctx.hasChildIncident ? "ATTENTION: A child has been found near the information desk. If you are looking for a child, please proceed to the nearest help desk." :
                         ctx.hasRain ? "ATTENTION FANS: Heavy rainfall detected. Please move to covered areas. Gates C and D are open for shelter. Volunteers in yellow jackets will guide you." :
                         `ATTENTION: Gate ${gateA?.id || "A"} is experiencing high volume. Please use Gate ${altGate?.id || "C"} for faster entry. Thank you.`,
      safety_notes: safetyNotes,
    }));
  }

  if (step === "explain") {
    return JSON.stringify(t({
      primary_reason: ctx.hasChildIncident ? "Child distress keywords matched FIFA Lost Child Protocol. Immediate response required to ensure child safety and prevent crowd disturbance." :
                      ctx.hasMedical ? "Medical emergency detected. Rapid response critical for patient survival." :
                      ctx.hasRain ? "Adverse weather threatens 14,000 fans in uncovered zones. Proactive shelter activation required." :
                      `Gate ${gateA?.id || "A"} has exceeded 90% capacity with peak inflow expected in 10 minutes`,
      supporting_factors: [
        { factor: ctx.hasChildIncident ? "Child detected in high-traffic area near Gate B" : `Gate ${gateA?.id || "A"} occupancy at critical ${gateAocc}%`, status: "positive" },
        { factor: ctx.hasMedical ? "Medical team available within 90m" : "Historical pattern shows peak inflow within 10 minutes", status: "positive" },
        { factor: ctx.hasRain ? "Covered shelters available at Gates C and D" : "Weather conditions stable for rerouting", status: "positive" },
        { factor: "Volunteer teams positioned for rapid deployment", status: "positive" },
      ],
      what_happens_if_not: ctx.hasChildIncident ? "Child may wander further. Parent panic may escalate to crowd disturbance within 12 minutes." :
                           ctx.hasMedical ? "Patient condition may deteriorate. Critical window for intervention is 5 minutes." :
                           ctx.hasRain ? "14,000 fans exposed to weather. Potential health risks and crowd chaos." :
                           `Gate ${gateA?.id || "A"} will reach 100% capacity within 12 minutes, causing bottleneck and potential safety risk`,
      confidence_breakdown: { data_quality: 95, pattern_match: 92, historical_accuracy: 88 },
    }));
  }

  if (step === "copilot") {
    if (ctx.seat && ctx.wantsFood) {
      return `Based on your seat at ${ctx.seat}, your nearest food court is Stall 1 in the Grand Stand zone - just 40 meters away. They have vegetarian and non-vegetarian options. Would you like me to guide you there?`;
    }
    if (ctx.seat) {
      return `Your seat ${ctx.seat} is located in Zone 2 (Grand Stand), Level 2, Row 10. Enter through Gate A and take the escalator to Level 2. Your nearest restroom is 25 meters to your left.`;
    }
    if (ctx.wantsFood) {
      return "The nearest open food court is Stall 1 in the Grand Stand zone with a 4-minute queue. Stall 3 in the West Wing also has available seating. What type of food are you looking for?";
    }
    return "Welcome to ArenaMind Stadium! I can help you with seat guidance, food recommendations, accessibility assistance, and emergency help. How can I assist you today?";
  }

  if (step === "mission") {
    return JSON.stringify(t({
      mission_name: ctx.hasRain ? "Heavy Rain Response" :
                    ctx.hasMedical ? "Medical Emergency Response" :
                    ctx.hasChildIncident ? "Lost Child Recovery" :
                    gateAocc > 85 ? `Gate ${gateA?.id || "A"} Congestion Relief` : "Operational Adjustment",
      impact_description: ctx.hasRain ? "14,000 fans in uncovered zones at risk of exposure" :
                          ctx.hasMedical ? "Fan requires immediate medical attention" :
                          ctx.hasChildIncident ? "Child safety and family distress" :
                          `${Math.round(gateAocc * 200)} fans affected by congestion`,
      estimated_affected_fans: ctx.hasRain ? 14000 : ctx.hasMedical ? 20 : ctx.hasChildIncident ? 50 : Math.round(gateAocc * 200),
      tasks: [
        { action: "Deploy response team", priority: "high", assignee_type: "volunteer", location: "Primary zone" },
        { action: "Activate communication protocol", priority: "high", assignee_type: "command", location: "All zones" },
        { action: "Monitor situation", priority: "medium", assignee_type: "security", location: "Perimeter" },
      ],
      volunteer_count_needed: ctx.hasMedical ? 4 : ctx.hasChildIncident ? 3 : ctx.hasRain ? 12 : 6,
      medical_units_needed: ctx.hasMedical ? 2 : 1,
      security_units_needed: ctx.hasMedical ? 2 : ctx.hasChildIncident ? 2 : 4,
      estimated_completion_minutes: ctx.hasMedical ? 15 : ctx.hasChildIncident ? 8 : ctx.hasRain ? 8 : 5,
      risk_level: ctx.hasMedical ? "critical" : gateAocc > 85 ? "high" : "medium",
      announcement: ctx.hasRain ? "Attention fans: Heavy rainfall detected. Please move to covered areas immediately." :
                    ctx.hasMedical ? "Medical emergency response in progress. Please clear the area." :
                    ctx.hasChildIncident ? "If you are looking for a child, please proceed to the nearest help desk." :
                    "Operational teams are responding. Please follow instructions from stadium volunteers.",
      safety_instructions: ["Remain calm", "Follow volunteer directions", "Keep walkways clear"],
    }));
  }

  if (step === "briefing") {
    return JSON.stringify(t({
      operational_status: gateAocc > 85 ? "elevated" : "normal",
      crowd_summary: `Stadium at ${Math.min(100, gateAocc)}% capacity. Gate ${gateA?.id || "A"} ${gateAocc > 85 ? "approaching critical levels" : "operating normally"}. Overall flow manageable with monitoring.`,
      security_summary: "No security threats detected. All checkpoints operational and staffed.",
      medical_summary: ctx.hasMedical ? "Medical emergency in progress. Resources deployed and responding." : "All medical posts staffed. No significant incidents reported.",
      volunteer_summary: "24 volunteers active. 6 deployed to gates. 12 on standby. 2 assigned to accessibility support.",
      transport_summary: ctx.hasTransportIssue ? "Metro East line experiencing delays. Parking C available with 400 spots." : "All transport hubs operating within normal parameters.",
      key_risks: gateAocc > 85 ? [`Gate ${gateA?.id || "A"} congestion peak expected within 10 minutes`] : ["No immediate risks identified"],
      ai_recommendations: gateAocc > 85 ? [`Open Gate ${ctx.gates?.find(g => g.id !== "A" && g.occupancy < 70)?.id || "C"} for overflow`, "Deploy 4 additional volunteers to Gate A corridor"] : ["Continue standard monitoring operations"],
      next_hour_outlook: "Crowd levels expected to stabilize. Continue monitoring Gate A for next 20 minutes.",
      decisions_made_today: 47,
      incidents_resolved: 18,
      average_response_time: "38 seconds",
    }));
  }

  if (step === "translate") {
    const match = prompt.match(/Text:\s*(.+)/s);
    const text = match ? match[1].trim() : "Welcome to ArenaMind Stadium";
    return `Translated: ${text}`;
  }

  if (step === "retrieve") {
    const docs = [];
    if (ctx.hasChildIncident) docs.push("FIFA Lost and Found Protocol  Sec.3.2", "FIFA Child Safety Guidelines  Sec.2.1");
    if (ctx.hasMedical) docs.push("FIFA Medical Emergency Response Manual  Sec.4");
    if (ctx.hasRain) docs.push("FIFA Weather Emergency Response Plan");
    if (gateAocc > 80) docs.push("FIFA Crowd Management Protocol  Sec.7");
    if (docs.length === 0) docs.push("General Stadium Operations Guide");
    docs.push("FIFA Volunteer Response Manual  Sec.5");
    return JSON.stringify(docs);
  }

  return JSON.stringify({
    category: "general",
    severity: "low",
    summary: "Stadium event detected",
    confidence: 85,
    message: "Processed by ArenaMind AI",
  });
}
