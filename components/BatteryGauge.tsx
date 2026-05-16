import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Typography } from '@/constants/theme';

type Props = {
  percent: number;
  size?: number;
  showLabel?: boolean;
  animated?: boolean;
};

export function BatteryGauge({ percent, size = 200, showLabel = true }: Props) {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const batteryColor =
    clampedPercent > 60 ? Colors.batteryHigh
    : clampedPercent > 30 ? Colors.batteryMedium
    : clampedPercent > 15 ? Colors.batteryLow
    : Colors.batteryCritical;

  const strokeWidth = size * 0.06;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (clampedPercent / 100) * circumference;
  const gap = circumference - progress;

  const center = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={Colors.surface}
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={batteryColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${progress} ${gap}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          opacity={0.9}
        />
        {/* Glow effect */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={batteryColor}
          strokeWidth={strokeWidth * 0.4}
          strokeDasharray={`${progress} ${gap}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          opacity={0.3}
          filter="url(#glow)"
        />
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[styles.percentText, { color: batteryColor }]}>
            {Math.round(clampedPercent)}
          </Text>
          <Text style={styles.unitText}>%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    fontSize: 42,
    fontWeight: '700',
    lineHeight: 48,
  },
  unitText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
