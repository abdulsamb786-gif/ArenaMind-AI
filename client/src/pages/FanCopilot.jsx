import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Bot, User, MessageSquare } from 'lucide-react';
import GlassCard from '../components/Common/GlassCard';
import LangSwitch from '../components/Common/LangSwitch';
import { api } from '../services/api';

export default function FanCopilot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Welcome to ArenaMind Stadium! I\'m your AI Fan Copilot. How can I help you today?', agent: 'CopilotAgent' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [context, setContext] = useState({});
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const msg = input;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await api.copilot.chat(msg, 'demo-session', language);
      setMessages((m) => [...m, { role: 'ai', text: res.response, agent: res.agent?.agent || 'CopilotAgent', latency: res.latency }]);
      if (res.memory) setContext(res.memory);
    } catch (e) {
      setMessages((m) => [...m, { role: 'ai', text: 'Sorry, I encountered an error. Please try again.', agent: 'System' }]);
    }
    setLoading(false);
  };

  const quickActions = [
    { label: 'Where is my seat?', hint: 'A-203' },
    { label: 'Nearest food?', hint: 'Where can I eat near A-203?' },
    { label: 'Wheelchair route', hint: 'Wheelchair-friendly route to Gate A' },
    { label: 'Lost & Found', hint: 'I lost my bag near Gate B' },
  ];

  return (
    <div className="min-h-screen pb-12">
      <header className="glass-header px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-arena-muted hover:text-arena-text">
            <ArrowLeft size={20} />
          </button>
          <Bot size={20} className="text-arena-accent" />
          <span className="font-bold">AI Fan Copilot</span>
        </div>
        <div className="flex items-center gap-3">
          {context.seat && <span className="text-xs text-arena-muted bg-arena-dark/50 px-2 py-1 rounded">Seat: {context.seat}</span>}
          <LangSwitch onSelect={setLanguage} current={language} />
        </div>
      </header>

      <main className="px-6 max-w-4xl mx-auto mt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <GlassCard className="h-[60vh] flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-arena-accent to-arena-accent2 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-arena-accent/20 border border-arena-accent/30' : 'bg-arena-dark/50 border border-arena-border'}`}>
                      {msg.text}
                    </div>
                    {msg.role === 'ai' && (
                      <div className="flex items-center gap-2 mt-1 text-xs text-arena-muted">
                        {msg.agent && <span>{msg.agent}</span>}
                        {msg.latency && <span>· {msg.latency}</span>}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-arena-accent2/30 flex items-center justify-center flex-shrink-0">
                      <User size={16} />
                    </div>
                  )}
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-arena-accent to-arena-accent2 flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-arena-dark/50 border border-arena-border rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-arena-accent animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-arena-accent animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-2 h-2 rounded-full bg-arena-accent animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-arena-border/50 p-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                {quickActions.map((qa, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(qa.hint); }}
                    className="text-xs px-3 py-1.5 rounded-full border border-arena-border hover:border-arena-accent/30 text-arena-muted transition-colors"
                  >
                    {qa.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about your seat, food, directions..."
                  className="flex-1 bg-arena-dark/50 border border-arena-border rounded-xl px-4 py-3 text-sm text-arena-text placeholder-arena-muted/50 focus:outline-none focus:border-arena-accent/50"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="btn-primary !px-4 !py-3"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </main>
    </div>
  );
}
