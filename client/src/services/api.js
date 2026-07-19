import mockData from './mockData';

const BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const MOCK_ROUTES = {
  '/agents': () => ({ agents: mockData.agents, online: 6 }),
  '/kpi': () => mockData.kpi,
  '/mission-control/status': () => ({ status: 'operational', mode: 'demo' }),
  '/mission-control/dashboard': () => mockData.dashboard,
  '/mission-control/crowd': () => mockData.dashboard.crowd,
  '/mission-control/transport': () => ({ transport: mockData.dashboard.transport, parking: mockData.dashboard.parking }),
  '/mission-control/weather': () => mockData.dashboard.weather,
  '/mission-control/incidents': () => ({ incidents: mockData.dashboard.securityIncidents }),
  '/mission-control/ai-insight': () => ({ insight: mockData.aiInsight }),
  '/mission-control/mission': () => ({ mission: mockData.mission }),
  '/mission-control/execute': () => ({ success: true }),
  '/copilot/chat': () => mockData.copilot,
  '/copilot/translate': () => mockData.translate,
  '/incident/report': () => mockData.incident,
  '/incident/resolve': () => ({ success: true }),
  '/demo/scenarios': () => mockData.demoScenarios,
  '/demo/run/': () => mockData.demoRun,
  '/demo/simulate': () => mockData.simulateRun,
  '/briefing': () => mockData.briefing,
  '/health': () => ({ status: 'ok', mode: 'demo' }),
};

async function request(url, options = {}) {
  try {
    const res = await fetch(`${BASE}${url}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  } catch {
    for (const [route, handler] of Object.entries(MOCK_ROUTES)) {
      if (url.startsWith(route)) return handler();
    }
    return { success: false, error: 'No mock data for this endpoint' };
  }
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
