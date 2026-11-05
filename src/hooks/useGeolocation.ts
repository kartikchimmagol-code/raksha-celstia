import { useState, useEffect } from 'react';
import { MYSURU_CENTER } from '../data/mysuruData';

export interface GeoState {
  coords: [number, number];
  isLive: boolean;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [geoState, setGeoState] = useState<GeoState>({
    coords: MYSURU_CENTER,
    isLive: false,
    accuracy: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGeoState((prev) => ({
        ...prev,
        error: 'Geolocation not supported by device. Using Mysuru center default.',
        loading: false,
      }));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setGeoState({
          coords: [position.coords.latitude, position.coords.longitude],
          isLive: true,
          accuracy: Math.round(position.coords.accuracy),
          error: null,
          loading: false,
        });
      },
      (err) => {
        setGeoState({
          coords: MYSURU_CENTER,
          isLive: false,
          accuracy: null,
          error: `${err.message} (Using Mysuru center default)`,
          loading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return geoState;
}
