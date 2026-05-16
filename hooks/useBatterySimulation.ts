import { useState, useEffect, useRef, useCallback } from 'react';
import { createBatterySimulator } from '@/lib/battery-simulation';
import type { BatterySimulationState } from '@/types';

export function useBatterySimulation(maxRangeKm: number = 400, initialPercent: number = 78) {
  const simulatorRef = useRef(createBatterySimulator(maxRangeKm, initialPercent));
  const [state, setState] = useState<BatterySimulationState>(simulatorRef.current.getState());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    const newState = simulatorRef.current.tick();
    setState({ ...newState });
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(tick, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tick]);

  const toggleAC = useCallback(() => {
    return simulatorRef.current.toggleAC();
  }, []);

  const setTrafficLevel = useCallback((level: 'low' | 'medium' | 'high') => {
    simulatorRef.current.setTrafficLevel(level);
    setState({ ...simulatorRef.current.getState() });
  }, []);

  const setSpeed = useCallback((speed: number) => {
    simulatorRef.current.setSpeed(speed);
    setState({ ...simulatorRef.current.getState() });
  }, []);

  const startCharging = useCallback(() => {
    simulatorRef.current.startCharging();
    setState({ ...simulatorRef.current.getState() });
  }, []);

  const stopCharging = useCallback(() => {
    simulatorRef.current.stopCharging();
    setState({ ...simulatorRef.current.getState() });
  }, []);

  const reset = useCallback(() => {
    simulatorRef.current.reset();
    setState({ ...simulatorRef.current.getState() });
  }, []);

  return {
    state,
    toggleAC,
    setTrafficLevel,
    setSpeed,
    startCharging,
    stopCharging,
    reset,
  };
}
