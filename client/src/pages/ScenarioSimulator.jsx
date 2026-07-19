import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FlaskConical, AlertTriangle, Users, Clock, Shield, Activity } from 'lucide-react';
import GlassCard from '../components/Common/GlassCard';
import ActionBtn from '../components/AI/ActionBtn';
import { api } from '../services/api';

const SCENARIOS = [
  { id: 'lost-child', title: 'Lost Child', icon: '👶', desc: 'Child reported lost near Gate B' },
  { id: 'medical-emergency', title: 'Medical Emergency', icon: '🚑', desc: 'Fan collapsed in Grand Stand' },
  { id: 'heavy-rain', title: 'Heavy Rain', icon: '🌧️', desc: 'Sudden heavy rainfall, 14K fans at risk' },
  { id: 'gate-congestion', title: 'Gate Congestion', icon: '🚪', desc: 'Gate A at 92% capacity, rising' },
  { id: 'transport-delay', title: 'Transport Delay', icon: '🚇', desc: 'Metro disruption affecting 3K fans' },
];

const SIMULATIONS = [
  { id: 'close-gate-a', title: 'Close Gate A', icon: '🚧', desc: 'What happens if Gate A suddenly closes?' },
  { id: 'heavy-rain', title: 'Heavy Rain', icon: '🌧️', desc: 'What if heavy rain starts during match?' },
  { id: 'crowd-surge', title: 'Crowd Surge', icon: '📈', desc: 'What if 5000 fans arrive simultaneously?' },
];

