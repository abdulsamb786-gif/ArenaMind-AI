import { Router } from "express";
import { missionEngine } from "../ai/missionEngine.js";
import { memory } from "../ai/memory.js";
import { stadium } from "../data/stadium.js";
import { getTranslation } from "../data/translations.js";
import { getStadiumStatus } from "../services/stadiumService.js";

const router = Router();

router.post("/chat", async (req, res) => {
  try {
    const { message, sessionId = "default", language = "en" } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const userMemory = memory.get(sessionId) || { language, history: [] };

    userMemory.language = language;
    userMemory.history.push({ role: "user", text: message, timestamp: new Date().toISOString() });

    if (message.toLowerCase().includes("seat") || message.toLowerCase().includes("sitting")) {
      const seatMatch = message.match(/[A-D]-?\d{3}/i);
      if (seatMatch) {
        const seatId = seatMatch[0].toUpperCase();
        memory.update(sessionId, "seat", seatId);
      }
    }

    const response = await missionEngine.copilotChat(message, userMemory, {
      stadium: getStadiumStatus(),
      seatLayout: stadium.seatLayout,
    });

    userMemory.history.push({ role: "ai", text: response.text, timestamp: new Date().toISOString() });
    memory.set(sessionId, userMemory);

    const translation = language !== "en" ? getTranslation(language, "welcome") : null;

    res.json({
      response: response.text,
      agent: response._agent,
      latency: `${response._latency}ms`,
      memory: { seat: userMemory.seat, language: userMemory.language },
      translation: translation ? { key: "welcome", translated: translation } : null,
    });
  } catch (error) {
    console.error("Copilot error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

router.get("/memory/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const data = memory.get(sessionId);
  res.json(data || {});
});

router.post("/translate", async (req, res) => {
  try {
    const { text, targetLang = "hi", sourceLang = "en" } = req.body;
    const { generateResponse } = await import("../config/gemini.js");
    const { PROMPTS } = await import("../ai/prompts.js");

    const prompt = PROMPTS.translate
      .replace("{source_lang}", sourceLang)
      .replace("{target_lang}", targetLang)
      .replace("{text}", text);

    const translated = await generateResponse(prompt);
    res.json({ original: text, translated, sourceLang, targetLang });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;
