import { Router } from "express";
import { missionEngine } from "../ai/missionEngine.js";
import {
  getStadiumStatus,
  getCrowdData,
  getTransportData,
  getWeatherData,
  getIncidents,
} from "../services/stadiumService.js";

const router = Router();

router.get("/status", (req, res) => {
  res.json(getStadiumStatus());
});

router.get("/crowd", (req, res) => {
  res.json(getCrowdData());
});

router.get("/transport", (req, res) => {
  res.json(getTransportData());
});

router.get("/weather", (req, res) => {
  res.json(getWeatherData());
});

router.get("/incidents", (req, res) => {
  res.json(getIncidents());
});

router.get("/dashboard", (req, res) => {
  res.json({
    status: getStadiumStatus(),
    crowd: getCrowdData(),
    transport: getTransportData(),
    weather: getWeatherData(),
    incidents: getIncidents(),
    timestamp: new Date().toISOString(),
  });
});

router.post("/ai-insight", async (req, res) => {
  try {
    const { type = "general" } = req.body;
    const status = getStadiumStatus();

    let insightPrompt = `Provide AI insight for stadium operations. Current status: Gate A at ${status.gates[0].currentOccupancy}% capacity. `;

    if (type === "crowd") {
      insightPrompt += `Generate operational insight about crowd distribution across ${status.gates.length} gates.`;
    } else if (type === "risk") {
      const criticalGates = status.gates.filter((g) => g.riskLevel === "critical");
      insightPrompt += criticalGates.length > 0
        ? `Risk assessment needed: ${criticalGates.length} gates at critical level.`
        : "Risk assessment: all gates within normal parameters.";
    } else if (type === "prediction") {
      insightPrompt += "Predict crowd movement patterns for the next 30 minutes.";
    }

    const { generateResponse } = await import("../config/gemini.js");
    const insight = await generateResponse(insightPrompt);

    res.json({
      type,
      insight,
      confidence: 92,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI insight error:", error);
    res.status(500).json({ error: "Failed to generate insight" });
  }
});

router.post("/mission", async (req, res) => {
  try {
    const { alert } = req.body;
    if (!alert) return res.status(400).json({ error: "Alert description required" });

    const status = getStadiumStatus();
    const mission = await missionEngine.generateMission(alert, status);

    res.json({
      mission,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Mission generation error:", error);
    res.status(500).json({ error: "Failed to generate mission" });
  }
});

export default router;
