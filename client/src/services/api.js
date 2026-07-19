const BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export const api = {
  health: () => request('/health'),
  agents: () => request('/agents'),
  kpi: () => request('/kpi'),

  stadium: {
    status: () => request('/mission-control/status'),
    dashboard: () => request('/mission-control/dashboard'),
    crowd: () => request('/mission-control/crowd'),
    transport: () => request('/mission-control/transport'),
    weather: () => request('/mission-control/weather'),
    incidents: () => request('/mission-control/incidents'),
    aiInsight: (type) => request('/mission-control/ai-insight', { method: 'POST', body: JSON.stringify({ type }) }),
    mission: (alert) => request('/mission-control/mission', { method: 'POST', body: JSON.stringify({ alert }) }),
    execute: (plan) => request('/mission-control/execute', { method: 'POST', body: JSON.stringify({ plan }) }),
  },

  copilot: {
    chat: (message, sessionId, language) =>
      request('/copilot/chat', { method: 'POST', body: JSON.stringify({ message, sessionId, language }) }),
    translate: (text, targetLang) =>
      request('/copilot/translate', { method: 'POST', body: JSON.stringify({ text, targetLang }) }),
  },

  incident: {
    report: (description, location) =>
      request('/incident/report', { method: 'POST', body: JSON.stringify({ description, location }) }),
    resolve: (incidentId) =>
      request('/incident/resolve', { method: 'POST', body: JSON.stringify({ incidentId }) }),
  },

  demo: {
    scenarios: () => request('/demo/scenarios'),
    run: (scenarioId) => request(`/demo/run/${scenarioId}`, { method: 'POST' }),
    simulate: (scenarioType) =>
      request('/demo/simulate', { method: 'POST', body: JSON.stringify({ scenarioType }) }),
  },

  briefing: () => request('/briefing', { method: 'POST' }),
};
