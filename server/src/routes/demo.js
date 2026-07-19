import { Router } from "express";
import { demoScenarios } from "../data/scenarios.js";
import { missionEngine } from "../ai/missionEngine.js";
import { simulateScenario } from "../services/simulationService.js";
import { getStadiumStatus } from "../services/stadiumService.js";

const router = Router();

router.get("/scenarios", (req, res) => {
  res.json({
    scenarios: demoScenarios.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
    })),
    total: demoScenarios.length,
  });
});

router.post("/run/:scenarioId", async (req, res) => {
  try {
    const { scenarioId } = req.params;
    const scenario = demoScenarios.find((s) => s.id === scenarioId);

    if (!scenario) {
      return res.status(404).json({ error: "Scenario not found" });
    }

    let result;

    if (scenario.trigger.type === "incident") {
      const pipeline = await missionEngine.runFullPipeline(scenario.trigger.input);

      result = {
        scenario: scenario.title,
        description: scenario.description,
        type: "incident",
        agentsActivated: [
          { name: "Incident Response Agent", agent: pipeline.understanding._agent, status: "activated", durationMs: pipeline.understanding._latency },
          { name: "Policy Agent", agent: pipeline.prediction._agent, status: "activated", durationMs: pipeline.prediction._latency },
          { name: "Decision Agent", agent: pipeline.recommendation._agent, status: "activated", durationMs: pipeline.recommendation._latency },
          { name: "Mission Control Agent", agent: pipeline.execution._agent, status: "activated", durationMs: pipeline.execution._latency },
        ],
        understanding: { ...pipeline.understanding, _agent: undefined, _latency: undefined },
        policiesRetrieved: pipeline.policies.map((p) => p.title || p),
        prediction: {
          impact: pipeline.prediction.predicted_impact,
          riskScore: pipeline.prediction.risk_score,
          riskLevel: pipeline.prediction.risk_level,
          confidence: pipeline.prediction.confidence,
          affectedFans: pipeline.prediction.affected_fans,
          agent: pipeline.prediction._agent,
        },
        recommendation: {
          primaryAction: pipeline.recommendation.recommendation,
          tasks: pipeline.recommendation.tasks,
          volunteerCount: pipeline.recommendation.volunteer_count,
          estimatedTime: pipeline.recommendation.estimated_resolution_minutes,
          mission: pipeline.recommendation.mission,
          agent: pipeline.recommendation._agent,
        },
        explanation: {
          why: pipeline.explanation.primary_reason,
          factors: pipeline.explanation.supporting_factors,
          agent: pipeline.explanation._agent,
        },
        announcement: pipeline.recommendation.announcement_text,
        missionId: pipeline.execution.missionId,
        processingTime: pipeline.processingTime,
        pipelineAgent: pipeline._meta.pipelineAgent,
        aiSource: pipeline._meta.source,
        timeline: pipeline.timeline.map((t) => ({
          step: t.step,
          durationMs: t.durationMs,
          agent: t.agent,
          model: t.model,
        })),
      };
    } else if (scenario.trigger.type === "weather" || scenario.trigger.type === "congestion" || scenario.trigger.type === "transport") {
      const mission = await missionEngine.generateMission(scenario.trigger.input, getStadiumStatus());

      result = {
        scenario: scenario.title,
        description: scenario.description,
        type: "mission",
        agentsActivated: [
          { name: "Crowd Intelligence Agent", status: "activated", durationMs: mission._latency || 300 },
          { name: "Mission Control Agent", status: "activated", agent: mission._agent, durationMs: mission._latency || 800 },
          { name: "Decision Agent", status: "activated", durationMs: mission._latency ? mission._latency + 200 : 1500 },
        ],
        mission: { ...mission, _agent: undefined, _latency: undefined },
        processingTime: {
          totalMs: (mission._latency || 2000) + 500,
          totalSeconds: (((mission._latency || 2000) + 500) / 1000).toFixed(2),
        },
        aiSource: mission._agent?.source || "Simulated AI",
      };
    }

    result.kpi = {
      aiDecisionsToday: 47 + Math.floor(Math.random() * 5),
      incidentsResolved: 18 + Math.floor(Math.random() * 3),
      predictionAccuracy: 94,
      averageResponseSeconds: 38,
    };

    res.json(result);
  } catch (error) {
    console.error("Demo scenario error:", error);
    res.status(500).json({ error: "Failed to run scenario" });
  }
});

router.post("/simulate", async (req, res) => {
  try {
    const { scenarioType = "close-gate-a" } = req.body;
    const simulation = simulateScenario(scenarioType);
    res.json(simulation);
  } catch (error) {
    console.error("Simulation error:", error);
    res.status(500).json({ error: "Simulation failed" });
  }
});

export default router;
