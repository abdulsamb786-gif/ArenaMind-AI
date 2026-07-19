import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Brain, ArrowLeft, Target, Activity, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/Common/GlassCard';
import KPIBar from '../components/Dashboard/KPIBar';
import CrowdCard from '../components/Dashboard/CrowdCard';
import QueueCard from '../components/Dashboard/QueueCard';
import MedicalCard from '../components/Dashboard/MedicalCard';
import SecurityCard from '../components/Dashboard/SecurityCard';
import TransportCard from '../components/Dashboard/TransportCard';
import WeatherCard from '../components/Dashboard/WeatherCard';
import AgentBar from '../components/AI/AgentBar';
import ConfidenceCard from '../components/AI/ConfidenceCard';
import ActionBtn from '../components/AI/ActionBtn';
import Timeline from '../components/AI/Timeline';
import Announcement from '../components/AI/Announcement';
import useSocket from '../hooks/useSocket';
import useStore from '../store/appStore';
import { api } from '../services/api';

export default function MissionControl() {
  const navigate = useNavigate();
  useSocket();
  const { stadium, agents, kpi, setAgents, setKPI, addTimeline, timeline } = useStore();

  const [aiInsight, setAiInsight] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [missionAlert, setMissionAlert] = useState('');

  useEffect(() => {
    api.agents().then(setAgents).catch(() => {});
    api.kpi().then(setKPI).catch(() => {});
    api.stadium.dashboard().then(async (data) => {
      const insight = await api.stadium.aiInsight('crowd');
      setAiInsight(insight.insight);
    }).catch(() => {});
  }, [setAgents, setKPI]);

  const handleMission = useCallback(async () => {
    if (!missionAlert.trim()) return;
    const res = await api.stadium.mission(missionAlert);
    if (res?.mission) {
      setRecommendation(res.mission);
      addTimeline({ event: `Mission created: ${res.mission.mission_name}`, time: 'now' });
    }
  }, [missionAlert, addTimeline]);

  const [executed, setExecuted] = useState(false);

  const handleExecute = useCallback(async () => {
    if (recommendation?.recommendation) {
      await api.stadium.execute(recommendation.recommendation);
      setExecuted(true);
      addTimeline({ event: 'Plan executed successfully', time: 'now' });
    }
  }, [recommendation, addTimeline]);

  const riskLevel = stadium?.gates?.some((g) => g.riskLevel === 'critical') ? 'HIGH' :
                    stadium?.gates?.some((g) => g.riskLevel === 'elevated') ? 'ELEVATED' : 'LOW';

  const riskColor = riskLevel === 'HIGH' ? 'text-arena-red' : riskLevel === 'ELEVATED' ? 'text-arena-yellow' : 'text-arena-green';

  return (
    <div className="min-h-screen pb-12">
      <header className="glass-header px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-arena-muted hover:text-arena-text transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Brain size={20} className="text-arena-accent" />
            <span className="font-bold">ArenaMind AI</span>
          </div>
          <span className="text-xs text-arena-muted bg-arena-dark/50 px-2 py-1 rounded">Mission Control</span>
        </div>
        <div className="flex items-center gap-4">
          <AgentBar agents={agents?.agents || []} />
        </div>
      </header>

      <main className="px-6 max-w-7xl mx-auto mt-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">AI Mission Control</h1>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${riskColor} bg-opacity-10 ${riskLevel === 'HIGH' ? 'bg-arena-red/10' : riskLevel === 'ELEVATED' ? 'bg-arena-yellow/10' : 'bg-arena-green/10'}`}>
                ⚠ Risk: {riskLevel}
              </span>
            </div>
            <p className="text-arena-muted text-sm">Real-time stadium operational intelligence</p>
          </div>
          <div className="flex gap-2">
            {['overview', 'intelligence', 'mission'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm transition-all capitalize ${activeTab === tab ? 'bg-arena-accent/20 text-arena-accent border border-arena-accent/30' : 'text-arena-muted border border-transparent hover:border-arena-border'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        <KPIBar kpi={kpi} />

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <CrowdCard
                data={stadium ? { gates: stadium.gates, totalOccupancy: stadium.overallOccupancy } : {}}
                insight={aiInsight}
              />
              <div className="grid grid-cols-2 gap-4">
                <MedicalCard posts={stadium?.medicalPosts || []} />
                <QueueCard foodCourts={stadium?.foodCourts || []} />
              </div>
            </div>
            <div className="space-y-4">
              <WeatherCard data={stadium?.weather || { condition: 'clear', temperature: 26, humidity: 55, windSpeed: 12, rainProbability: 20 }} />
              <TransportCard parking={stadium?.parkingLots || []} transport={stadium?.transportHubs || []} />
              <SecurityCard incidents={stadium?.securityIncidents || []} />
            </div>
          </div>
        )}

        {activeTab === 'intelligence' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Activity size={16} className="text-arena-accent" />
                AI Recommendations
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-arena-muted block mb-2">Describe an alert or situation</label>
                  <textarea
                    value={missionAlert}
                    onChange={(e) => setMissionAlert(e.target.value)}
                    placeholder="e.g., Heavy rain detected near stadium..."
                    className="w-full bg-arena-dark/50 border border-arena-border rounded-lg px-4 py-3 text-sm text-arena-text placeholder-arena-muted/50 focus:outline-none focus:border-arena-accent/50 resize-none"
                    rows={3}
                  />
                  <button onClick={handleMission} className="btn-primary mt-2 w-full text-sm">
                    Generate AI Recommendation
                  </button>
                </div>
                {recommendation && (
                  <div className="space-y-3 pt-3 border-t border-arena-border/50">
                    <h4 className="font-semibold text-arena-accent">{recommendation.mission_name || 'Response Plan'}</h4>
                    <p className="text-sm text-arena-muted">{recommendation.impact_description || recommendation.recommendation}</p>
                    {recommendation.tasks && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium text-arena-muted uppercase">Tasks</p>
                        {recommendation.tasks.map((t, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-arena-accent" />
                            <span>{t.action}</span>
                            {t.assignee_type && <span className="text-arena-muted">— {t.assignee_type}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    <ConfidenceCard confidence={recommendation.confidence || 94} reasons={recommendation.safety_instructions || []} />
                    <ActionBtn onClick={handleExecute} label="Execute AI Plan" />
                  </div>
                )}
              </div>
            </GlassCard>

            <div className="space-y-4">
              <GlassCard>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Target size={16} className="text-arena-accent2" />
                  Live Decision Timeline
                </h3>
                <Timeline events={timeline} />
              </GlassCard>
              <Announcement text={recommendation?.announcement || recommendation?.announcement_text || ''} />
            </div>
          </div>
        )}

        {activeTab === 'mission' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2">
              <h3 className="text-sm font-semibold mb-4">Active Mission Dashboard</h3>
              {recommendation ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-arena-accent">{recommendation.mission_name}</h4>
                      <p className="text-sm text-arena-muted">{recommendation.impact_description}</p>
                    </div>
                    <span className={`text-2xl font-bold font-mono ${recommendation.risk_level === 'critical' ? 'text-arena-red' : recommendation.risk_level === 'high' ? 'text-arena-yellow' : 'text-arena-green'}`}>
                      {recommendation.estimated_completion_minutes || recommendation.eta_minutes || 0}min
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="glass-card !p-3 text-center">
                      <p className="text-xs text-arena-muted">Volunteers</p>
                      <p className="text-lg font-bold">{recommendation.volunteer_count_needed || recommendation.volunteerCount || 0}</p>
                    </div>
                    <div className="glass-card !p-3 text-center">
                      <p className="text-xs text-arena-muted">Medical</p>
                      <p className="text-lg font-bold">{recommendation.medical_units_needed || 0}</p>
                    </div>
                    <div className="glass-card !p-3 text-center">
                      <p className="text-xs text-arena-muted">Security</p>
                      <p className="text-lg font-bold">{recommendation.security_units_needed || 0}</p>
                    </div>
                  </div>
                  {recommendation.tasks && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-arena-muted uppercase">Task List</p>
                      {recommendation.tasks.map((t, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm py-2 border-b border-arena-border/30 last:border-0">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${t.priority === 'high' ? 'bg-arena-red/20 text-arena-red' : 'bg-arena-accent/20 text-arena-accent'}`}>
                            {i + 1}
                          </div>
                          <span className="flex-1">{t.action}</span>
                          <span className="text-xs text-arena-muted">{t.assignee_type || t.assignee}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {executed ? (
                    <div className="space-y-3">
                      <div className="glass-card !p-4 border-arena-green/30 bg-arena-green/5 text-center">
                        <CheckCircle2 size={32} className="mx-auto mb-2 text-arena-green" />
                        <p className="text-lg font-bold text-arena-green">Mission Executed ✓</p>
                        <p className="text-xs text-arena-muted mt-1">All tasks have been dispatched. Agents are monitoring the situation.</p>
                      </div>
                      <button
                        onClick={() => { setRecommendation(null); setExecuted(false); }}
                        className="btn-primary w-full"
                      >
                        Create New Mission
                      </button>
                    </div>
                  ) : (
                    <ActionBtn onClick={handleExecute} />
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-arena-muted text-sm">
                  <AlertTriangle size={24} className="mx-auto mb-2 opacity-50" />
                  No active mission
                  <p className="text-xs mt-1">Go to Intelligence tab to create one</p>
                </div>
              )}
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {['Gate Congestion Alert', 'Medical Emergency Drill', 'Weather Response', 'Lost Child Protocol'].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => { setMissionAlert(action); setActiveTab('intelligence'); }}
                    className="w-full text-left px-4 py-3 rounded-lg border border-arena-border hover:border-arena-accent/30 text-sm transition-all"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  );
}