export default function ScenarioSimulator() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('demo');

  const runScenario = async (id) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.demo.run(id);
      setResult(res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const runSimulation = async (id) => {
    setSimLoading(true);
    setSimResult(null);
    try {
      const res = await api.demo.simulate(id);
      setSimResult(res);
    } catch (e) {
      console.error(e);
    }
    setSimLoading(false);
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="glass-header px-6 py-4 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => navigate('/')} className="text-arena-muted hover:text-arena-text">
          <ArrowLeft size={20} />
        </button>
        <FlaskConical size={20} className="text-arena-accent2" />
        <span className="font-bold">AI Scenario Simulator</span>
      </header>

      <main className="px-6 max-w-7xl mx-auto mt-6 space-y-6">
        <div className="flex gap-2">
          {['demo', 'simulation'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm transition-all capitalize ${activeTab === tab ? 'bg-arena-accent/20 text-arena-accent border border-arena-accent/30' : 'text-arena-muted border border-transparent hover:border-arena-border'}`}
            >
              {tab === 'demo' ? '🎯 Judge Demo Mode' : '🔮 What-If Simulation'}
            </button>
          ))}
        </div>

        {activeTab === 'demo' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Preloaded Scenarios</h3>
              {SCENARIOS.map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => runScenario(s.id)}
                  disabled={loading}
                  className="w-full text-left glass-card !p-4 hover:border-arena-accent/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{s.title}</p>
                      <p className="text-xs text-arena-muted">{s.desc}</p>
                    </div>
                    <span className="ml-auto text-arena-accent text-xs">Run →</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="space-y-4">
              {loading && (
                <GlassCard>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="animate-spin w-4 h-4 border-2 border-arena-accent border-t-transparent rounded-full" />
                    AI simulating scenario...
                  </div>
                </GlassCard>
              )}

              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <GlassCard>
                      <h3 className="font-semibold mb-3">{result.scenario}</h3>
                      <p className="text-sm text-arena-muted mb-4">{result.description}</p>

                      {result.prediction && (
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="glass-card !p-3 text-center">
                            <p className="text-xs text-arena-muted">Risk</p>
                            <p className={`text-lg font-bold font-mono ${result.prediction.riskLevel === 'critical' ? 'text-arena-red' : 'text-arena-yellow'}`}>
                              {result.prediction.riskScore}
                            </p>
                          </div>
                          <div className="glass-card !p-3 text-center">
                            <p className="text-xs text-arena-muted">Confidence</p>
                            <p className="text-lg font-bold text-arena-accent font-mono">{result.prediction.confidence}%</p>
                          </div>
                          <div className="glass-card !p-3 text-center">
                            <p className="text-xs text-arena-muted">Fans</p>
                            <p className="text-lg font-bold">{result.prediction.affectedFans}</p>
                          </div>
                        </div>
                      )}

                      {result.agentsActivated && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-arena-muted mb-2">🧠 AI Agents Activated</p>
                          {result.agentsActivated.map((a, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs py-1">
                              <span className="w-2 h-2 rounded-full bg-arena-green" />
                              <span>{a.name}</span>
                              {a.durationMs && <span className="text-arena-muted font-mono">{a.durationMs}ms</span>}
                            </div>
                          ))}
                        </div>
                      )}

                      {result.recommendation?.primaryAction && (
                        <div className="glass-card !p-3 border-arena-accent/20 mb-3">
                          <p className="text-xs text-arena-muted">AI Recommendation</p>
                          <p className="text-sm font-medium text-arena-accent">{result.recommendation.primaryAction}</p>
                        </div>
                      )}

                      {result.announcement && (
                        <GlassCard className="border-arena-yellow/20 !p-3">
                          <p className="text-xs text-arena-muted mb-1">📢 Generated Announcement</p>
                          <p className="text-sm">{result.announcement}</p>
                        </GlassCard>
                      )}

                      {result.explanation && (
                        <div className="mt-3 pt-3 border-t border-arena-border/50">
                          <p className="text-xs text-arena-muted mb-1">Why?</p>
                          <p className="text-xs">{result.explanation.why}</p>
                        </div>
                      )}
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {activeTab === 'simulation' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">What-If Simulations</h3>
              {SIMULATIONS.map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => runSimulation(s.id)}
                  disabled={simLoading}
                  className="w-full text-left glass-card !p-4 hover:border-arena-accent/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{s.title}</p>
                      <p className="text-xs text-arena-muted">{s.desc}</p>
                    </div>
                    <span className="ml-auto text-arena-accent2 text-xs">Simulate →</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {simResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <GlassCard>
                      <h3 className="font-semibold mb-2">{simResult.scenario}</h3>
                      <p className="text-sm text-arena-muted mb-4">{simResult.trigger}</p>

                      {simResult.impact && (
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="glass-card !p-3 text-center">
                            <Users size={16} className="mx-auto mb-1 text-arena-accent" />
                            <p className="text-xs text-arena-muted">Fans Affected</p>
                            <p className="text-lg font-bold">{simResult.impact.totalFansAffected || simResult.impact.fansAffected || simResult.impact.fansInSurge || simResult.estimated_affected_fans || simResult.impact.fansInUncoveredZones}</p>
                          </div>
                          <div className="glass-card !p-3 text-center">
                            <Activity size={16} className="mx-auto mb-1 text-arena-yellow" />
                            <p className="text-xs text-arena-muted">Risk Score</p>
                            <p className={`text-lg font-bold font-mono ${(simResult.riskScore || 0) > 80 ? 'text-arena-red' : 'text-arena-yellow'}`}>{simResult.riskScore || simResult.risk_score}</p>
                          </div>
                          <div className="glass-card !p-3 text-center">
                            <Clock size={16} className="mx-auto mb-1 text-arena-green" />
                            <p className="text-xs text-arena-muted">ETA</p>
                            <p className="text-lg font-bold">{simResult.estimatedCompletionMinutes || simResult.estimated_completion_minutes || simResult.estimatedDelay || '8'}min</p>
                          </div>
                        </div>
                      )}

                      {simResult.recommendation && (
                        <div className="glass-card !p-3 border-arena-accent/20 mb-3">
                          <p className="text-xs text-arena-muted">AI Recommendation</p>
                          <p className="text-sm font-medium text-arena-accent">{simResult.recommendation}</p>
                        </div>
                      )}

                      {simResult.announcement && (
                        <GlassCard className="border-arena-yellow/20 !p-3">
                          <p className="text-xs text-arena-muted mb-1">📢 Public Announcement</p>
                          <p className="text-sm">{simResult.announcement}</p>
                        </GlassCard>
                      )}

                      {simResult.redistribution && (
                        <GlassCard>
                          <p className="text-xs font-medium text-arena-muted mb-2">Crowd Redistribution</p>
                          {simResult.redistribution.map((r, i) => (
                            <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-arena-border/30 last:border-0">
                              <span>{r.gate}</span>
                              <span className="text-arena-muted">{r.currentOccupancy} → </span>
                              <span className={`font-mono ${r.status === 'critical' ? 'text-arena-red' : r.status === 'elevated' ? 'text-arena-yellow' : 'text-arena-green'}`}>
                                {r.projectedOccupancy}
                              </span>
                            </div>
                          ))}
                        </GlassCard>
                      )}
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
