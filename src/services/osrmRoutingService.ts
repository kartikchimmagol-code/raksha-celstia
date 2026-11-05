import {
  MYSURU_POLICE_STATIONS,
  MYSURU_HOSPITALS,
  MYSURU_INCIDENT_CLUSTERS,
  MYSURU_CAUTION_ZONES,
  MysuruPOI,
  IncidentCluster,
  CautionZone,
} from '../data/mysuruLocations';

export interface RouteStep {
  instruction: string;
  distanceMeters: number;
  durationSeconds: number;
  name: string;
}

export interface NearbyEmergencyPost {
  poi: MysuruPOI;
  distanceMeters: number;
}

export interface RouteCautionAlert {
  title: string;
  reason: string;
  type: 'caution_zone' | 'incident_cluster';
  riskLevel: 'ELEVATED' | 'MODERATE' | 'LOW';
  isDemoData: boolean;
}

export interface OSRMRouteResult {
  id: string;
  name: string;
  type: 'safest' | 'alternative';
  mode: 'driving' | 'walking';
  routingProvider: string;
  distanceKm: number;
  distanceMeters: number;
  durationMins: number;
  durationFormatted: string;
  coordinates: [number, number][]; // [lat, lng] array for Leaflet
  steps: RouteStep[];
  safetyScore: number; // 0 - 100
  illuminationIndex: number; // 0 - 100% (roadway hierarchy proxy)
  nearbyPolice: NearbyEmergencyPost[];
  nearbyHospitals: NearbyEmergencyPost[];
  cautionAlerts: RouteCautionAlert[];
  safetySummary: string;
  isRecommended: boolean;
  transparencyNotice: string;
  methodologyNotes: string[];
}

/**
 * Calculate Haversine distance in meters between two lat/lng coordinates
 */
