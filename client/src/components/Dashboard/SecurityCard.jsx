import GlassCard from '../Common/GlassCard';
import { Shield } from 'lucide-react';

export default function SecurityCard({ incidents = [] }) {
  const active = incidents.filter((i) => i.status === 'active' || i.severity === 'high').length;

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-3">
        <Shield size={16} className="text-arena-accent" />
        <h3 className="text-sm font-semibold">Security</h3>
        {active > 0 && <span className="text-xs bg-arena-red/20 text-arena-red px-2 py-0.5 rounded ml-auto">{active} Active</span>}
      </div>
      <div className="space-y-2">
        {incidents.slice(0, 4).map((inc, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="truncate max-w-[140px]">{inc.summary || inc.type || `Alert ${i + 1}`}</span>
            <span className={`px-2 py-0.5 rounded ${inc.severity === 'high' || inc.severity === 'critical' ? 'bg-arena-red/20 text-arena-red' : 'bg-arena-green/20 text-arena-green'}`}>
              {inc.severity}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
