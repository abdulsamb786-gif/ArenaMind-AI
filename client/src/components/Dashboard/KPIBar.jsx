import { motion } from 'framer-motion';
import { Brain, Activity, Target, Clock } from 'lucide-react';

const METRICS = [
  { key: 'aiDecisionsToday', label: 'AI Decisions Today', icon: Brain, color: '#3b82f6', suffix: '' },
  { key: 'incidentsResolved', label: 'Incidents Resolved', icon: Activity, color: '#10b981', suffix: '' },
  { key: 'predictionAccuracy', label: 'Prediction Accuracy', icon: Target, color: '#8b5cf6', suffix: '%' },
  { key: 'averageResponseSeconds', label: 'Avg Response', icon: Clock, color: '#f59e0b', suffix: 's' },
];

export default function KPIBar({ kpi = {} }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {METRICS.map((metric, i) => {
        const Icon = metric.icon;
        const value = kpi[metric.key] ?? 0;
        return (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card !p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-arena-muted">{metric.label}</span>
              <Icon size={16} style={{ color: metric.color }} />
            </div>
            <p className="kpi-value" style={{ color: metric.color }}>
              {value}{metric.suffix}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
