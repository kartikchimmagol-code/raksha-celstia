import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  AlertTriangle,
  RotateCcw,
  Paperclip,
  CheckCheck,
  Shield,
  Phone,
  Info,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface RakshakAIProps {
  onCallEmergency?: () => void;
}

export const RakshakAI: React.FC<RakshakAIProps> = ({ onCallEmergency }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I am Rakshak AI, powered by Google Gemini. I am here to help you navigate safety concerns in Mysuru, verify suspicious messages or phone calls, and guide you during emergencies.\n\nHow can I help protect you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<{ hasKey: boolean; model: string }>({
    hasKey: false,
    model: 'gemini-3.8-flash',
  });

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Check backend Gemini AI configuration status on mount
  useEffect(() => {
    fetch('/api/config-status')
      .then((res) => res.json())
      .then((data) => {
        setAiStatus({
          hasKey: !!data.hasGeminiKey,
          model: data.model || 'gemini-3.8-flash',
        });
      })
      .catch(() => {
        setAiStatus({ hasKey: false, model: 'gemini-3.8-flash' });
      });
  }, []);

  const quickPrompts = [
    'Is this link safe?',
    'How to report a scam?',
    'I feel followed near Bamboo Bazar after 10 PM. What should I do?',
    'Received CESC electricity power cut SMS. Is it legitimate?',
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setInput('');
    setErrorMessage(null);
    setLastFailedText(null);

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, text: m.text })),
          model: aiStatus.model,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reach Rakshak AI backend');
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Rakshak AI chat error:', err);
      setLastFailedText(query);
      setErrorMessage(
        err.message || 'Network connection to Gemini AI failed. Tap retry to attempt again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedText) {
      handleSend(lastFailedText);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[620px] max-w-md mx-auto bg-[#090909] border border-[#1C1C1C] rounded-3xl overflow-hidden shadow-2xl">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-lg ${
                  isUser
                    ? 'bg-[#FFD400] text-[#090909] font-semibold rounded-br-none'
                    : 'bg-[#1C1C1C] border border-[#2A2A2A] text-white rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                <div
                  className={`flex items-center justify-end gap-1 text-[9px] mt-1.5 ${
                    isUser ? 'text-[#090909]/70 font-mono' : 'text-[#A0A0A0] font-mono'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isUser && <CheckCheck className="w-3 h-3 text-[#090909]" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl rounded-bl-none bg-[#1C1C1C] border border-[#2A2A2A] max-w-[70%] animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD400] animate-spin" />
            <span className="text-xs text-[#A0A0A0] font-mono">
              Rakshak AI is analyzing...
            </span>
          </div>
        )}

        {/* Error / Retry Banner */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-[#FF3434]/15 border border-[#FF3434]/30 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-[#FF3434]">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="text-[11px] leading-tight">{errorMessage}</span>
            </div>
            {lastFailedText && (
              <button
                onClick={handleRetry}
                className="px-2.5 py-1 rounded-xl bg-[#FF3434] hover:bg-[#ff4d4d] text-white font-bold text-[10px] flex items-center gap-1 shrink-0"
              >
                <RotateCcw className="w-3 h-3" /> Retry
              </button>
            )}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Suggestion Chips (Matches Mockup 4) */}
      <div className="px-3 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-2 bg-[#090909]/80 border-t border-[#1C1C1C]">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-full bg-[#1C1C1C] border border-[#2A2A2A] hover:border-[#FFD400]/50 text-white hover:text-[#FFD400] text-[11px] font-medium whitespace-nowrap transition-colors active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar Matching Mockup 4 */}
      <div className="p-3 bg-[#1C1C1C] border-t border-[#2A2A2A] flex items-center gap-2">
        <button
          className="w-9 h-9 rounded-full bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#A0A0A0] hover:text-white transition-colors"
          title="Attach suspicious SMS or screenshot"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about safety..."
          className="flex-1 bg-[#090909] border border-[#2A2A2A] rounded-2xl px-3.5 py-2 text-xs text-white placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#FFD400] transition-colors"
          disabled={isLoading}
        />

        {/* Circular Yellow Send Button with Black Arrow (Mockup 4) */}
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="w-9 h-9 rounded-full bg-[#FFD400] hover:bg-[#ffe033] disabled:opacity-40 text-[#090909] flex items-center justify-center shadow-md shadow-[#FFD400]/20 transition-all shrink-0 active:scale-95"
        >
          <Send className="w-4 h-4 fill-current stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
