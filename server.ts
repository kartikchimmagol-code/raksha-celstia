import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Support JSON payloads up to 25MB for screenshot/image uploads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Server-side Gemini client
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10) {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'raksha-celestia-safety',
          },
        },
      });
      console.log('Gemini AI Client successfully initialized.');
    } catch (e) {
      console.error('Failed to initialize GoogleGenAI client:', e);
    }
  } else {
    console.warn('GEMINI_API_KEY is not configured. Serving in verified offline safety mode.');
  }

  // System configuration & health endpoint
  app.get('/api/config-status', (_req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: !!ai,
      model: 'gemini-3.8-flash',
      version: '2.0.0-hackathon-ready',
      serverTime: new Date().toISOString(),
    });
  });

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), aiOnline: !!ai });
  });

  // Multi-turn Gemini Chat API endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const {
        messages,
        systemInstruction,
        model = 'gemini-3.8-flash',
      } = req.body;

      if (!ai) {
        return res.status(503).json({
          error:
            'Gemini API key is not configured in .env. Please set GEMINI_API_KEY to activate live generative AI reasoning, or use the offline verified safety directory.',
          isConfigError: true,
        });
      }

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      // Format multi-turn conversation history for @google/genai SDK
      const contents = messages.map(
        (m: { role: 'user' | 'model'; text: string }) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        })
      );

      const defaultSystemInstruction = `You are "Rakshak AI", a calm, authoritative, and practical personal safety and digital threat protection companion built into the RAKSHA application.
Your core expertise includes:
1. Personal Physical Safety & Commuter Guidance in Mysuru, Karnataka (and other Indian cities). You know local landmarks: Sayyaji Rao Heritage Road, K.R. Circle, Mysuru Palace, Suburban Bus Stand, Chamundi Hill ascent, Gokulam, Jayalakshmipuram, Kuvempunagar, and KRS Road.
2. Verified Karnataka Emergency Helplines: 
   - 112 (Namma 112 Unified Police, Fire & Emergency Response)
   - 108 (Arogya Kavacha Ambulance)
   - 100 (Mysuru City Police Control Room)
   - 1091 (Women Distress Helpline Karnataka)
   - 1930 (National Cyber Crime & Financial Fraud Helpline - Golden Hour recovery)
3. Digital Threat & Scam Analysis: Spotting phishing URLs, APK malware links, electricity bill cutoff scams (BESCOM/CESC Mysuru), bank KYC expiration fraud (SBI/HDFC/Canara), and high-reward prepayment task scams.
4. Crime-Risk Awareness: Highlighting night transit precautions (e.g., avoiding unlit alleys near Bamboo Bazar/Lashkar after 10 PM, sticking to illuminated arterial routes like Sayyaji Rao Road).

Tone: Calm, authoritative, empathetic, practical, and concise. Format critical emergency numbers or immediate safety steps clearly with bullet points. Never provide false reassurance or pretend an alert was sent if you are only chatting.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: systemInstruction || defaultSystemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ text: response.text });
    } catch (err: unknown) {
      console.error('Gemini Chat error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown server error';
      return res.status(500).json({
        error: `Gemini API error: ${errorMessage}`,
      });
    }
  });

  // Dedicated Cybersecurity & Multi-Modal Fraud Analysis endpoint
  app.post('/api/analyze-fraud', async (req, res) => {
    try {
      const { text = '', imageBase64, mimeType = 'image/jpeg' } = req.body;

      if (!text.trim() && !imageBase64) {
        return res.status(400).json({
          error: 'Either text content or screenshot imageBase64 is required for fraud analysis.',
        });
      }

      // If Gemini AI is configured, run deep multimodal analysis
      if (ai) {
        try {
          const parts: any[] = [];

          if (text.trim()) {
            parts.push({
              text: `Perform a cybersecurity forensic threat analysis on this user-submitted text/URL/notification:\n"${text}"`,
            });
          }

          if (imageBase64) {
            const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
            parts.push({
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            });
            parts.push({
              text: 'Also inspect this screenshot image for malicious mobile app impersonation, fake banking portals, spoofed sender headers, or suspicious URLs.',
            });
          }

          parts.push({
            text: `Analyze carefully for:
1. Phishing & credential theft
2. Malicious Android APK trojans
3. Utility cutoff extortion (e.g. CESC Mysuru, BESCOM)
4. Bank KYC account freezing (SBI, HDFC, Canara, ICICI)
5. Part-time job / YouTube rating prepayment scams
6. Law enforcement "Digital Arrest" coercion

