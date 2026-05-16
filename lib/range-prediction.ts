import type { RangePredictionInput } from '@/types';

// AI-based range prediction using weighted factors
export function predictRange(input: RangePredictionInput): number {
  const { batteryPercent, maxRangeKm, speedKmh, acActive, trafficLevel } = input;

  const baseRange = (batteryPercent / 100) * maxRangeKm;

  // Speed penalty: higher speed = more energy consumption
  // Optimal speed ~50 km/h, penalty increases above that
  const speedPenalty = speedKmh <= 50
    ? 1.0
    : 1 - ((speedKmh - 50) / 200) * 0.45;

  // AC penalty: ~15% range reduction
  const acPenalty = acActive ? 0.85 : 1.0;

  // Traffic penalty: stop-and-go reduces efficiency
  const trafficPenalty =
    trafficLevel === 'low' ? 1.0
    : trafficLevel === 'medium' ? 0.88
    : 0.72;

  // Driving behavior factor (simulated as slight randomness)
  const behaviorFactor = 0.95 + Math.random() * 0.1;

  const predicted = baseRange * speedPenalty * acPenalty * trafficPenalty * behaviorFactor;
  return Math.round(Math.max(0, predicted));
}

// Get confidence level for the prediction
export function getPredictionConfidence(input: RangePredictionInput): {
  level: 'high' | 'medium' | 'low';
  percent: number;
} {
  const { speedKmh, trafficLevel } = input;

  let confidence = 90;

  // Higher speed = less predictable
  if (speedKmh > 100) confidence -= 15;
  else if (speedKmh > 80) confidence -= 8;

  // Heavy traffic = less predictable
  if (trafficLevel === 'high') confidence -= 15;
  else if (trafficLevel === 'medium') confidence -= 8;

  // Add slight randomness
  confidence += (Math.random() - 0.5) * 6;

  const level =
    confidence >= 80 ? 'high'
    : confidence >= 60 ? 'medium'
    : 'low';

  return { level, percent: Math.round(confidence) };
}

// Estimate time to reach a charging station
export function estimateArrivalTime(
  distanceKm: number,
  speedKmh: number,
  trafficLevel: 'low' | 'medium' | 'high'
): number {
  const trafficMultiplier =
    trafficLevel === 'low' ? 1.0
    : trafficLevel === 'medium' ? 1.3
    : 1.8;

  const effectiveSpeed = Math.max(speedKmh * 0.7, 20); // assume 70% of speed for city driving
  const timeMinutes = (distanceKm / effectiveSpeed) * 60 * trafficMultiplier;
  return Math.round(timeMinutes);
}

// Check if a station is reachable with current battery
export function isStationReachable(
  distanceKm: number,
  currentRangeKm: number,
  safetyMargin: number = 0.15
): boolean {
  return distanceKm < currentRangeKm * (1 - safetyMargin);
}
