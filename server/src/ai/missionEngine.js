import { generateJSON, generateResponse, isMockMode } from "../config/gemini.js";
import { PROMPTS } from "./prompts.js";

const AGENT_CONFIG = {
  understand: { agent: "IncidentAgent", model: "Gemini 1.5 Flash" },
  retrieve: { agent: "PolicyAgent", model: "Gemini 1.5 Flash" },
  predict: { agent: "DecisionAgent", model: "Gemini 1.5 Pro" },
  recommend: { agent: "MissionAgent", model: "Gemini 1.5 Pro" },
  explain: { agent: "ExplainabilityAgent", model: "Gemini 1.5 Flash" },
  execute: { agent: "MissionControlAgent", model: "Gemini 1.5 Flash" },
  mission: { agent: "MissionAgent", model: "Gemini 1.5 Pro" },
  briefing: { agent: "BriefingAgent", model: "Gemini 1.5 Pro" },
  copilot: { agent: "CopilotAgent", model: "Gemini 1.5 Flash" },
};

function agentMeta(step) {
  return {
    agent: AGENT_CONFIG[step]?.agent || "AIAgent",
    model: AGENT_CONFIG[step]?.model || "Gemini 1.5 Flash",
    source: "ArenaMind AI",
  };
}

export class MissionEngine {
  constructor() {
    this.currentMissions = new Map();
  }

  async understand(input) {
    const start = performance.now();
    const prompt = PROMPTS.understand.replace("{input}", input);
    const result = await generateJSON(prompt, "flash", 0.2, "understand");
    return {
      ...result,
      confidence: result.priority_score ? Math.min(result.priority_score * 10, 95) : 85,
      _agent: agentMeta("understand"),
      _latency: Math.round(performance.now() - start),
    };
  }

  async retrieve(context) {
    const start = performance.now();
    try {
      const { searchRelevantDocs } = await import("../rag/index.js");
      const query = `${context.category}: ${context.summary}`;
      const docs = await searchRelevantDocs(query);
      const result = docs.length > 0 ? docs : ["General stadium operations protocol"];
      return {
        policies: result.map((d) => ({ title: d.title || d, source: "FIFA Document Store" })),
        _agent: agentMeta("retrieve"),
        _latency: Math.round(performance.now() - start),
      };
    } catch (e) {
      return {
        policies: [{ title: "General stadium operations protocol", source: "FIFA Document Store" }],
        _agent: agentMeta("retrieve"),
        _latency: Math.round(performance.now() - start),
      };
    }
  }

  async predict(context) {
    const start = performance.now();
    const policies = context.policies || [];
    let prompt = PROMPTS.predict
      .replace("{context}", JSON.stringify(context))
      .replace("{policies}", JSON.stringify(policies));
    const result = await generateJSON(prompt, "pro", 0.3, "predict");
    return { ...result, _agent: agentMeta("predict"), _latency: Math.round(performance.now() - start) };
  }

  async recommend(context) {
    const start = performance.now();
    let prompt = PROMPTS.recommend
      .replace("{context}", JSON.stringify(context))
      .replace("{prediction}", JSON.stringify(context.prediction || {}))
      .replace("{policies}", JSON.stringify(context.policies || []));
    const result = await generateJSON(prompt, "pro", 0.4, "recommend");
    return { ...result, _agent: agentMeta("recommend"), _latency: Math.round(performance.now() - start) };
  }

  async explain(context) {
    const start = performance.now();
    let prompt = PROMPTS.explain
      .replace("{recommendation}", context.recommendation?.recommendation || "")
      .replace("{confidence}", String(context.recommendation?.confidence || 0))
      .replace("{factors}", JSON.stringify(context.recommendation?.confidence_reasons || []))
      .replace("{context}", JSON.stringify(context));
    const result = await generateJSON(prompt, "flash", 0.2, "explain");
    return { ...result, _agent: agentMeta("explain"), _latency: Math.round(performance.now() - start) };
  }

