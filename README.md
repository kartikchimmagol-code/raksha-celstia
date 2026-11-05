# RAKSHA Celestia — Mobile-First Personal Safety & Digital Threat Shield (PWA)

> **Mobile-First Progressive Web Application (PWA) & Cybersecurity Companion for Mysuru, Karnataka**

RAKSHA Celestia is an integrated, location-aware personal safety command center and digital fraud defense platform built as a **Mobile-First Progressive Web Application (PWA)** using React 19, TypeScript, Tailwind CSS v4, Express.js, and Google Gemini 3.8 Flash.

---

## 🛡️ Core Modules & Capabilities

### 1. Personal Safety Command Dashboard
* **One-Touch Emergency SOS:** Instant 3-second countdown broadcast generator packaging live GPS coordinates (`12.3080° N, 76.6535° E`), Google Maps links, and distress metadata.
* **Instant Deterrent Tools:**
  * **Acoustic Emergency Siren:** High-decibel frequency audio synthesizer utilizing the Web Audio API with a full-screen visual strobe effect.
  * **Simulated Incoming Call:** Realistic fake incoming call generator ("Home / Appa", "Police Control", "Cab Driver") with interactive waveform and live call duration.
  * **Decoy Disguise Mode:** Single-tap switch to college study notes (Data Structures & Network Security) to discretely exit uncomfortable situations.

### 2. Mysuru Tactical Safety Map
* **Interactive Leaflet Cartography:** Centered on Mysuru (`12.3080° N, 76.6535° E`) with live GPS beacon tracking and inverted dark mode styling.
* **Geo-Referenced Layers:**
  * **Police Outposts:** Devaraja Station, Commissionerate, Nazarbad Station, Kuvempunagar Station, Jayalakshmipuram Station, Lashkar Station.
  * **Hospitals & Trauma Centers:** K.R. Hospital 24/7 Casualty, Apollo BGS Kuvempunagar, JSS Hospital.
  * **Safe Corridors:** Sayyaji Rao Heritage Road, JLB Road (illuminated arterial routes).
  * **Caution Zones:** Bamboo Bazar freight alleys, Chamundi Hill base ascent after hours *(clearly flagged as demo safety data)*.
* **Turn-by-Turn Route Guidance:** OSRM routing comparing safest vs. fastest paths with lighting index and direct handoff to "Walk With Me".

### 3. Digital Threat & Scam Shield
* **Forensic Threat Inspection:** Analyzes pasted messages, URLs, and screenshots against regional scam vectors:
  * **CESC Mysuru / BESCOM Power Disconnection Scam:** Identifies urgent bill cutoff threats directing victims to unauthorized phone numbers or `.apk` malware.
  * **SBI / Canara Bank KYC Suspension Phishing:** Detects fake Aadhaar/PAN update links and banking trojans.
  * **Prepayment Task Scams:** Catches part-time Telegram review and rating investment fraud.
  * **Digital Arrest Extortion:** Advises users on fraudulent law enforcement video call intimidation.
* **1930 "Golden Hour" Protocol:** Direct speed-dial to India's National Cybercrime Helpline **1930** to freeze fraudulent inter-bank transfers within the critical window.

### 4. Rakshak AI Safety Companion
* **Multi-Turn Safety Assistant:** Powered by Google Gemini 3.8 Flash (`@google/genai`) via the Express.js backend.
* **Karnataka Context:** Pre-trained on Mysuru landmarks (Sayyaji Rao Road, K.R. Circle, Suburban Bus Stand, Kuvempunagar), Karnataka emergency legislation, and crisis de-escalation tactics.
* **Quick Prompts:** Instant suggestions for link verification, scam reporting, night transit precautions, and power cut SMS analysis.

### 5. "Walk With Me" Virtual Escort
* **Transit ETA Timer:** Users specify their destination and estimated walk time (10m, 15m, 25m, 40m).
* **Periodic Check-Ins:** Demands an "I'm Safe" check-in every 5 minutes with check-in count logging.
* **Automatic Escalation:** Warns users if a check-in is overdue and primes siren / SOS alerts.

### 6. Emergency Guardians Directory
* **Encrypted Local Storage:** Manage trusted family and emergency contacts with zero external cloud leaks.
* **WhatsApp Live Location Sharing:** Generates pre-formatted WhatsApp distress messages with exact GPS coordinates.

### 7. Karnataka Verified Emergency Helplines
* **112:** Namma 112 Unified Emergency Response (Police, Fire, Ambulance).
* **1091:** Karnataka Women in Distress Helpline.
* **1930:** National Cyber Fraud & Financial Crime Helpline.
* **108:** Arogya Kavacha Medical Ambulance Service.
* **100:** Mysuru City Police Control Room.
* **181:** Domestic Violence & Women Support.
* **1098:** Childline India.

---

## 📱 Progressive Web App (PWA) Features

* **Installable:** Meets PWA installability criteria with `manifest.json` (standalone display mode, portrait orientation, high-res 192px/512px icons, and app shortcuts).
* **Offline Resilient:** Service Worker (`/public/sw.js`) pre-caches critical app shell assets and provides stale-while-revalidate caching for static resources and offline fallbacks for emergency information.
* **Mobile-First Ergonomics:** Touch targets ≥ 48px, sticky bottom navigation with thumb-friendly SOS trigger, safe area inset handling, and mobile browser address bar color synchronization (`#090909`).

---

## 💻 Technology Stack

* **Frontend:** React 19, TypeScript 5.7, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide React.
* **Mapping:** Leaflet 1.9, OpenStreetMap contributors attribution, custom dark inverted tiles.
* **Audio Deterrence:** Web Audio API (real-time high-decibel frequency synthesis).
* **Backend:** Express.js, Node.js 22, TSX, Dotenv.
* **Artificial Intelligence:** Google Gemini 3.8 Flash (`@google/genai`).
* **Build System:** Vite 6.
