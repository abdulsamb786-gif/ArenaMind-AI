import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function Timeline({ events = [] }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-6 text-arena-muted text-sm">
        <Clock size={20} className="mx-auto mb-2 opacity-50" />
        No events yet
      </div>
    );
  }

  return (
    <div className="relative space-y-0">
      {events.map((event, i) => {
        const Icon = i === events.length - 1 ? AlertTriangle : CheckCircle2;
        const color = i === events.length - 1 ? 'text-arena-yellow' : 'text-arena-green';
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 pb-3 relative"
          >
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${color} bg-opacity-10`}>
                <Icon size={12} className={color} />
              </div>
              {i < events.length - 1 && <div className="w-px h-full bg-arena-border mt-1" />}
            </div>
            <div className="flex-1 min-w-0 pb-2">
              <p className="text-sm text-arena-text">{typeof event === 'string' ? event : event.event || event.step || event.action || ''}</p>
              {(event.time || event.durationMs) && (
                <p className="text-xs text-arena-muted mt-0.5 font-mono">
                  {event.time || `${event.durationMs}ms`}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