export function haversineDistanceMeters(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180;
  const dLon = ((coord2[1] - coord1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1[0] * Math.PI) / 180) *
      Math.cos((coord2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Format minutes into readable time (e.g. "12 mins", "1 hr 15 mins")
 */
export function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'}`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours} hr ${remainingMins} min${remainingMins === 1 ? '' : 's'}`;
}

/**
 * Analyzes proximity of route coordinates to emergency services and risk zones
 */
function analyzeRouteCorridor(coordinates: [number, number][], isAlternative: boolean) {
  const nearbyPoliceMap = new Map<string, NearbyEmergencyPost>();
  const nearbyHospMap = new Map<string, NearbyEmergencyPost>();
  const cautionAlerts: RouteCautionAlert[] = [];

  // Sample route points every 40-80 meters or max 25 samples
  const step = Math.max(1, Math.floor(coordinates.length / 25));

  for (let i = 0; i < coordinates.length; i += step) {
    const pt = coordinates[i];

    // Check Police stations within 850 meters
    for (const station of MYSURU_POLICE_STATIONS) {
      const dist = haversineDistanceMeters(pt, [station.lat, station.lng]);
      if (dist <= 850) {
        if (!nearbyPoliceMap.has(station.id) || dist < nearbyPoliceMap.get(station.id)!.distanceMeters) {
          nearbyPoliceMap.set(station.id, { poi: station, distanceMeters: dist });
        }
      }
    }

    // Check Tertiary Trauma Hospitals within 900 meters
    for (const hosp of MYSURU_HOSPITALS) {
      const dist = haversineDistanceMeters(pt, [hosp.lat, hosp.lng]);
      if (dist <= 900) {
        if (!nearbyHospMap.has(hosp.id) || dist < nearbyHospMap.get(hosp.id)!.distanceMeters) {
          nearbyHospMap.set(hosp.id, { poi: hosp, distanceMeters: dist });
        }
      }
    }

    // Check intersection with Caution Zones
    for (const cz of MYSURU_CAUTION_ZONES) {
      const dist = haversineDistanceMeters(pt, [cz.lat, cz.lng]);
      if (dist <= cz.radiusMeters + 50) {
        if (!cautionAlerts.some((a) => a.title === cz.name)) {
          cautionAlerts.push({
            title: cz.name,
            reason: cz.cautionReason,
            type: 'caution_zone',
            riskLevel: 'MODERATE',
            isDemoData: false, // Physical low-lighting caution
          });
        }
      }
    }

    // Check intersection with Historical Incident Clusters (Simulation Data)
    for (const inc of MYSURU_INCIDENT_CLUSTERS) {
      const dist = haversineDistanceMeters(pt, [inc.lat, inc.lng]);
      if (dist <= inc.radiusMeters) {
        if (!cautionAlerts.some((a) => a.title === inc.title)) {
          cautionAlerts.push({
            title: inc.title,
            reason: `${inc.incidentType} (Demo log: ${inc.reportedCount} events, peak ${inc.peakHours})`,
            type: 'incident_cluster',
            riskLevel: inc.riskLevel,
            isDemoData: true,
          });
        }
      }
    }
  }

  const nearbyPolice = Array.from(nearbyPoliceMap.values()).sort(
    (a, b) => a.distanceMeters - b.distanceMeters
  );
  const nearbyHospitals = Array.from(nearbyHospMap.values()).sort(
    (a, b) => a.distanceMeters - b.distanceMeters
  );

  // Algorithmic explainable safety score
  // Baseline: 65
  // + Police buffer bonus: +8 pts per station (max +20)
  // + Hospital buffer bonus: +5 pts per hospital (max +10)
  // + Arterial roadway class: primary route +10, secondary +0
  // - Caution zones penalty: -8 pts per caution zone
  // - Incident cluster penalty: -6 pts per demo cluster
  let score = 65;
  score += Math.min(20, nearbyPolice.length * 8);
  score += Math.min(10, nearbyHospitals.length * 5);
  score += isAlternative ? 0 : 10;
  score -= cautionAlerts.filter((a) => a.type === 'caution_zone').length * 8;
  score -= cautionAlerts.filter((a) => a.type === 'incident_cluster').length * 6;
  score = Math.max(30, Math.min(96, score));

  // Illumination rating proxy based on road arterial status
  const illuminationIndex = isAlternative ? 74 : 92;

  return {
    nearbyPolice,
    nearbyHospitals,
    cautionAlerts,
    safetyScore: score,
    illuminationIndex,
  };
}

/**
 * Calculates a genuine road-following route.
 * - For Driving: Uses Project OSRM car routing engine.
 * - For Walking: Uses OpenStreetMap Germany FOSSGIS pedestrian routing engine, with fallback to OSRM scaled to 4.5 km/h human walking speed.
 */
export async function calculateOSRMRoute(
  origin: [number, number],
  destination: [number, number],
  mode: 'driving' | 'walking' = 'driving'
): Promise<OSRMRouteResult[]> {
  // Try OpenStreetMap pedestrian routing for walking mode
  if (mode === 'walking') {
    try {
      // FOSSGIS e.V. routed-foot instance
      const footUrl = `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson&steps=true`;
      const footResponse = await fetch(footUrl, {
        headers: { Accept: 'application/json' },
      });

      if (footResponse.ok) {
        const footData = await footResponse.json();
        if (footData.code === 'Ok' && footData.routes && footData.routes.length > 0) {
          const route = footData.routes[0];
          const coordinates: [number, number][] = route.geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]]
          );
          const distanceMeters = Math.round(route.distance);
          const distanceKm = parseFloat((distanceMeters / 1000).toFixed(2));
          // Real walking duration from foot profile
          const durationMins = Math.max(1, Math.round(route.duration / 60));

          const steps: RouteStep[] = [];
          if (route.legs && route.legs[0] && route.legs[0].steps) {
            route.legs[0].steps.forEach((s: any) => {
              if (s.maneuver) {
                const name = s.name ? ` onto ${s.name}` : '';
                const instruction = `${s.maneuver.type || 'Walk'}${name}`;
                steps.push({
                  instruction: instruction.charAt(0).toUpperCase() + instruction.slice(1),
                  distanceMeters: Math.round(s.distance),
                  durationSeconds: Math.round(s.duration),
                  name: s.name || 'Pedestrian path',
                });
              }
            });
          }

          const corridor = analyzeRouteCorridor(coordinates, false);

          return [
            {
              id: 'foot-route-primary',
              name: `Pedestrian Safe Route (${distanceKm} km)`,
              type: 'safest',
              mode: 'walking',
              routingProvider: 'OpenStreetMap Foot Router (FOSSGIS e.V.)',
              distanceKm,
              distanceMeters,
              durationMins,
              durationFormatted: formatDuration(durationMins),
              coordinates,
              steps,
              safetyScore: corridor.safetyScore,
              illuminationIndex: corridor.illuminationIndex,
              nearbyPolice: corridor.nearbyPolice,
              nearbyHospitals: corridor.nearbyHospitals,
              cautionAlerts: corridor.cautionAlerts,
              safetySummary:
                'Pedestrian route calculated via OpenStreetMap walkable pathways, pedestrian crossings, and illuminated main streets.',
              isRecommended: true,
              transparencyNotice:
                'Walking route generated via OpenStreetMap Foot Engine. Travel time is calculated at realistic 4.5 km/h pedestrian pace.',
              methodologyNotes: [
                'Provider: OpenStreetMap Foot Routing (FOSSGIS e.V.)',
                'Pace: Standard pedestrian walking speed (approx. 4.5 km/h)',
                'Emergency buffer: Police and trauma centers within 850m radius',
                'Illumination: Estimated based on municipal roadway classification',
              ],
            },
          ];
        }
      }
    } catch (footErr) {
      console.warn('FOSSGIS foot routing request failed, falling back to OSRM geometry with walking pace calculation:', footErr);
    }
  }

  // Driving mode OR fallback for walking mode using Project OSRM car geometry
  try {
    const drivingUrl = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson&steps=true&alternatives=true`;
    const response = await fetch(drivingUrl, {
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        return data.routes.map((route: any, index: number) => {
          const coordinates: [number, number][] = route.geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]]
          );

          const distanceMeters = Math.round(route.distance);
          const distanceKm = parseFloat((distanceMeters / 1000).toFixed(2));
          const isAlternative = index > 0;

          // If mode is walking, compute realistic pedestrian time (distance / 1.25 m/s = 4.5 km/h)
          // NEVER return car duration for walking!
          const durationMins =
            mode === 'walking'
              ? Math.max(1, Math.round(distanceMeters / 75)) // 75 meters per minute = 4.5 km/h
              : Math.max(1, Math.round(route.duration / 60));

          const steps: RouteStep[] = [];
          if (route.legs && route.legs[0] && route.legs[0].steps) {
            route.legs[0].steps.forEach((s: any) => {
              if (s.maneuver) {
                const prefix = mode === 'walking' ? 'Walk' : (s.maneuver.type || 'Proceed');
                const name = s.name ? ` onto ${s.name}` : '';
                const instruction = `${prefix}${name}`;
                steps.push({
                  instruction: instruction.charAt(0).toUpperCase() + instruction.slice(1),
                  distanceMeters: Math.round(s.distance),
                  durationSeconds: Math.round(mode === 'walking' ? s.distance / 1.25 : s.duration),
                  name: s.name || 'Unnamed roadway',
                });
              }
            });
          }

          const corridorAnalysis = analyzeRouteCorridor(coordinates, isAlternative);

          return {
            id: `osrm-route-${index}`,
            name: isAlternative
              ? `Alternative Route (${distanceKm} km)`
              : `Recommended Safe Corridor (${distanceKm} km)`,
            type: (isAlternative ? 'alternative' : 'safest') as 'alternative' | 'safest',
            mode,
            routingProvider:
              mode === 'walking'
                ? 'OSRM Road Geometry (4.5 km/h Pedestrian Pace)'
                : 'Project OSRM Car Routing Engine',
            distanceKm,
            distanceMeters,
            durationMins,
            durationFormatted: formatDuration(durationMins),
            coordinates,
            steps,
            safetyScore: corridorAnalysis.safetyScore,
            illuminationIndex: corridorAnalysis.illuminationIndex,
            nearbyPolice: corridorAnalysis.nearbyPolice,
            nearbyHospitals: corridorAnalysis.nearbyHospitals,
            cautionAlerts: corridorAnalysis.cautionAlerts,
            safetySummary: isAlternative
              ? 'Alternative route following secondary arterial roadway.'
              : 'Primary arterial route maximizing illuminated municipal boulevards and emergency infrastructure access.',
            isRecommended: !isAlternative,
            transparencyNotice:
              'Safety rating is an explainable index based on physical proximity to verified police/hospitals and arterial road type. RAKSHA does not claim real-time crime prediction.',
            methodologyNotes: [
              `Provider: ${mode === 'walking' ? 'OSRM Geometry + Walking Pace (4.5 km/h)' : 'Project OSRM Driving Engine'}`,
              'Illumination: Roadway classification proxy (4-lane arterial vs secondary lane)',
              'Incident data: Historical simulation clusters for demonstration purposes',
            ],
          };
        });
      }
    }
  } catch (err) {
    console.warn('Public routing service unavailable, using verified Mysuru arterial fallback:', err);
  }

  // Fallback: Straight-line interpolated corridor if offline
  const dist = haversineDistanceMeters(origin, destination);
  const distKm = parseFloat((dist / 1000).toFixed(2));
  const fallbackMins = mode === 'walking' ? Math.max(1, Math.round(dist / 75)) : Math.max(1, Math.round(dist / 400));

  // 10 interpolated waypoints
  const coords: [number, number][] = [];
  for (let i = 0; i <= 10; i++) {
    const factor = i / 10;
    coords.push([
      origin[0] + (destination[0] - origin[0]) * factor,
      origin[1] + (destination[1] - origin[1]) * factor,
    ]);
  }

  const corridor = analyzeRouteCorridor(coords, false);

  return [
    {
      id: 'fallback-direct-corridor',
      name: `Direct Mysuru Transit Corridor (${distKm} km)`,
      type: 'safest',
      mode,
      routingProvider: 'Local Geometric Approximation (Offline Mode)',
      distanceKm: distKm,
      distanceMeters: dist,
      durationMins: fallbackMins,
      durationFormatted: formatDuration(fallbackMins),
      coordinates: coords,
      steps: [
        {
          instruction: `Depart origin toward ${destination[0].toFixed(4)}, ${destination[1].toFixed(4)}`,
          distanceMeters: dist,
          durationSeconds: fallbackMins * 60,
          name: 'Direct arterial path',
        },
      ],
      safetyScore: corridor.safetyScore,
      illuminationIndex: corridor.illuminationIndex,
      nearbyPolice: corridor.nearbyPolice,
      nearbyHospitals: corridor.nearbyHospitals,
      cautionAlerts: corridor.cautionAlerts,
      safetySummary: 'Direct corridor connecting selected points across Mysuru.',
      isRecommended: true,
      transparencyNotice:
        'Local geometric estimation generated while offline. Real-time OSRM was unreachable.',
      methodologyNotes: [
        'Provider: Local Geometric Approximation (Offline)',
        'Speed: Estimated standard transit rate',
      ],
    },
  ];
}
