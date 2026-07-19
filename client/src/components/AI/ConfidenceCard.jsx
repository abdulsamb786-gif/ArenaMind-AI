export default function ConfidenceCard({ confidence = 0, reasons = [], label = 'Confidence' }) {
  const color = confidence >= 90 ? '#10b981' : confidence >= 75 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 20;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <div className="flex items-start gap-4">
      <div className="relative flex-shrink-0">
        <svg width="52" height="52" className="transform -rotate-90">
          <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="4" />
          <circle cx="26" cy="26" r="20" fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold font-mono" style={{ color }}>{confidence}%</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-arena-muted uppercase tracking-wider mb-1">{label}</p>
        {reasons.length > 0 && (
          <ul className="space-y-0.5">
            {reasons.slice(0, 3).map((r, i) => (
              <li key={i} className="text-xs text-arena-text/70 flex items-start gap-1.5">
                <span className="text-arena-green mt-0.5">✓</span>
                {typeof r === 'string' ? r : r.factor || r}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
