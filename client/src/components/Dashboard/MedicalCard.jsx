import GlassCard from '../Common/GlassCard';
import { Stethoscope } from 'lucide-react';

export default function MedicalCard({ posts = [] }) {
  const available = posts.filter((p) => p.status === 'available').length;

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-3">
        <Stethoscope size={16} className="text-arena-red" />
        <h3 className="text-sm font-semibold">Medical Posts</h3>
        <span className="text-xs text-arena-green ml-auto">{available}/{posts.length} Available</span>
      </div>
      <div className="space-y-2">
        {posts.map((p, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span>{p.zone || p.name || `Post ${i + 1}`}</span>
            <span className={`px-2 py-0.5 rounded ${p.status === 'available' ? 'bg-arena-green/20 text-arena-green' : 'bg-arena-yellow/20 text-arena-yellow'}`}>
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
