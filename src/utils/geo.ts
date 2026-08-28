import { ChargingStation, SearchTarget } from '../types';

/**
 * Calculates the great-circle distance between two points on the Earth (in meters)
 * using the Haversine formula.
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Formats distance into a human-friendly string (e.g., "350 m" or "1.2 km")
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Estimates walking time in minutes (assumes ~4.8 km/h or 80 m/min)
 */
export function formatWalkingEta(meters: number): string {
  const minutes = Math.max(1, Math.round(meters / 80));
  if (minutes < 60) {
    return `~${minutes} min walk`;
  }
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `~${hrs}h ${mins}m walk`;
}

/**
 * Estimates driving time in minutes (assumes SG urban speed ~30 km/h or 500 m/min)
 */
export function formatDrivingEta(meters: number): string {
  const minutes = Math.max(1, Math.round(meters / 450));
  return `~${minutes} min drive`;
}

/**
 * Enriches a list of charging stations with distance and within-boundary checks
 */
export function enrichStationsWithDistance(
  stations: ChargingStation[],
  target: SearchTarget,
  radiusMeters = 500
): ChargingStation[] {
  return stations.map((station) => {
    const dist = calculateDistanceMeters(
      target.latitude,
      target.longitude,
      station.latitude,
      station.longitude
    );
    return {
      ...station,
      distanceMeters: dist,
      isWithin500m: dist <= radiusMeters,
    };
  });
}

/**
 * Calculates aggregate stats for chargers strictly within a radius
 */
export function calculateRadiusStats(
  stations: ChargingStation[],
  radiusMeters = 500
) {
  const withinZone = stations.filter(
    (s) => (s.distanceMeters ?? Infinity) <= radiusMeters
  );

  const totalStations = withinZone.length;
  const totalBays = withinZone.reduce((acc, s) => acc + s.totalBays, 0);
  const availableBays = withinZone.reduce((acc, s) => acc + s.availableBays, 0);
  const occupiedBays = withinZone.reduce((acc, s) => acc + s.occupiedBays, 0);
  const offlineBays = withinZone.reduce((acc, s) => acc + s.offlineBays, 0);

  const fastChargersAvailable = withinZone.reduce((acc, s) => {
    const dcAvailable = s.connectors
      .filter((c) => c.currentType === 'DC' && c.powerKw >= 50)
      .reduce((sum, c) => sum + c.available, 0);
    return acc + dcAvailable;
  }, 0);

  const totalFastChargers = withinZone.reduce((acc, s) => {
    const dcTotal = s.connectors
      .filter((c) => c.currentType === 'DC' && c.powerKw >= 50)
      .reduce((sum, c) => sum + c.total, 0);
    return acc + dcTotal;
  }, 0);

  const availabilityRate = totalBays > 0 ? Math.round((availableBays / totalBays) * 100) : 0;

  return {
    totalStations,
    totalBays,
    availableBays,
    occupiedBays,
    offlineBays,
    fastChargersAvailable,
    totalFastChargers,
    availabilityRate,
    withinZoneStations: withinZone,
  };
}
