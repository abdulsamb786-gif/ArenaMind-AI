import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

const STEPS = [
  { key: 'understand', label: 'AI Understands', icon: '🧠' },
  { key: 'retrieve', label: 'Retrieves Policies', icon: '📜' },
  { key: 'predict', label: 'Predicts Impact', icon: '🔮' },
  { key: 'recommend', label: 'Recommends Action', icon: '💡' },
  { key: 'explain', label: 'Explains Decision', icon: '📝' },
  { key: 'execute', label: 'Executes Plan', icon: '⚡' },
];

export default function WorkflowViz({ timeline = [], running = false }) {
  const completedSteps = timeline.filter((t) => t.status === 'complete').map((t) => t.step);

  return (
    <div className="space-y-2">
      {STEPS.map((step, i) => {
        const isComplete = completedSteps.includes(step.key);
        const isCurrent = running && !isComplete && (i === 0 || completedSteps.includes(STEPS[i - 1].key));
        return (
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-500 ${isComplete ? 'bg-arena-green/10 border border-arena-green/20' : isCurrent ? 'bg-arena-accent/10 border border-arena-accent/30 animate-pulse-glow' : 'bg-arena-dark/30 border border-arena-border/50 opacity-50'}`}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm">
              {isComplete ? (
                <CheckCircle2 size={20} className="text-arena-green" />
              ) : isCurrent ? (
                <Loader2 size={18} className="text-arena-accent animate-spin" />
              ) : (
                <span className="text-lg">{step.icon}</span>
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isComplete ? 'text-arena-green' : isCurrent ? 'text-arena-accent' : 'text-arena-muted'}`}>
                {step.label}
              </p>
            </div>
            {isComplete && (
              <span className="text-xs text-arena-green font-mono">
                {timeline.find((t) => t.step === step.key)?.durationMs || 0}ms
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
