import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';

export default function ActionBtn({ onClick, label = 'Execute AI Plan', disabled = false, variant = 'primary' }) {
  const [state, setState] = useState('idle');
  const [progress, setProgress] = useState([]);

  const handleClick = async () => {
    if (disabled || state !== 'idle') return;
    setState('executing');
    const steps = ['Analyzing...', 'Assigning volunteers...', 'Generating announcement...', 'Updating dashboard...'];
    setProgress([]);
    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setProgress((p) => [...p, steps[i]]);
    }
    setState('done');
    onClick?.();
    setTimeout(() => { setState('idle'); setProgress([]); }, 2000);
  };

  const btnClass = variant === 'emergency'
    ? 'btn-emergency'
    : 'btn-primary';

  return (
    <div className="space-y-3">
      <button
        onClick={handleClick}
        disabled={disabled || state !== 'idle'}
        className={`${btnClass} flex items-center gap-2 w-full justify-center ${state !== 'idle' ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {state === 'idle' && <><Play size={16} /> {label}</>}
        {state === 'executing' && <><Loader2 size={16} className="animate-spin" /> Executing...</>}
        {state === 'done' && <><CheckCircle2 size={16} /> Plan Executed ✓</>}
      </button>
      <AnimatePresence>
        {progress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1"
          >
            {progress.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-xs text-arena-green"
              >
                <CheckCircle2 size={12} />
                {p}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
