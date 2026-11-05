export type NavTab =
  | 'dashboard'
  | 'map'
  | 'rakshak'
  | 'fraud'
  | 'routes'
  | 'walk'
  | 'contacts'
  | 'helplines'
  | 'sos';

export type RiskLevel = 'SAFE' | 'SUSPICIOUS' | 'CRITICAL_RISK';

export interface SafetyPoint {
  id: string;
  name: string;
  category: 'police' | 'hospital' | 'pharmacy' | 'safe_corridor' | 'caution_zone' | 'bus_hub';
  lat: number;
  lng: number;
  address: string;
  contact?: string;
  notes: string;
  isDemo?: boolean;
}

export interface RouteOption {
  id: string;
  title: string;
  type: 'safest' | 'fastest' | 'alternative';
  distance: string;
  duration: string;
  safetyScore: number; // 0 - 100
  lightingIndex: number; // percentage
  policeProximityScore: number;
  description: string;
  waypoints: [number, number][];
  isIlluminated: boolean;
  recommendationBadge: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface FraudAnalysisResult {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  verdict: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';
  scamType: string;
  summary: string;
  indicators: string[];
  actionPlan: string[];
  goldenHourAdvice?: string;
  isAdvisoryOnly?: boolean;
  engine?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface WalkSession {
  isActive: boolean;
  destination: string;
  destinationCoords?: [number, number];
  etaMinutes: number;
  startTime: string;
  batteryLevel?: number;
  checkInIntervalMinutes: number;
  lastCheckIn: string;
  isAlertTriggered: boolean;
}
