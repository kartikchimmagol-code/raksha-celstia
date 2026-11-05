import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  PhoneCall,
  RotateCcw,
  ShieldAlert,
  Key,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { Badge } from '../components/Badge';

export const RakshakAI: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      text: 'Namaskara! I am Rakshak AI, your personal safety & cyber defense companion for Mysuru and Karnataka.\n\nI can assist you with:\n• Safe transit corridors in Mysuru (Sayyaji Rao Rd, JLB Rd, Kuvempunagar, Chamundi ascent precautions)\n• Immediate crisis guidance and verified helplines (112, 1091, 108)\n• Real-time analysis of suspicious SMS, power cutoff alerts, or phishing links\n• Emergency procedures for the 1930 Cyber Fraud "Golden Hour"\n\nHow can I help protect you right now?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<{ hasKey: boolean; model: string }>({
    hasKey: false,
    model: 'gemini-2.5-flash',
  });

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Check backend Gemini AI configuration status on mount
  useEffect(() => {
    fetch('/api/config-status')
      .then((res) => res.json())
      .then((data) => {
        setAiStatus({
          hasKey: !!data.hasGeminiKey,
          model: data.model || 'gemini-2.5-flash',
        });
      })
      .catch(() => {
        setAiStatus({ hasKey: false, model: 'gemini-2.5-flash' });
      });
  }, []);

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
    setLastFailedText(null);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          model: aiStatus.model,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.isConfigError) {
          const configMsg: ChatMessage = {
            id: `msg-${Date.now()}-config-err`,
            role: 'model',
            text: '⚠️ [GEMINI API KEY REQUIRED]\n\nLive generative reasoning requires a Google Gemini API key.\n\nTo activate live AI:\n1. Open your project folder.\n2. Add your key to .env: `GEMINI_API_KEY="your-gemini-key"`\n3. Restart the server.\n\nIn the meantime, the verified Karnataka Emergency Directory is fully operational below:',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, configMsg]);
          return;
        }
        throw new Error(data.error || 'Server returned an error.');
      }

      const modelMessage: ChatMessage = {
        id: `msg-${Date.now()}-model`,
        role: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      setLastFailedText(text);
      const fallbackMessage: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'model',
        text: `⚠️ Communication error: ${err.message || 'Unable to reach Gemini backend'}.\n\nIf you are facing an active emergency in Mysuru, please call directly:\n• 112 (Namma 112 Unified Police & Emergency)\n• 1091 (Women Distress Helpline)\n• 1930 (Cyber Crime Helpline)`,
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Rakshak AI Assistant</h2>
            <Badge variant={aiStatus.hasKey ? 'success' : 'warning'}>
              {aiStatus.hasKey ? 'GEMINI 2.5 FLASH ONLINE' : 'OFFLINE SAFETY PROTOCOL'}
            </Badge>
          </div>
          <p className="text-xs text-slate-400">
            Context-aware safety advisor for Mysuru landmarks & Karnataka emergency laws.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href="tel:112"
            className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold flex items-center gap-1 hover:bg-rose-600/30"
          >
            <PhoneCall className="w-3 h-3" /> 112
          </a>
          <a
            href="tel:1930"
            className="px-2.5 py-1 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold flex items-center gap-1 hover:bg-amber-600/30"
          >
            <PhoneCall className="w-3 h-3" /> 1930
          </a>
        </div>
      </div>

      {/* Notice if API key is missing */}
      {!aiStatus.hasKey && (
        <div className="p-3 rounded-2xl bg-slate-900 border border-amber-500/30 text-xs text-slate-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Live Gemini reasoning is in verified offline standby. Add <code className="text-amber-400">GEMINI_API_KEY</code> to <code className="text-slate-200">.env</code> to connect live Google AI.
            </span>
          </div>
        </div>
      )}

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
                    : 'bg-gradient-to-tr from-teal-600 to-sky-600 border border-teal-400/30'
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
            <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
            <span>Rakshak AI analyzing safety guidelines...</span>
          </div>
        )}

        {lastFailedText && (
          <div className="flex items-center gap-2 p-2">
            <button
              onClick={() => handleSendMessage(lastFailedText)}
              className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 underline"
            >
              <RotateCcw className="w-3 h-3" /> Retry last question
            </button>
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
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 focus-within:border-teal-500 shadow-xl"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Rakshak AI about Mysuru routes, legal rights, or fraud checks..."
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-40 transition-all cursor-pointer shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
