import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

const SCAN_STEPS = [
  { label: 'Scanning Stadium...', duration: 600 },
  { label: 'Loading Sensors...', duration: 700 },
  { label: 'Building AI Context...', duration: 800 },
  { label: 'Operational Intelligence Ready', duration: 400 },
];

export default function Landing() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [agentCount, setAgentCount] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    api.agents().then((res) => setAgentCount(res.online || 6)).catch(() => setAgentCount(6));
  }, []);

  useEffect(() => {
    if (step >= SCAN_STEPS.length) {
      const t = setTimeout(() => setComplete(true), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), SCAN_STEPS[step].duration);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-arena-dark via-blue-950/20 to-arena-dark" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-arena-accent/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-arena-accent2/5 rounded-full blur-[100px]" />
      </div>

      <AnimatePresence mode="wait">
        {!complete ? (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 text-center max-w-lg"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-8"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-arena-accent to-arena-accent2 flex items-center justify-center shadow-2xl shadow-arena-accent/30">
                <Brain size={36} className="text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold mb-2 glow-text">ArenaMind AI</h1>
            <p className="text-arena-muted mb-8">Initializing Mission Control...</p>

            <div className="space-y-4">
              {SCAN_STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full transition-all duration-500 ${i < step ? 'bg-arena-green' : i === step ? 'bg-arena-accent' : 'bg-arena-muted/30'}`} />
                  <span className={`text-sm transition-all duration-500 ${i < step ? 'text-arena-green' : i === step ? 'text-arena-accent' : 'text-arena-muted/50'}`}>
                    {s.label}
                  </span>
                  {i === step && (
                    <motion.div
                      animate={{ width: ['0%', '100%'] }}
                      transition={{ duration: s.duration / 1000, ease: 'linear' }}
                      className="h-px bg-gradient-to-r from-arena-accent to-transparent flex-1"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center max-w-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-arena-accent to-arena-accent2 flex items-center justify-center shadow-2xl shadow-arena-accent/30 mb-8"
            >
              <Brain size={36} className="text-white" />
            </motion.div>

            <h1 className="text-4xl font-bold mb-2 glow-text">ArenaMind AI</h1>
            <p className="text-arena-accent text-lg mb-1">Predict. Prevent. Protect.</p>
            <p className="text-arena-muted text-sm mb-8">
              AI Mission Control for FIFA World Cup 2026
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {['🧠 Navigation', '📊 Crowd Intel', '🚨 Incident', '🎯 Mission', '📋 Briefing', '📜 Policy'].map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-arena-dark/50 border border-arena-border text-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-arena-green shadow-lg shadow-arena-green/50" />
                  <span className="text-xs text-arena-muted">{a}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/mission-control')}
                className="btn-primary flex items-center gap-2 justify-center"
              >
                Launch Mission Control
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/simulator')}
                className="px-6 py-3 rounded-xl font-semibold border border-arena-border hover:border-arena-accent/30 transition-all"
              >
                View Scenarios
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-8 flex items-center justify-center gap-6 text-xs text-arena-muted"
            >
              <span className="flex items-center gap-1"><Shield size={12} /> {agentCount} Agents Online</span>
              <span className="flex items-center gap-1"><Zap size={12} /> Gemini AI</span>
              <span className="flex items-center gap-1"><Globe size={12} /> 6 Languages</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
