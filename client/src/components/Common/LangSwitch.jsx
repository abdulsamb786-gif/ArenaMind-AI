import { useState } from 'react';
import { Languages } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
];

export default function LangSwitch({ onSelect, current = 'en' }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="glass-card !p-2 flex items-center gap-2 cursor-pointer hover:border-arena-accent/30"
      >
        <Languages size={16} />
        <span className="text-sm">{LANGUAGES.find((l) => l.code === current)?.flag}</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 glass-card !p-2 z-50 min-w-[160px]">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { onSelect?.(lang.code); setOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-arena-accent/10 ${current === lang.code ? 'bg-arena-accent/10 text-arena-accent' : ''}`}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