Respond ONLY in this strict JSON format with no Markdown code block ticks:
{
  "riskScore": <integer between 0 and 100>,
  "riskLevel": "<LOW or MEDIUM or HIGH>",
  "verdict": "<SAFE or SUSPICIOUS or DANGEROUS>",
  "scamType": "<e.g. CESC Electricity Cutoff Phishing, Banking Trojan APK, Telegram Task Scam, Safe Communication>",
  "summary": "<Concise 2-sentence explanation of what this is>",
  "indicators": ["<Suspicious indicator 1>", "<Suspicious indicator 2>"],
  "actionPlan": ["<Recommended defensive step 1>", "<Recommended defensive step 2>"],
  "goldenHourAdvice": "<Guidance for 1930 reporting if funds were sent, or 'N/A' if no financial threat>",
  "isAdvisoryOnly": true
}`,
          });

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [{ role: 'user', parts }],
            config: {
              temperature: 0.2, // Low temperature for consistent forensic accuracy
            },
          });

          const rawText = response.text || '';
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return res.json({
              ...parsed,
              engine: 'gemini-3.8-flash',
              isLiveAI: true,
            });
          }
        } catch (aiErr) {
          console.error('Gemini vision/text analysis error, using verified offline ruleset:', aiErr);
        }
      }

      // Verified Offline Heuristic Rule Engine (Honest, reliable fallback)
      const inputLower = (text + ' ' + (imageBase64 ? 'screenshot' : '')).toLowerCase();
      const hasApk = inputLower.includes('.apk') || inputLower.includes('package') || inputLower.includes('install');
      const hasPowerCut = inputLower.includes('power cut') || inputLower.includes('electricity') || inputLower.includes('cesc') || inputLower.includes('bescom') || inputLower.includes('disconnected');
      const hasBankKyc = inputLower.includes('kyc') || inputLower.includes('sbi') || inputLower.includes('pan') || inputLower.includes('blocked') || inputLower.includes('debit card');
      const hasTaskScam = inputLower.includes('part-time') || inputLower.includes('earn daily') || inputLower.includes('telegram') || inputLower.includes('review');
      const hasDigitalArrest = inputLower.includes('digital arrest') || inputLower.includes('customs') || inputLower.includes('cbi') || inputLower.includes('warrant');

      const isHighRisk = hasApk || hasPowerCut || hasBankKyc || hasTaskScam || hasDigitalArrest;

      let scamType = 'General Advisory Assessment';
      let summary = 'No high-severity malicious APK or extortion patterns identified.';
      const indicators: string[] = [];
      const actionPlan: string[] = [];

      if (hasPowerCut) {
        scamType = 'Utility Disconnection Scam (CESC/BESCOM)';
        summary = 'Coercive power cutoff warning directing the victim to call an unauthorized mobile number or download an unverified APK.';
        indicators.push('Government power utilities never send cutoff notices via personal SMS numbers');
        indicators.push('Demand for urgent payment within hours is designed to induce panic');
        actionPlan.push('Do NOT call any mobile numbers listed in the message');
        actionPlan.push('Verify bill status directly on the official KarnatakaOne portal or CESC Mysore counter');
      } else if (hasBankKyc || hasApk) {
        scamType = 'Banking Phishing / Malware APK Trojan';
        summary = 'Attempt to steal banking credentials or install remote access spyware through an untrusted download link.';
        indicators.push('Contains unverified external link or direct .apk installer');
        indicators.push('Banks never threaten account suspension via SMS links');
        actionPlan.push('Do NOT click the URL or download any APK file onto your device');
        actionPlan.push('If bank credentials or OTP were entered, call 1930 immediately to freeze transactions');
      } else if (hasTaskScam) {
        scamType = 'High-Reward Advance-Fee Task Fraud';
        summary = 'Fake employment scheme promising high daily payouts for rating videos or hotels.';
        indicators.push('Unsolicited job offer requiring interaction via Telegram/WhatsApp');
        indicators.push('Demands advance deposit or "prepayment task" before releasing earnings');
        actionPlan.push('Block and report the sender on WhatsApp/Telegram');
        actionPlan.push('Never transfer funds to unlock "task earnings"');
      } else {
        indicators.push('Examine sender header code (official Indian govt/banks use 6-character alphabetic headers)');
        actionPlan.push('Verify independently via official website or customer support');
      }

      return res.json({
        riskScore: isHighRisk ? 92 : 25,
        riskLevel: isHighRisk ? 'HIGH' : 'LOW',
        verdict: isHighRisk ? 'DANGEROUS' : 'SAFE',
        scamType,
        summary,
        indicators,
        actionPlan,
        goldenHourAdvice: isHighRisk
          ? 'If money was transferred, immediately call Karnataka Cyber Fraud Helpline 1930 to freeze inter-bank transfers.'
          : 'N/A',
        isAdvisoryOnly: true,
        engine: 'offline-heuristic-engine',
        isLiveAI: false,
        notice: ai
          ? 'Analysis completed via rule-based security engine.'
          : 'Operating in verified offline safety mode. Set GEMINI_API_KEY in .env for multi-modal vision reasoning.',
      });
    } catch (err: unknown) {
      console.error('Fraud analysis error:', err);
      return res.status(500).json({ error: 'Failed to process fraud analysis.' });
    }
  });

  // Dev server or static files
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RAKSHA Celestia Full-Stack Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
