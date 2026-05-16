export type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
  threshold_km: number;
  emergency_threshold_km: number;
  created_at: string;
  updated_at: string;
};

export type Vehicle = {
  id: string;
  user_id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  battery_capacity_kwh: number;
  max_range_km: number;
  current_battery_percent: number;
  current_range_km: number;
  charging_type: string;
  is_active: boolean;
  created_at: string;
};

export type ChargingStation = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  available_connectors: number;
  total_connectors: number;
  charging_types: string[];
  power_kw: number;
  is_available: boolean;
  eta_minutes: number;
  rating: number;
  price_per_kwh: number;
  created_at: string;
};

export type BatteryLog = {
  id: string;
  vehicle_id: string;
  battery_percent: number;
  range_km: number;
  speed_kmh: number;
  ac_active: boolean;
  traffic_level: 'low' | 'medium' | 'high';
  predicted_range_km: number;
  logged_at: string;
};

export type Alert = {
  id: string;
  user_id: string;
  vehicle_id: string;
  alert_type: 'low_battery' | 'critical' | 'station_found';
  message: string;
  is_read: boolean;
  created_at: string;
};

export type BatterySimulationState = {
  batteryPercent: number;
  rangeKm: number;
  speedKmh: number;
  acActive: boolean;
  trafficLevel: 'low' | 'medium' | 'high';
  predictedRangeKm: number;
  isCharging: boolean;
};

export type RangePredictionInput = {
  batteryPercent: number;
  maxRangeKm: number;
  speedKmh: number;
  acActive: boolean;
  trafficLevel: 'low' | 'medium' | 'high';
};
