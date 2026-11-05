# RAKSHA Celestia — Personal Safety & Digital Threat Shield

> **Mobile-First Personal Safety Platform & Cybersecurity Companion for Mysuru, Karnataka**

RAKSHA Celestia is an integrated, location-aware personal safety command center and digital fraud defense platform. It combines real-time physical safety tools (interactive risk mapping, safe corridor routing, virtual escort tracking, acoustic deterrence) with AI-powered cyber threat intelligence (SMS phishing detection, malicious APK screening, and Karnataka emergency response protocols).

---

## 🛡️ Core Modules & Capabilities

### 1. Personal Safety Command Dashboard
* **One-Touch Emergency SOS:** Instant 3-second countdown broadcast generator that packages live GPS coordinates, Google Maps navigation links, and distress metadata.
* **Tactical Escape Tools:**
  * **Acoustic Emergency Siren:** High-decibel police frequency audio alarm utilizing the Web Audio API with visual screen strobe effect.
  * **Simulated Incoming Call:** Realistic fake incoming call generator ("Home / Appa" or "Mysuru Police Inspector") with escape prompts to discretely exit uncomfortable transit situations.
  * **Decoy Disguise Mode:** Instantly disguises the application as a college notes/calculator app with a single tap if someone is surveilling the screen.

### 2. Mysuru Tactical Safety Map
* **Interactive Leaflet Mapping:** Centered on Mysuru (`12.3051° N, 76.6554° E`) with real-time GPS beacon positioning.
* **Geo-Referenced Layers:**
  * **Police Outposts:** Devaraja Station, Nazarbad Station, Kuvempunagar Station, Jayalakshmipuram Station.
  * **Hospitals & Trauma Centers:** K.R. Hospital 24/7 Casualty, Apollo BGS Kuvempunagar.
  * **Safe Corridors:** Sayyaji Rao Heritage Road, D. Devaraj Urs Road (illuminated arterial routes).
  * **Caution Zones:** Bamboo Bazar freight alleys, Chamundi Hill base ascent after hours *(clearly flagged as demo safety data)*.

### 3. Safe Route Navigation Engine
* **Safest Route vs. Fastest Route:** Multi-factor corridor comparison balancing transit duration against illumination indices, police proximity, and active commercial density.
* **Illumination Index:** Real-time visibility and lighting score to help night commuters avoid unlit transit shortcuts.

### 4. Digital Threat & Scam Shield
* **AI-Assisted Phishing & APK Scanner:** Analyzes pasted messages, URLs, and SMS notifications against regional scam vectors:
  * **CESC Mysuru / BESCOM Power Disconnection Scam:** Identifies urgent bill cutoff threats directing victims to unauthorized phone numbers or `.apk` malware.
  * **SBI / Canara Bank KYC Suspension Phishing:** Detects fake Aadhaar/PAN update links and banking trojans.
  * **Prepayment Task Scams:** Catches part-time Telegram review and rating investment fraud.
  * **Digital Arrest Extortion:** Advises users on fraudulent law enforcement Skype/WhatsApp intimidation.
* **1930 "Golden Hour" Protocol:** Direct access to India's National Cybercrime Helpline to freeze fraudulent inter-bank transfers within the critical 1-2 hour window.

### 5. Rakshak AI Safety Companion
* **Multi-Turn Safety Assistant:** Powered by Google Gemini 3.8 Flash (`@google/genai`).
* **Karnataka Context:** Pre-trained on Mysuru landmarks (Sayyaji Rao Road, K.R. Circle, Suburban Bus Stand, Kuvempunagar), Karnataka emergency legislation, and crisis de-escalation tactics.

### 6. "Walk With Me" Virtual Escort
* **Transit ETA Timer:** Users specify their destination and estimated walk time.
* **Periodic Check-Ins:** Demands an "I'm Safe" check-in every 5 minutes.
* **Automatic Escalation:** If a check-in is missed or the timer expires, the app triggers emergency audio deterrence and primes location alerts.
* Includes a **Simulate Missed Check-In** demo mode for demonstrations.

### 7. Emergency Guardians Directory
* **Encrypted Local Storage:** Manage primary family and emergency contacts with zero cloud exposure.
* **WhatsApp Test Alert Dispatcher:** Generates pre-formatted location alerts for consent-based testing with trusted contacts.

### 8. Karnataka Emergency Directory
* **Official Toll-Free 24/7 Services:**
  * **112:** Namma 112 Unified Emergency Response Support System (Police, Fire, Ambulance).
  * **1091:** Karnataka Women in Distress Helpline.
  * **1930:** National Cyber Fraud & Financial Crime Helpline.
  * **108:** Arogya Kavacha Medical Ambulance Service.
  * **100:** Mysuru City Police Control Room.
  * **181:** Domestic Abuse & Women Welfare Helpline.
  * **1098:** Childline India.

---

## 💻 Technology Stack

* **Frontend:** React 19, TypeScript 5.7, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide React.
* **Mapping:** Leaflet 1.9, CartoDB Voyager tiles, OpenStreetMap contributors attribution.
* **Audio Deterrence:** Web Audio API (real-time frequency synthesis).
* **Backend:** Node.js, Express, TSX, Dotenv.
* **Artificial Intelligence:** Google Gemini 3.8 Flash (`@google/genai` v2.4.0).
* **Build System:** Vite 6 (ESM production bundler).

---

## 🚀 Running the Project

### Prerequisites
* Node.js (v20.18+ or v22.11+)
* npm (v10+)

### Setup Instructions

1. **Clone & Install Dependencies:**
   ```bash
   git clone https://github.com/kartikchimmagol-code/raksha-celstia.git
   cd raksha-celstia
   npm install
   ```

2. **Configure Environment Secrets (Optional for AI Chat):**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   PORT=3000
   ```
   *(Note: The application includes intelligent local heuristic fallbacks, allowing full testing of the Fraud Shield and Map modules even without an API key).*

3. **Start the Full-Stack Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

4. **Verify TypeScript & Production Build:**
   ```bash
   npm run lint    # Verifies zero TypeScript errors
   npm run build   # Compiles optimized production bundle in /dist
   ```

---

## ⚠️ Important Demonstrator Notes & Ethics

* **Educational Prototype:** RAKSHA Celestia is an academic and hackathon demonstration platform, not a certified municipal 911/112 emergency dispatch system.
* **No Unsolicited 112 Calls:** Do not place test calls to actual emergency lines (112, 108, 100) during evaluation. Use the provided WhatsApp test broadcast tool to test with consenting guardians.
* **Demo Safety Datasets:** Crime risk zones and lighting scores are mock prototype datasets designed for the Mysuru pilot demonstration.
