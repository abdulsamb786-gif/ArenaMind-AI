import { create } from 'zustand';

const useStore = create((set, get) => ({
  stadium: null,
  agents: [],
  kpi: { aiDecisionsToday: 47, incidentsResolved: 18, predictionAccuracy: 94, averageResponseSeconds: 38 },
  timeline: [],
  briefing: null,
  mission: null,
  loading: { stadium: false, briefing: false, mission: false },
  error: null,

  setStadium: (data) => set({ stadium: data }),
  setAgents: (agents) => set({ agents }),
  setKPI: (kpi) => set({ kpi }),
  addTimeline: (event) => set((s) => ({ timeline: [...s.timeline.slice(-49), event] })),
  setBriefing: (briefing) => set({ briefing }),
  setMission: (mission) => set({ mission }),
  setLoading: (key, val) => set((s) => ({ loading: { ...s.loading, [key]: val } })),
  setError: (error) => set({ error }),
}));

export default useStore;
