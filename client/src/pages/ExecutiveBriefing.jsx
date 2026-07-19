import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, RefreshCw, AlertTriangle, CheckCircle2, Clock, Users, Shield, Activity } from 'lucide-react';
import GlassCard from '../components/Common/GlassCard';
import ConfidenceCard from '../components/AI/ConfidenceCard';
import AgentBar from '../components/AI/AgentBar';
import { api } from '../services/api';

export default function ExecutiveBriefing() {
  const navigate = useNavigate();
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await api.briefing();
      setBriefing(res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="glass-header px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-arena-muted hover:text-arena-text">
            <ArrowLeft size={20} />
          </button>
          <FileText size={20} className="text-arena-accent" />
          <span className="font-bold">AI Executive Briefing</span>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="btn-primary !py-2 !px-4 text-sm flex items-center gap-2"
        >
          {loading ? <RefreshCw size={14} className="animate-spin" /> : <FileText size={14} />}
          {loading ? 'Generating...' : 'Generate Briefing'}
        </button>
      </header>

      <main className="px-6 max-w-5xl mx-auto mt-6 space-y-6">
        {!briefing && !loading && (
          <div className="text-center py-20">
            <FileText size={48} className="mx-auto mb-4 text-arena-muted/30" />
            <h2 className="text-xl font-semibold mb-2">Executive Briefing</h2>
            <p className="text-arena-muted text-sm mb-6">One-click AI-generated operational summary for stadium command leadership</p>
            <button onClick={generate} className="btn-primary">Generate Briefing</button>
          </div>
        )}

        {loading && (
          <GlassCard>
            <div className="flex items-center gap-4 py-4">
              <div className="animate-spin w-6 h-6 border-2 border-arena-accent border-t-transparent rounded-full" />
              <div>
                <p className="text-sm font-medium">AI is analyzing stadium operations...</p>
                <p className="text-xs text-arena-muted">Gathering data from all agents</p>
              </div>
            </div>
          </GlassCard>
        )}

        {briefing && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">Operational Briefing</h2>
                    <p className="text-xs text-arena-muted">
                      {briefing.generatedAt && `Generated ${new Date(briefing.generatedAt).toLocaleTimeString()}`}
                      {briefing.stadiumName && ` · ${briefing.stadiumName}`}
                    </p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${briefing.operational_status === 'elevated' ? 'bg-arena-yellow/20 text-arena-yellow' : briefing.operational_status === 'critical' ? 'bg-arena-red/20 text-arena-red' : 'bg-arena-green/20 text-arena-green'}`}>
                    {briefing.operational_status?.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="glass-card !p-3 text-center">
                    <Activity size={16} className="mx-auto mb-1 text-arena-accent" />
                    <p className="text-xs text-arena-muted">Decisions</p>
                    <p className="text-xl font-bold">{briefing.decisions_made_today}</p>
                  </div>
                  <div className="glass-card !p-3 text-center">
                    <CheckCircle2 size={16} className="mx-auto mb-1 text-arena-green" />
                    <p className="text-xs text-arena-muted">Resolved</p>
                    <p className="text-xl font-bold">{briefing.incidents_resolved}</p>
                  </div>
                  <div className="glass-card !p-3 text-center">
                    <Clock size={16} className="mx-auto mb-1 text-arena-yellow" />
                    <p className="text-xs text-arena-muted">Avg Response</p>
                    <p className="text-xl font-bold text-arena-yellow">{briefing.average_response_time}</p>
                  </div>
                  <div className="glass-card !p-3 text-center">
                    <AlertTriangle size={16} className="mx-auto mb-1 text-arena-red" />
                    <p className="text-xs text-arena-muted">Status</p>
                    <p className="text-xl font-bold capitalize">{briefing.operational_status}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Crowd Summary', content: briefing.crowd_summary, icon: Users, color: 'text-arena-accent' },
                    { label: 'Security Summary', content: briefing.security_summary, icon: Shield, color: 'text-arena-green' },
                    { label: 'Medical Summary', content: briefing.medical_summary, icon: Activity, color: 'text-arena-red' },
                    { label: 'Volunteer Summary', content: briefing.volunteer_summary, icon: Users, color: 'text-arena-yellow' },
                    { label: 'Transport Summary', content: briefing.transport_summary, icon: Clock, color: 'text-arena-accent2' },
                  ].map((section, i) => {
                    const Icon = section.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-3 py-2 border-b border-arena-border/30 last:border-0"
                      >
                        <Icon size={16} className={`${section.color} mt-0.5 flex-shrink-0`} />
                        <div>
                          <p className="text-xs font-medium text-arena-muted">{section.label}</p>
                          <p className="text-sm">{section.content}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {briefing.key_risks && briefing.key_risks.length > 0 && (
                <GlassCard>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-arena-red" />
                    Key Risks
                  </h3>
                  {briefing.key_risks.map((risk, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm py-2 border-b border-arena-border/30 last:border-0">
                      <span className="w-2 h-2 rounded-full bg-arena-red" />
                      {risk}
                    </div>
                  ))}
                </GlassCard>
              )}

              {briefing.ai_recommendations && briefing.ai_recommendations.length > 0 && (
                <GlassCard>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Activity size={16} className="text-arena-accent" />
                    AI Recommendations
                  </h3>
                  {briefing.ai_recommendations.map((rec, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm py-2 border-b border-arena-border/30 last:border-0">
                      <span className="w-2 h-2 rounded-full bg-arena-accent" />
                      {rec}
                    </div>
                  ))}
                </GlassCard>
              )}

              {briefing.next_hour_outlook && (
                <GlassCard className="lg:col-span-2">
                  <h3 className="text-sm font-semibold mb-2">Next Hour Outlook</h3>
                  <p className="text-sm text-arena-text/80">{briefing.next_hour_outlook}</p>
                </GlassCard>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
