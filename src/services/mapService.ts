import {
  MYSURU_ALL_POIS,
  MYSURU_CITY_CENTER,
  searchMysuruPOIs,
  MysuruPOI,
} from '../data/mysuruLocations';
import {
  calculateOSRMRoute,
  OSRMRouteResult,
  haversineDistanceMeters,
} from './osrmRoutingService';

export interface SearchResult {
  placeId: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  type: string;
  category?: string;
  phone?: string;
  details?: string;
}

export interface CalculatedRoute {
  id: string;
  name: string;
  type: 'safest' | 'fastest' | 'alternative';
  distanceKm: number;
  durationMins: number;
  safetyScore: number; // 0-100
  lightingIndex: number; // 0-100%
  policeProximityScore: number; // 0-100%
  geometry: [number, number][]; // [lat, lng]
  summary: string;
  safetyFactors: {
    title: string;
    description: string;
    impact: 'positive' | 'neutral' | 'caution';
  }[];
  isIlluminatedCorridor: boolean;
  transparencyNotice: string;
  steps?: {
    instruction: string;
    distanceMeters: number;
    durationSeconds: number;
  }[];
  nearbyPoliceCount?: number;
  nearbyHospitalsCount?: number;
}

/**
 * Searches locations using verified Mysuru POIs first, then OpenStreetMap Nominatim
 */
export async function searchLocations(query: string): Promise<SearchResult[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  // Match local verified POIs (VVCE, Railway Station, Hospitals, Police Stations, etc.)
  const localMatched = searchMysuruPOIs(cleanQuery);
  const localResults: SearchResult[] = localMatched.map((poi) => ({
    placeId: poi.id,
    name: poi.name,
    displayName: `${poi.name}, ${poi.address}`,
    lat: poi.lat,
    lng: poi.lng,
    type: poi.category,
    category: poi.category,
    phone: poi.phone,
    details: poi.details,
  }));

  try {
    // Call OpenStreetMap Nominatim for wider street addresses in Mysuru
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query + ', Mysuru, Karnataka'
      )}&viewbox=76.50,12.42,76.78,12.18&bounded=0&addressdetails=1&limit=5`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'RakshaCelestiaSafetyApp/2.0',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const nominatimResults: SearchResult[] = data.map((item: any) => ({
        placeId: `osm-${item.place_id}`,
        name: item.name || item.display_name.split(',')[0],
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type || 'place',
      }));

      // Combine unique results, prioritizing verified local POIs
      const combined = [...localResults];
      nominatimResults.forEach((nr) => {
        if (
          !combined.some(
            (c) =>
              Math.abs(c.lat - nr.lat) < 0.0015 &&
              Math.abs(c.lng - nr.lng) < 0.0015
          )
        ) {
          combined.push(nr);
        }
      });
      return combined.slice(0, 8);
    }
  } catch (err) {
    console.warn('Nominatim search request failed, using verified local POIs:', err);
  }

  return localResults;
}

/**
 * Bridge function to calculate real OSRM routes, adapting OSRMRouteResult to CalculatedRoute format
 */
export async function getCalculatedRoutes(
  origin: [number, number],
  dest: [number, number],
  mode: 'driving' | 'walking' = 'driving'
): Promise<CalculatedRoute[]> {
  try {
    const osrmResults: OSRMRouteResult[] = await calculateOSRMRoute(origin, dest, mode);

    return osrmResults.map((r, index) => {
      const safetyFactors = [
        {
          title: 'Emergency Proximity Corridor',
          description: `${r.nearbyPolice.length} police stations and ${r.nearbyHospitals.length} tertiary hospitals within 850m buffer.`,
          impact: (r.nearbyPolice.length > 0 ? 'positive' : 'neutral') as 'positive' | 'neutral',
        },
        {
          title: 'Illumination & Transit Density',
          description: `${r.illuminationIndex}% assessed arterial illumination based on road classification.`,
          impact: (r.illuminationIndex >= 80 ? 'positive' : 'caution') as 'positive' | 'caution',
        },
      ];

      if (r.cautionAlerts.length > 0) {
        r.cautionAlerts.forEach((alert) => {
          safetyFactors.push({
            title: `Caution Notice: ${alert.title}`,
            description: alert.reason,
            impact: 'caution',
          });
        });
      } else {
        safetyFactors.push({
          title: 'Zero Incident Zones',
          description: 'No known caution zones or historical incident clusters along this corridor.',
          impact: 'positive',
        });
      }

      return {
        id: r.id,
        name: r.name,
        type: (index === 0 ? 'safest' : 'alternative') as 'safest' | 'alternative',
        distanceKm: r.distanceKm,
        durationMins: r.durationMins,
        safetyScore: r.safetyScore,
        lightingIndex: r.illuminationIndex,
        policeProximityScore: Math.min(100, r.nearbyPolice.length * 35),
        geometry: r.coordinates,
        summary: r.safetySummary,
        safetyFactors,
        isIlluminatedCorridor: r.illuminationIndex >= 80,
        transparencyNotice: r.transparencyNotice,
        steps: r.steps,
        nearbyPoliceCount: r.nearbyPolice.length,
        nearbyHospitalsCount: r.nearbyHospitals.length,
      };
    });
  } catch (error) {
    console.error('Error fetching OSRM routes:', error);
    return [];
  }
}
