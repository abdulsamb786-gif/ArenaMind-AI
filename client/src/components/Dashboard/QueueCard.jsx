import GlassCard from '../Common/GlassCard';
import { Clock } from 'lucide-react';

export default function QueueCard({ foodCourts = [] }) {
  const avg = foodCourts.length ? Math.round(foodCourts.reduce((s, f) => s + (f.queueTime || 0), 0) / foodCourts.length) : 0;

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-3">
        <Clock size={16} className="text-arena-yellow" />
        <h3 className="text-sm font-semibold">Queue Times</h3>
        <span className="text-xs text-arena-muted ml-auto">Avg: {avg}min</span>
      </div>
      <div className="space-y-2">
        {foodCourts.slice(0, 5).map((fc, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span>{fc.name}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 rounded-full bg-arena-dark/50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-arena-yellow"
                  style={{ width: `${Math.min(100, (fc.queueTime / 20) * 100)}%` }}
                />
              </div>
              <span className="font-mono w-8 text-right">{fc.queueTime}m</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
