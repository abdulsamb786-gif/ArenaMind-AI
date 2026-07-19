import GlassCard from '../Common/GlassCard';
import { Train, Car } from 'lucide-react';

export default function TransportCard({ parking = [], transport = [] }) {
  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-3">
        <Train size={16} className="text-arena-accent2" />
        <h3 className="text-sm font-semibold">Transport</h3>
      </div>
      <div className="space-y-3">
        {transport.map((t, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span>{t.name}</span>
            <span className={`px-2 py-0.5 rounded ${t.status === 'busy' ? 'bg-arena-yellow/20 text-arena-yellow' : 'bg-arena-green/20 text-arena-green'}`}>
              {t.queueMinutes || 0}min
            </span>
          </div>
        ))}
        <div className="pt-2 border-t border-arena-border/50">
          <p className="text-xs text-arena-muted mb-2 flex items-center gap-1"><Car size={12} /> Parking</p>
          {parking.map((p, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1">
              <span>{p.name}</span>
              <span className={`font-mono ${p.status === 'full' ? 'text-arena-red' : p.status === 'busy' ? 'text-arena-yellow' : 'text-arena-green'}`}>
                {p.current}/{p.capacity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
