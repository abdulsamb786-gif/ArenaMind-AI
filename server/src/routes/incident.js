import { Router } from "express";
import { missionEngine } from "../ai/missionEngine.js";
import { getStadiumStatus } from "../services/stadiumService.js";

const router = Router();

router.post("/report", async (req, res) => {
  try {
    const { description, reporter = "anonymous", location } = req.body;
    if (!description) return res.status(400).json({ error: "Incident description required" });

    const input = location ? `${description} Location: ${location}` : description;

    const pipeline = await missionEngine.runFullPipeline(input);

    res.json({
      incidentId: pipeline.execution.missionId,
      summary: pipeline.understanding.summary,
      category: pipeline.understanding.category,
      severity: pipeline.prediction.risk_level,
      priorityScore: pipeline.understanding.priority_score,
      confidence: pipeline.prediction.confidence,
      ragPolicies: (pipeline.policies || []).map((p) => ({
        title: p.title || p,
        source: p.title ? "FIFA Document Store" : "Policy Agent",
      })),
      prediction: {
        impact: pipeline.prediction.predicted_impact,
        timeToCritical: pipeline.prediction.time_to_critical,
        affectedFans: pipeline.prediction.affected_fans,
        riskScore: pipeline.prediction.risk_score,
      },
      recommendation: {
        action: pipeline.recommendation.recommendation,
        alternative: pipeline.recommendation.alternative,
        volunteerCount: pipeline.recommendation.volunteer_count,
        estimatedResolutionMinutes: pipeline.recommendation.estimated_resolution_minutes,
        tasks: pipeline.recommendation.tasks,
        mission: pipeline.recommendation.mission || null,
      },
      explanation: {
        primaryReason: pipeline.explanation.primary_reason,
        supportingFactors: pipeline.explanation.supporting_factors,
        whatIfNot: pipeline.explanation.what_happens_if_not,
        confidenceBreakdown: pipeline.explanation.confidence_breakdown,
      },
      announcement: pipeline.recommendation.announcement_text,
      safetyNotes: pipeline.recommendation.safety_notes,
      timeline: pipeline.timeline.map((t) => ({
        step: t.step,
        status: t.status,
        durationMs: t.durationMs,
        agent: t.agent,
        model: t.model,
      })),
      processingTime: pipeline.processingTime,
      pipelineAgent: pipeline._meta.pipelineAgent,
      pipelineModel: pipeline._meta.pipelineModel,
      aiSource: pipeline._meta.source,
      source: "ArenaMind AI",
    });
  } catch (error) {
    console.error("Incident processing error:", error);
    res.status(500).json({ error: "Failed to process incident" });
  }
});

router.post("/resolve", async (req, res) => {
  try {
    const { incidentId } = req.body;
    res.json({
      incidentId,
      status: "resolved",
      resolvedAt: new Date().toISOString(),
      summary: "Incident resolved. All teams stood down.",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to resolve incident" });
  }
});

export default router;
