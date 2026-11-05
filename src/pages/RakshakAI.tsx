import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, AlertCircle, Copy, Check, PhoneCall } from 'lucide-react';
import { ChatMessage } from '../types';
import { Badge } from '../components/Badge';

export const RakshakAI: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      text: 'Namaskara! I am Rakshak AI, your dedicated personal safety & digital threat companion for Mysuru and Karnataka.\n\nI can assist you with:\n• Late night commuter safety & safe corridors in Mysuru\n• Immediate crisis guidance & verified helplines (112, 1091, 108)\n• Verification of suspicious SMS, electricity bill threats, or APKs (1930)\n\nHow can I support your safety right now?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'I feel followed near Bamboo Bazar after 10 PM. What should I do?',
    'Received CESC electricity power cut SMS. Is it legitimate?',
    'What is the 1930 Golden Hour procedure for UPI fraud?',
    'Safest route from Suburban Bus Stand to Kuvempunagar late at night?',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build multi-turn history payload for server.ts
      const apiMessages = newMessages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const modelText = data.text || 'I could not process that request. Please contact 112 if you are in immediate danger.';

      const modelMessage: ChatMessage = {
        id: `msg-${Date.now()}-model`,
        role: 'model',
        text: modelText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch {
      // Graceful offline fallback
      const fallbackMessage: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'model',
        text: '⚠️ Unable to connect to the cloud AI server right now.\n\nIf you are facing an active emergency in Mysuru or Karnataka, please use direct emergency lines:\n• Namma 112 (Unified Police & Emergency)\n• 1091 (Women Distress Helpline)\n• 1930 (National Cyber Crime & Financial Fraud)\n• 108 (Arogya Kavacha Ambulance)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 pb-20 flex flex-col h-[calc(100vh-140px)]">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Rakshak AI Assistant</h2>
            <Badge variant="info">GEMINI 3.8 FLASH</Badge>
          </div>
          <p className="text-xs text-slate-400">
            Expert safety and cyber threat companion for Mysuru & Karnataka.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href="tel:112"
            className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold flex items-center gap-1"
          >
            <PhoneCall className="w-3 h-3" /> 112
          </a>
          <a
            href="tel:1930"
            className="px-2.5 py-1 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold flex items-center gap-1"
          >
            <PhoneCall className="w-3 h-3" /> 1930
          </a>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 shrink-0">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 shrink-0 transition-all text-left"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-slate-900/60 rounded-3xl border border-slate-800 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow ${
                  isUser
                    ? 'bg-rose-600'
                    : 'bg-gradient-to-tr from-cyan-600 to-sky-500 border border-cyan-400/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed space-y-1 shadow-md ${
                  isUser
                    ? 'bg-rose-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                <div>{msg.text}</div>
                <div
                  className={`flex items-center justify-between pt-1 text-[10px] ${
                    isUser ? 'text-rose-200' : 'text-slate-400 font-mono'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => copyMessage(msg.id, msg.text)}
                      className="ml-2 hover:text-white p-0.5 rounded"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono p-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Rakshak AI analyzing safety protocol...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div className="relative shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 focus-within:border-rose-500"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Rakshak AI about Mysuru routes, scams, or safety steps..."
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
