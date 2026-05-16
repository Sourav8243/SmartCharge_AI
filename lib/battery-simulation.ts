import type { BatterySimulationState } from '@/types';

const DRAIN_RATE_BASE = 0.05; // base drain per tick
const SPEED_FACTOR = 0.002; // additional drain per km/h
const AC_DRAIN = 0.03; // additional drain when AC is on
const TRAFFIC_FACTOR = { low: 1.0, medium: 1.15, high: 1.35 };
const CHARGE_RATE = 0.5; // percent per tick when charging

export function createBatterySimulator(
  maxRangeKm: number,
  initialPercent: number = 78
): {
  getState: () => BatterySimulationState;
  tick: () => BatterySimulationState;
  toggleAC: () => boolean;
  setTrafficLevel: (level: 'low' | 'medium' | 'high') => void;
  setSpeed: (speed: number) => void;
  startCharging: () => void;
  stopCharging: () => void;
  reset: () => void;
} {
  const state: BatterySimulationState = {
    batteryPercent: initialPercent,
    rangeKm: (initialPercent / 100) * maxRangeKm,
    speedKmh: 60,
    acActive: false,
    trafficLevel: 'low',
    predictedRangeKm: (initialPercent / 100) * maxRangeKm,
    isCharging: false,
  };

  const predictRange = () => {
    const baseRange = (state.batteryPercent / 100) * maxRangeKm;
    const speedPenalty = 1 - Math.min(state.speedKmh / 200, 0.4);
    const acPenalty = state.acActive ? 0.85 : 1.0;
    const trafficPenalty =
      state.trafficLevel === 'low'
        ? 1.0
        : state.trafficLevel === 'medium'
          ? 0.88
          : 0.72;
    return Math.round(baseRange * speedPenalty * acPenalty * trafficPenalty);
  };

  return {
    getState: () => ({ ...state }),
    tick: () => {
      if (state.isCharging) {
        state.batteryPercent = Math.min(100, state.batteryPercent + CHARGE_RATE);
      } else {
        const trafficMult = TRAFFIC_FACTOR[state.trafficLevel];
        const drain =
          DRAIN_RATE_BASE * trafficMult +
          SPEED_FACTOR * state.speedKmh +
          (state.acActive ? AC_DRAIN : 0);
        state.batteryPercent = Math.max(0, state.batteryPercent - drain);
      }
      state.rangeKm = (state.batteryPercent / 100) * maxRangeKm;
      state.predictedRangeKm = predictRange();
      return { ...state };
    },
    toggleAC: () => {
      state.acActive = !state.acActive;
      return state.acActive;
    },
    setTrafficLevel: (level) => {
      state.trafficLevel = level;
    },
    setSpeed: (speed) => {
      state.speedKmh = Math.max(0, speed);
    },
    startCharging: () => {
      state.isCharging = true;
      state.speedKmh = 0;
    },
    stopCharging: () => {
      state.isCharging = false;
    },
    reset: () => {
      state.batteryPercent = initialPercent;
      state.rangeKm = (initialPercent / 100) * maxRangeKm;
      state.speedKmh = 60;
      state.acActive = false;
      state.trafficLevel = 'low';
      state.predictedRangeKm = (initialPercent / 100) * maxRangeKm;
      state.isCharging = false;
    },
  };
}
