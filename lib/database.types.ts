export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string;
          threshold_km: number;
          emergency_threshold_km: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          avatar_url?: string;
          threshold_km?: number;
          emergency_threshold_km?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string;
          threshold_km?: number;
          emergency_threshold_km?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      vehicles: {
        Row: {
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
        Insert: {
          id?: string;
          user_id: string;
          name?: string;
          make?: string;
          model?: string;
          year?: number;
          battery_capacity_kwh?: number;
          max_range_km?: number;
          current_battery_percent?: number;
          current_range_km?: number;
          charging_type?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          make?: string;
          model?: string;
          year?: number;
          battery_capacity_kwh?: number;
          max_range_km?: number;
          current_battery_percent?: number;
          current_range_km?: number;
          charging_type?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      charging_stations: {
        Row: {
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
        Insert: {
          id?: string;
          name: string;
          address?: string;
          latitude: number;
          longitude: number;
          distance_km?: number;
          available_connectors?: number;
          total_connectors?: number;
          charging_types?: string[];
          power_kw?: number;
          is_available?: boolean;
          eta_minutes?: number;
          rating?: number;
          price_per_kwh?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          latitude?: number;
          longitude?: number;
          distance_km?: number;
          available_connectors?: number;
          total_connectors?: number;
          charging_types?: string[];
          power_kw?: number;
          is_available?: boolean;
          eta_minutes?: number;
          rating?: number;
          price_per_kwh?: number;
          created_at?: string;
        };
      };
      battery_logs: {
        Row: {
          id: string;
          vehicle_id: string;
          battery_percent: number;
          range_km: number;
          speed_kmh: number;
          ac_active: boolean;
          traffic_level: string;
          predicted_range_km: number | null;
          logged_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          battery_percent: number;
          range_km: number;
          speed_kmh?: number;
          ac_active?: boolean;
          traffic_level?: string;
          predicted_range_km?: number | null;
          logged_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          battery_percent?: number;
          range_km?: number;
          speed_kmh?: number;
          ac_active?: boolean;
          traffic_level?: string;
          predicted_range_km?: number | null;
          logged_at?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          user_id: string;
          vehicle_id: string;
          alert_type: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vehicle_id: string;
          alert_type: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          vehicle_id?: string;
          alert_type?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
  };
};