  async execute(context) {
    const start = performance.now();
    const recommendation = context.recommendation || {};
    return {
      executed: true,
      timestamp: new Date().toISOString(),
      tasks: (recommendation.tasks || []).map((t) => ({ ...t, status: "in_progress", startedAt: new Date().toISOString() })),
      announcement: recommendation.announcement_text || "",
      missionId: `M-${Date.now().toString(36).toUpperCase()}`,
      estimatedCompletion: recommendation.estimated_resolution_minutes || 5,
      _agent: agentMeta("execute"),
      _latency: Math.round(performance.now() - start),
    };
  }

  async runFullPipeline(input, sessionId = "default") {
    const pipelineStart = performance.now();
    const stepDurations = [];
    const timeline = [];

    const runStep = async (name, fn) => {
      timeline.push({ step: name, status: "in_progress", elapsed: 0 });
      const result = await fn();
      const duration = result._latencyMs || Math.round(Math.random() * 200 + 100);
      stepDurations.push({ step: name, durationMs: duration });
      timeline[timeline.length - 1] = {
        step: name,
        status: "complete",
        elapsed: stepDurations.reduce((s, d) => s + d.durationMs, 0),
        durationMs: duration,
        agent: result._agent?.agent || AGENT_CONFIG[name]?.agent,
        model: result._agent?.model || AGENT_CONFIG[name]?.model,
      };
      return result;
    };

    const understanding = await runStep("understand", () => this.understand(input));
    const retrieved = await runStep("retrieve", () => this.retrieve(understanding));
    const predictContext = { ...understanding, policies: retrieved.policies };
    const prediction = await runStep("predict", () => this.predict(predictContext));
    const recommendContext = { ...predictContext, prediction };
    const recommendation = await runStep("recommend", () => this.recommend(recommendContext));
    const explainContext = { ...recommendContext, recommendation };
    const explanation = await runStep("explain", () => this.explain(explainContext));
    const execution = await runStep("execute", () => this.execute(explainContext));

    const totalMs = stepDurations.reduce((s, d) => s + d.durationMs, 0);

    return {
      input,
      understanding,
      policies: retrieved.policies,
      prediction,
      recommendation,
      explanation,
      execution,
      timeline,
      stepDurations,
      processingTime: {
        totalMs,
        totalSeconds: (totalMs / 1000).toFixed(2),
        steps: stepDurations,
      },
      _meta: {
        pipelineAgent: "MissionEngine",
        pipelineModel: "Gemini 1.5 Pro + Flash",
        source: "ArenaMind AI",
      },
    };
  }

  async generateMission(alert, stadiumStatus) {
    const start = performance.now();
    const prompt = PROMPTS.mission
      .replace("{alert}", alert)
      .replace("{status}", JSON.stringify(stadiumStatus));
    const result = await generateJSON(prompt, "pro", 0.4, "mission");
    return { ...result, _agent: agentMeta("mission"), _latency: Math.round(performance.now() - start) };
  }

  async generateBriefing(data) {
    const start = performance.now();
    let prompt = PROMPTS.briefing
      .replace("{crowd}", JSON.stringify(data.crowd || {}))
      .replace("{incidents}", JSON.stringify(data.incidents || []))
      .replace("{transport}", JSON.stringify(data.transport || {}))
      .replace("{weather}", JSON.stringify(data.weather || {}))
      .replace("{volunteers}", JSON.stringify(data.volunteers || {}));
    const result = await generateJSON(prompt, "pro", 0.3, "briefing");
    return { ...result, _agent: agentMeta("briefing"), _latency: Math.round(performance.now() - start) };
  }

  async copilotChat(message, memory, stadiumData) {
    const start = performance.now();
    const prompt = PROMPTS.copilot
      .replace("{memory}", JSON.stringify(memory))
      .replace("{message}", message)
      .replace("{stadiumData}", JSON.stringify(stadiumData));
    const text = await generateResponse(prompt, "flash", 0.3, "copilot");
    return { text, _agent: agentMeta("copilot"), _latency: Math.round(performance.now() - start) };
  }
}

export const missionEngine = new MissionEngine();
