import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import copilotRoutes from "./routes/copilot.js";
import missionControlRoutes from "./routes/mission-control.js";
import incidentRoutes from "./routes/incident.js";
import demoRoutes from "./routes/demo.js";
import { startSimulation, getStadiumStatus, subscribeToUpdates } from "./services/stadiumService.js";
import { getOnlineAgentCount, agents } from "./ai/agents.js";
import { missionEngine } from "./ai/missionEngine.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const isProduction = process.env.NODE_ENV === "production";

const io = new Server(httpServer, {
  cors: {
    origin: isProduction ? "*" : CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: isProduction ? "*" : CLIENT_URL }));
app.use(express.json());

app.use("/api/copilot", copilotRoutes);
app.use("/api/mission-control", missionControlRoutes);
app.use("/api/incident", incidentRoutes);
app.use("/api/demo", demoRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "operational",
    agents: getOnlineAgentCount(),
    version: "1.0.0",
    name: "ArenaMind AI - Mission Control",
  });
});

app.get("/api/agents", (req, res) => {
  res.json({
    agents: Object.values(agents).map((a) => ({
      id: a.id,
      name: a.name,
      icon: a.icon,
      status: a.status,
      capabilities: a.capabilities,
      lastActive: a.lastActive,
    })),
    online: getOnlineAgentCount(),
    total: Object.keys(agents).length,
  });
});

app.post("/api/briefing", async (req, res) => {
  try {
    const status = getStadiumStatus();
    const briefing = await missionEngine.generateBriefing({
      crowd: status,
      incidents: [],
      transport: {},
      weather: {},
      volunteers: { active: 24, standby: 12 },
    });
    res.json({
      ...briefing,
      generatedAt: new Date().toISOString(),
      stadiumName: "ArenaMind Stadium",
    });
  } catch (error) {
    console.error("Briefing error:", error);
    res.status(500).json({ error: "Failed to generate briefing" });
  }
});

app.get("/api/kpi", (req, res) => {
  res.json({
    aiDecisionsToday: 47,
    incidentsResolved: 18,
    predictionAccuracy: 94,
    averageResponseSeconds: 38,
    activeAgents: getOnlineAgentCount(),
    stadiumOccupancy: getStadiumStatus().overallOccupancy,
  });
});

app.post("/api/mission-control/execute", async (req, res) => {
  try {
    const { plan, missionId } = req.body;
    if (!plan) return res.status(400).json({ error: "Plan description required" });

    const status = getStadiumStatus();
    const result = await missionEngine.runFullPipeline(plan);

    res.json({
      status: "executing",
      missionId: missionId || result.execution.missionId,
      plan,
      announcement: result.recommendation.announcement_text,
      tasks: (result.recommendation.tasks || []).map((t) => ({
        ...t,
        status: "in_progress",
        startedAt: new Date().toISOString(),
      })),
      volunteerCount: result.recommendation.volunteer_count,
      estimatedMinutes: result.recommendation.estimated_resolution_minutes,
      riskLevel: result.prediction.risk_level,
      confidence: result.prediction.confidence,
      agent: result.recommendation._agent,
      processingTime: result.processingTime,
      pipelineAgent: result._meta.pipelineAgent,
      aiSource: result._meta.source,
      timeline: [
        { event: "AI analyzed situation", time: "0.2s" },
        { event: "AI retrieved relevant policies", time: "0.5s" },
        { event: "AI generated response plan", time: "1.2s" },
        { event: "Plan execution started", time: "now" },
      ],
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Execute error:", error);
    res.status(500).json({ error: "Failed to execute plan" });
  }
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  try {
    socket.emit("stadium:update", getStadiumStatus());
  } catch (_) {}

  const unsubscribe = subscribeToUpdates((data) => {
    try {
      if (socket.connected) {
        socket.emit("stadium:update", data);
      }
    } catch (_) {}
  });

  socket.on("error", (err) => {
    console.error(`Socket error (${socket.id}): ${err.message}`);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    unsubscribe();
  });
});

if (isProduction) {
  const clientDist = path.join(__dirname, "../../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/socket.io")) return;
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

startSimulation(4000);

httpServer.on("error", (err) => {
  if (err.code === "ECONNABORTED") {
    console.error("Connection aborted:", err.message);
  } else {
    console.error("Server error:", err);
  }
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║     ArenaMind AI - Mission Control        ║
║     Status: OPERATIONAL                    ║
║     Port: ${PORT}                             ║
║     Agents Online: ${getOnlineAgentCount()}/${Object.keys(agents).length}                    ║
╚═══════════════════════════════════════════╝
  `);
});
