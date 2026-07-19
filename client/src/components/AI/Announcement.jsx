import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Languages } from 'lucide-react';
import { api } from '../../services/api';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

export default function Announcement({ text = '' }) {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState('');

  if (!text) return null;

  const translate = async (lang) => {
    if (translations[lang]) return;
    setLoading(lang);
    try {
      const res = await api.copilot.translate(text, lang);
      setTranslations((t) => ({ ...t, [lang]: res.translated }));
    } catch (e) {
      setTranslations((t) => ({ ...t, [lang]: text }));
    }
    setLoading('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card border-arena-accent/30"
    >
      <div className="flex items-center gap-2 mb-3">
        <Volume2 size={16} className="text-arena-accent" />
        <span className="text-sm font-medium">AI-Generated Announcement</span>
      </div>
      <div className="bg-arena-dark/50 rounded-lg p-4 mb-3">
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => translate(lang.code)}
            disabled={loading === lang.code}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border border-arena-border hover:border-arena-accent/30 transition-colors"
          >
            {loading === lang.code ? <span className="animate-pulse">...</span> : translations[lang.code] ? '✓' : <Languages size={12} />}
            <span>{lang.flag}</span>
            <span className="text-arena-muted">{lang.code.toUpperCase()}</span>
          </button>
        ))}
      </div>
      {Object.entries(translations).map(([code, t]) => (
        <div key={code} className="mt-2 bg-arena-dark/30 rounded-lg p-3 text-xs">
          <span className="text-arena-muted mr-2">{LANGUAGES.find((l) => l.code === code)?.flag}</span>
          {t}
        </div>
      ))}
    </motion.div>
  );
}
