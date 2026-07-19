import GlassCard from '../Common/GlassCard';
import { Users, TrendingUp } from 'lucide-react';

export default function CrowdCard({ data = {}, insight }) {
  const gates = data.gates || [];
  const overall = data.totalOccupancy || 0;

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-arena-accent" />
          <h3 className="text-sm font-semibold">Crowd Density</h3>
        </div>
        <span className={`text-xs font-mono px-2 py-0.5 rounded ${overall > 80 ? 'bg-arena-red/20 text-arena-red' : overall > 60 ? 'bg-arena-yellow/20 text-arena-yellow' : 'bg-arena-green/20 text-arena-green'}`}>
          {overall}%
        </span>
      </div>
      <div className="space-y-2">
        {gates.map((gate, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{gate.name}</span>
              <span className="font-mono">{gate.occupancy}%</span>
            </div>
            <div className="progress-bar">
              <div
                className={`fill ${gate.occupancy > 85 ? 'critical' : gate.occupancy > 60 ? 'high' : 'normal'}`}
                style={{ width: `${gate.occupancy}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {insight && (
        <div className="mt-3 pt-3 border-t border-arena-border/50">
          <div className="flex items-start gap-2 text-xs text-arena-muted">
            <TrendingUp size={12} className="mt-0.5 text-arena-accent" />
            <p>{insight}</p>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
