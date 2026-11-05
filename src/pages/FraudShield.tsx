import React, { useState, useRef } from 'react';
import {
  FileSearch,
  Upload,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  PhoneCall,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Image as ImageIcon,
  X,
  Info,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { SCAM_TEMPLATES } from '../data/scamPatterns';
import { Badge } from '../components/Badge';

interface FraudAnalysis {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  verdict: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';
  scamType: string;
  summary: string;
  indicators: string[];
  actionPlan: string[];
  goldenHourAdvice: string;
  isAdvisoryOnly: boolean;
  engine: string;
  isLiveAI: boolean;
  notice?: string;
}

export const FraudShield: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotMime, setScreenshotMime] = useState<string>('image/jpeg');
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FraudAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be under 10MB.');
      return;
    }

    setScreenshotName(file.name);
    setScreenshotMime(file.type);
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeScreenshot = () => {
    setScreenshotBase64(null);
    setScreenshotName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const runAnalysis = async () => {
    if (!inputText.trim() && !screenshotBase64) {
      setError('Please enter SMS/URL text or upload a screenshot to inspect.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-fraud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim(),
          imageBase64: screenshotBase64,
          mimeType: screenshotMime,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis server error. Please try again.');
      }

      const data: FraudAnalysis = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to complete cybersecurity analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (tpl: typeof SCAM_TEMPLATES[0]) => {
    setInputText(tpl.sampleText);
    removeScreenshot();
    // Immediate analyze
    setTimeout(() => {
      runAnalysis();
    }, 50);
  };

  const clearAll = () => {
    setInputText('');
    removeScreenshot();
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Digital Threat & Scam Shield
          </h2>
          <Badge variant="info">CYBER DEFENSE 1930</Badge>
        </div>
        <p className="text-xs text-slate-400">
          Forensic screening for phishing URLs, malicious Android APKs, utility cutoff traps, and bank impersonation.
        </p>
      </div>

      {/* Quick Test Scam Templates */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">
          Common Karnataka Scam Vectors (One-Tap Test):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SCAM_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl)}
              className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-left transition-all group flex items-start justify-between gap-2"
            >
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">
                  {tpl.category}
                </span>
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white mt-0.5">
                  {tpl.title}
                </h4>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white shrink-0 mt-1" />
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Workbench Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-teal-400" />
            Untrusted Input Screening Workbench:
          </label>
          {(inputText || screenshotBase64) && (
            <button
              onClick={clearAll}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        {/* Text Area */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste SMS content, WhatsApp forward, or suspicious URL here..."
          rows={3}
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:border-teal-500 resize-none leading-relaxed"
        />

        {/* Screenshot Upload Row */}
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {!screenshotBase64 ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-teal-400" />
              <span>Upload or drop screenshot of SMS / banking alert (PNG, JPG)</span>
            </button>
          ) : (
            <div className="relative p-3 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={screenshotBase64}
                  alt="Screenshot preview"
                  className="w-12 h-12 object-cover rounded-xl border border-slate-700"
                />
                <div>
                  <span className="text-xs font-mono font-bold text-white block">
                    {screenshotName || 'Screenshot attached'}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Ready for Multi-Modal Vision Analysis
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={removeScreenshot}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
                title="Remove screenshot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            Untrusted URLs are never opened automatically. Input is sanitized.
          </p>

          <button
            onClick={runAnalysis}
            disabled={isLoading || (!inputText.trim() && !screenshotBase64)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-950/60 disabled:opacity-40 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                Screening Threat Vector...
              </>
            ) : (
              <>
                <FileSearch className="w-4 h-4" />
                Analyze Threat Payload
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Result Card */}
      {result && (
        <div
          className="bg-slate-900 border-2 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl animate-in fade-in"
          style={{
            borderColor:
              result.riskLevel === 'HIGH'
                ? '#f43f5e'
                : result.riskLevel === 'MEDIUM'
                ? '#f59e0b'
                : '#10b981',
          }}
        >
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={
                    result.riskLevel === 'HIGH'
                      ? 'danger'
                      : result.riskLevel === 'MEDIUM'
                      ? 'warning'
                      : 'success'
                  }
                  icon={
                    result.riskLevel === 'HIGH' ? (
                      <ShieldAlert className="w-3.5 h-3.5" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )
                  }
                >
                  RISK CLASSIFICATION: {result.riskLevel}
                </Badge>
                <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                  {result.scamType}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-2 leading-relaxed">
                {result.summary}
              </h3>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Threat Score</span>
              <span
                className={`text-3xl font-black font-mono ${
                  result.riskScore >= 70
                    ? 'text-rose-400'
                    : result.riskScore >= 40
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {result.riskScore}/100
              </span>
            </div>
          </div>

          {/* Indicators of Compromise (IOCs) */}
          {result.indicators && result.indicators.length > 0 && (
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-mono font-bold text-rose-400 uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Detected Threat Signatures:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.indicators.map((ind, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Checklist */}
          {result.actionPlan && result.actionPlan.length > 0 && (
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mandatory Protective Protocol:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.actionPlan.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 1930 Golden Hour Guidance */}
          {result.riskLevel === 'HIGH' && (
            <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-950 p-4 rounded-2xl border border-rose-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-rose-400" />
                  National Cyber Crime Helpline 1930 &quot;Golden Hour&quot;
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  If any money was debited or OTP submitted, dial 1930 immediately to freeze funds before inter-bank settlement.
                </p>
              </div>

              <a
                href="tel:1930"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Dial 1930 Now
              </a>
            </div>
          )}

          {/* Engine & Transparency Notice */}
          <div className="pt-2 text-[10px] text-slate-400 font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 border-t border-slate-800">
            <span>
              Engine: <strong className="text-slate-300">{result.engine}</strong> • {result.isLiveAI ? 'Live Multimodal AI' : 'Rule Engine'}
            </span>
            <span className="text-slate-400">
              *Advisory only. Does not guarantee absolute link safety.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
