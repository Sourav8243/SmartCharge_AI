/*
  # SmartCharge AI - Initial Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `avatar_url` (text)
      - `threshold_km` (integer, default 50) - battery range alert threshold
      - `emergency_threshold_km` (integer, default 15) - critical battery threshold
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `vehicles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text) - vehicle name
      - `make` (text) - manufacturer
      - `model` (text) - model name
      - `year` (integer)
      - `battery_capacity_kwh` (numeric) - total battery capacity
      - `max_range_km` (integer) - max range at full charge
      - `current_battery_percent` (numeric, default 100)
      - `current_range_km` (numeric)
      - `charging_type` (text) - e.g. "CCS", "CHAdeMO", "Type2"
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)

    - `charging_stations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `distance_km` (numeric) - distance from user
      - `available_connectors` (integer)
      - `total_connectors` (integer)
      - `charging_types` (text array) - e.g. {"CCS", "CHAdeMO", "Type2"}
      - `power_kw` (numeric) - max charging power
      - `is_available` (boolean)
      - `eta_minutes` (integer) - estimated arrival time
      - `rating` (numeric) - user rating 1-5
      - `price_per_kwh` (numeric)
      - `created_at` (timestamptz)

    - `battery_logs`
      - `id` (uuid, primary key)
      - `vehicle_id` (uuid, references vehicles)
      - `battery_percent` (numeric)
      - `range_km` (numeric)
      - `speed_kmh` (numeric)
      - `ac_active` (boolean)
      - `traffic_level` (text) - "low", "medium", "high"
      - `predicted_range_km` (numeric) - AI predicted range
      - `logged_at` (timestamptz)

    - `alerts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `vehicle_id` (uuid, references vehicles)
      - `alert_type` (text) - "low_battery", "critical", "station_found"
      - `message` (text)
      - `is_read` (boolean, default false)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own profiles, vehicles, alerts, and battery logs
    - Charging stations are readable by all authenticated users
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  avatar_url text DEFAULT '',
  threshold_km integer DEFAULT 50,
  emergency_threshold_km integer DEFAULT 15,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text DEFAULT 'My EV',
  make text DEFAULT '',
  model text DEFAULT '',
  year integer DEFAULT 2024,
  battery_capacity_kwh numeric DEFAULT 75.0,
  max_range_km integer DEFAULT 400,
  current_battery_percent numeric DEFAULT 100,
  current_range_km numeric DEFAULT 400,
  charging_type text DEFAULT 'CCS',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own vehicles"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own vehicles"
  ON vehicles FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Charging stations table
CREATE TABLE IF NOT EXISTS charging_stations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text DEFAULT '',
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  distance_km numeric DEFAULT 0,
  available_connectors integer DEFAULT 1,
  total_connectors integer DEFAULT 4,
  charging_types text[] DEFAULT ARRAY['CCS', 'Type2'],
  power_kw numeric DEFAULT 50,
  is_available boolean DEFAULT true,
  eta_minutes integer DEFAULT 10,
  rating numeric DEFAULT 4.0,
  price_per_kwh numeric DEFAULT 0.30,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE charging_stations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read charging stations"
  ON charging_stations FOR SELECT
  TO authenticated
  USING (true);

-- Battery logs table
CREATE TABLE IF NOT EXISTS battery_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  battery_percent numeric NOT NULL,
  range_km numeric NOT NULL,
  speed_kmh numeric DEFAULT 0,
  ac_active boolean DEFAULT false,
  traffic_level text DEFAULT 'low',
  predicted_range_km numeric,
  logged_at timestamptz DEFAULT now()
);

ALTER TABLE battery_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own battery logs"
  ON battery_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vehicles
      WHERE vehicles.id = battery_logs.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own battery logs"
  ON battery_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vehicles
      WHERE vehicles.id = battery_logs.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  alert_type text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own alerts"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own alerts"
  ON alerts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_battery_logs_vehicle_id ON battery_logs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_charging_stations_location ON charging_stations(latitude, longitude);
