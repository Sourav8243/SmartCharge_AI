import type { ChargingStation } from '@/types';

// Mock charging stations around a default location (San Francisco area)
export const MOCK_STATIONS: Omit<ChargingStation, 'id' | 'created_at'>[] = [
  {
    name: 'Electrify America - Bay Street',
    address: 'Bay St & Battery St, San Francisco, CA',
    latitude: 37.7955,
    longitude: -122.3937,
    distance_km: 1.2,
    available_connectors: 3,
    total_connectors: 6,
    charging_types: ['CCS', 'CHAdeMO'],
    power_kw: 350,
    is_available: true,
    eta_minutes: 5,
    rating: 4.5,
    price_per_kwh: 0.43,
  },
  {
    name: 'Tesla Supercharger - Fishermans Wharf',
    address: '425 Beach St, San Francisco, CA',
    latitude: 37.8065,
    longitude: -122.4172,
    distance_km: 2.8,
    available_connectors: 8,
    total_connectors: 12,
    charging_types: ['Tesla', 'CCS'],
    power_kw: 250,
    is_available: true,
    eta_minutes: 8,
    rating: 4.7,
    price_per_kwh: 0.38,
  },
  {
    name: 'ChargePoint - Embarcadero Center',
    address: '1 Embarcadero Ctr, San Francisco, CA',
    latitude: 37.7952,
    longitude: -122.3968,
    distance_km: 1.5,
    available_connectors: 2,
    total_connectors: 4,
    charging_types: ['Type2', 'CCS'],
    power_kw: 62,
    is_available: true,
    eta_minutes: 6,
    rating: 4.2,
    price_per_kwh: 0.35,
  },
  {
    name: 'EVgo - Mission Street',
    address: '550 Mission St, San Francisco, CA',
    latitude: 37.7891,
    longitude: -122.3985,
    distance_km: 3.1,
    available_connectors: 1,
    total_connectors: 4,
    charging_types: ['CCS', 'CHAdeMO'],
    power_kw: 150,
    is_available: true,
    eta_minutes: 10,
    rating: 3.9,
    price_per_kwh: 0.40,
  },
  {
    name: 'Blink - SoMa District',
    address: '500 Howard St, San Francisco, CA',
    latitude: 37.7875,
    longitude: -122.3955,
    distance_km: 3.5,
    available_connectors: 0,
    total_connectors: 2,
    charging_types: ['Type2'],
    power_kw: 22,
    is_available: false,
    eta_minutes: 12,
    rating: 3.5,
    price_per_kwh: 0.30,
  },
  {
    name: 'Electrify America - Westfield Mall',
    address: '865 Market St, San Francisco, CA',
    latitude: 37.7842,
    longitude: -122.4065,
    distance_km: 4.2,
    available_connectors: 4,
    total_connectors: 8,
    charging_types: ['CCS', 'CHAdeMO', 'Type2'],
    power_kw: 350,
    is_available: true,
    eta_minutes: 14,
    rating: 4.6,
    price_per_kwh: 0.41,
  },
  {
    name: 'ChargePoint - Marina District',
    address: '3000 Fillmore St, San Francisco, CA',
    latitude: 37.7985,
    longitude: -122.4355,
    distance_km: 5.8,
    available_connectors: 2,
    total_connectors: 4,
    charging_types: ['Type2', 'CCS'],
    power_kw: 50,
    is_available: true,
    eta_minutes: 18,
    rating: 4.0,
    price_per_kwh: 0.32,
  },
  {
    name: 'Tesla Supercharger - Daly City',
    address: '101 Hickey Blvd, Daly City, CA',
    latitude: 37.6825,
    longitude: -122.4715,
    distance_km: 8.5,
    available_connectors: 10,
    total_connectors: 16,
    charging_types: ['Tesla', 'CCS'],
    power_kw: 250,
    is_available: true,
    eta_minutes: 22,
    rating: 4.8,
    price_per_kwh: 0.36,
  },
  {
    name: 'EVgo - Oakland Airport',
    address: '1 Airport Dr, Oakland, CA',
    latitude: 37.7125,
    longitude: -122.2225,
    distance_km: 9.8,
    available_connectors: 5,
    total_connectors: 8,
    charging_types: ['CCS', 'CHAdeMO'],
    power_kw: 350,
    is_available: true,
    eta_minutes: 25,
    rating: 4.3,
    price_per_kwh: 0.39,
  },
  {
    name: 'Blink - Pacific Heights',
    address: '2340 Pine St, San Francisco, CA',
    latitude: 37.7865,
    longitude: -122.4415,
    distance_km: 6.2,
    available_connectors: 1,
    total_connectors: 2,
    charging_types: ['Type2'],
    power_kw: 22,
    is_available: true,
    eta_minutes: 20,
    rating: 3.7,
    price_per_kwh: 0.28,
  },
];

// Get stations sorted by distance
export function getNearbyStations(
  radiusKm: number = 10
): Omit<ChargingStation, 'id' | 'created_at'>[] {
  return MOCK_STATIONS.filter((s) => s.distance_km <= radiusKm).sort(
    (a, b) => a.distance_km - b.distance_km
  );
}

// Get the nearest available station
export function getNearestAvailableStation(): Omit<ChargingStation, 'id' | 'created_at'> | null {
  const available = MOCK_STATIONS.filter((s) => s.is_available);
  if (available.length === 0) return null;
  return available.sort((a, b) => a.distance_km - b.distance_km)[0];
}

// Get fastest reachable station for emergency
export function getFastestReachableStation(
  currentRangeKm: number
): Omit<ChargingStation, 'id' | 'created_at'> | null {
  const reachable = MOCK_STATIONS.filter(
    (s) => s.is_available && s.distance_km < currentRangeKm * 0.85
  );
  if (reachable.length === 0) return null;
  return reachable.sort((a, b) => a.eta_minutes - b.eta_minutes)[0];
}
