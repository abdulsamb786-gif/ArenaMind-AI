import { motion } from 'framer-motion';

const AGENTS = [
  { id: 'nav-agent', name: 'Navigation', icon: '🧭' },
  { id: 'crowd-agent', name: 'Crowd Intel', icon: '📊' },
  { id: 'incident-agent', name: 'Incident Response', icon: '🚨' },
  { id: 'mission-agent', name: 'Mission Control', icon: '🎯' },
  { id: 'briefing-agent', name: 'Executive Briefing', icon: '📋' },
  { id: 'policy-agent', name: 'Policy', icon: '📜' },
];

export default function AgentBar({ agents = [] }) {
  const statusMap = {};
  (agents || []).forEach((a) => { statusMap[a.id] = a.status; });

  return (
    <div className="flex flex-wrap gap-2">
      {AGENTS.map((agent, i) => {
        const status = statusMap[agent.id] || 'online';
        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-arena-dark/50 border border-arena-border text-sm"
          >
            <span>{agent.icon}</span>
            <span className="text-xs text-arena-muted">{agent.name}</span>
            <span className={`status-dot ${status}`} />
          </motion.div>
        );
      })}
    </div>
  );
}
