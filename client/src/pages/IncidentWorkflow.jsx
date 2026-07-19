import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Shield, Clock, Users, CheckCircle2 } from 'lucide-react';
import GlassCard from '../components/Common/GlassCard';
import WorkflowViz from '../components/AI/WorkflowViz';
import ConfidenceCard from '../components/AI/ConfidenceCard';
import ActionBtn from '../components/AI/ActionBtn';
import Announcement from '../components/AI/Announcement';
import Loader from '../components/Common/Loader';
import { api } from '../services/api';

const DEMO_INPUTS = [
  { label: 'Lost Child', text: 'Child crying near Gate B. Approximately 6 years old, blue shirt.' },
  { label: 'Medical Emergency', text: 'Medical emergency at Grand Stand Zone 2. A fan has collapsed.' },
  { label: 'Gate Congestion', text: 'Gate A occupancy at 92% and rising. Event starts in 2 hours.' },
  { label: 'Heavy Rain', text: 'Heavy rain detected. Intensity: high. Duration: 45 minutes.' },
];

export default function IncidentWorkflow() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.incident.report(input);
      setResult(res);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="glass-header px-6 py-4 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => navigate('/')} className="text-arena-muted hover:text-arena-text">
          <ArrowLeft size={20} />
        </button>
        <AlertTriangle size={20} className="text-arena-red" />
        <span className="font-bold">AI Incident Workflow</span>
      </header>

      <main className="px-6 max-w-6xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <GlassCard>
            <h3 className="text-sm font-semibold mb-4">Report Incident</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {DEMO_INPUTS.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setInput(d.text)}
                  className="text-xs px-3 py-1.5 rounded-full border border-arena-border hover:border-arena-accent/30 transition-colors"
                >
                  {d.label}
                </button>
              ))}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the incident... e.g., Child lost near Gate B"
              className="w-full bg-arena-dark/50 border border-arena-border rounded-lg px-4 py-3 text-sm text-arena-text placeholder-arena-muted/50 focus:outline-none focus:border-arena-accent/50 resize-none"
              rows={4}
            />
            <button onClick={analyze} disabled={loading || !input.trim()} className="btn-primary w-full mt-3">
              {loading ? 'Analyzing with AI...' : 'Analyze Incident'}
            </button>
          </GlassCard>

          {loading && <GlassCard><Loader text="AI Processing Incident..." /></GlassCard>}

          {error && (
            <GlassCard className="border-arena-red/30">
              <p className="text-arena-red text-sm">{error}</p>
            </GlassCard>
          )}

          {result && (
            <>
              <GlassCard>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Shield size={16} className="text-arena-accent" />
                  AI Workflow Pipeline
                </h3>
                <WorkflowViz timeline={result.timeline || []} running={false} />
                {result.processingTime && (
                  <div className="mt-3 pt-3 border-t border-arena-border/50">
                    <p className="text-xs text-arena-muted font-mono">
                      Total: {result.processingTime.totalSeconds}s · {result.aiSource}
                    </p>
                  </div>
                )}
              </GlassCard>

              <GlassCard>
                <h3 className="text-sm font-semibold mb-3">Understanding</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-arena-muted">Summary:</span> {result.summary}</p>
                  <p><span className="text-arena-muted">Category:</span> {result.category}</p>
                  <p><span className="text-arena-muted">Priority:</span> {result.priorityScore}/10</p>
                </div>
                {result.ragPolicies && (
                  <div className="mt-3 pt-3 border-t border-arena-border/50">
                    <p className="text-xs font-medium text-arena-muted mb-2">📜 RAG Policies Retrieved</p>
                    {result.ragPolicies.map((p, i) => (
                      <div key={i} className="text-xs text-arena-text/70 py-1 flex items-center gap-2">
                        <CheckCircle2 size={10} className="text-arena-green" />
                        {p.title}
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </>
          )}
        </div>

        <div className="space-y-4">
          {result && (
            <>
              <GlassCard>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-arena-yellow" />
                  AI Prediction
                </h3>
                <p className="text-sm mb-3">{result.prediction?.impact}</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-card !p-3 text-center">
                    <p className="text-xs text-arena-muted">Risk Score</p>
                    <p className={`text-lg font-bold font-mono ${result.prediction?.riskScore > 80 ? 'text-arena-red' : 'text-arena-yellow'}`}>
                      {result.prediction?.riskScore}
                    </p>
                  </div>
                  <div className="glass-card !p-3 text-center">
                    <p className="text-xs text-arena-muted">Fans Affected</p>
                    <p className="text-lg font-bold">{result.prediction?.affectedFans}</p>
                  </div>
                  <div className="glass-card !p-3 text-center">
                    <p className="text-xs text-arena-muted">Time to Critical</p>
                    <p className="text-lg font-bold">{result.prediction?.timeToCritical}m</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-sm font-semibold mb-3">AI Recommendation</h3>
                <p className="text-sm font-medium text-arena-accent mb-3">{result.recommendation?.action}</p>
                {result.recommendation?.mission && (
                  <div className="glass-card !p-3 mb-3 border-arena-accent/20">
                    <p className="text-xs font-medium text-arena-accent mb-1">MISSION: {result.recommendation.mission.name}</p>
                    <p className="text-xs text-arena-muted">{result.recommendation.mission.impact}</p>
                    <div className="flex gap-3 mt-2 text-xs">
                      <span className="text-arena-muted">Risk: <span className={result.recommendation.mission.risk_level === 'critical' ? 'text-arena-red' : 'text-arena-yellow'}>{result.recommendation.mission.risk_level}</span></span>
                      <span className="text-arena-muted">ETA: {result.recommendation.mission.eta_minutes}min</span>
                    </div>
                  </div>
                )}
                {result.recommendation?.tasks && (
                  <div className="space-y-1.5 mb-3">
                    {result.recommendation.tasks.map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs py-1.5 border-b border-arena-border/30 last:border-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-arena-accent" />
                        <span className="flex-1">{t.action}</span>
                        <span className="text-arena-muted">{t.assignee}</span>
                      </div>
                    ))}
                  </div>
                )}
                <ConfidenceCard
                  confidence={result.confidence || result.prediction?.confidence || 88}
                  reasons={result.recommendation?.mission ? [result.recommendation.mission.name] : []}
                  label="AI Confidence"
                />
              </GlassCard>

              <GlassCard>
                <h3 className="text-sm font-semibold mb-3">AI Explanation</h3>
                <p className="text-sm mb-2">{result.explanation?.primaryReason}</p>
                {result.explanation?.supportingFactors && (
                  <div className="space-y-1">
                    {result.explanation.supportingFactors.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className={`${f.status === 'positive' ? 'text-arena-green' : 'text-arena-yellow'} mt-0.5`}>
                          {f.status === 'positive' ? '✓' : '⚠'}
                        </span>
                        <span className="text-arena-text/70">{f.factor}</span>
                      </div>
                    ))}
                  </div>
                )}
                {result.explanation?.whatIfNot && (
                  <div className="mt-3 pt-3 border-t border-arena-border/50">
                    <p className="text-xs text-arena-muted mb-1">What happens if no action taken:</p>
                    <p className="text-xs text-arena-red/80">{result.explanation.whatIfNot}</p>
                  </div>
                )}
              </GlassCard>

              <Announcement text={result.announcement} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
