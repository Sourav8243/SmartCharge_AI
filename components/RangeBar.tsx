import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '@/constants/theme';

type Props = {
  label: string;
  value: number;
  maxValue: number;
  unit?: string;
  color?: string;
  showValue?: boolean;
};

export function RangeBar({
  label,
  value,
  maxValue,
  unit = '',
  color = Colors.primary,
  showValue = true,
}: Props) {
  const percent = Math.max(0, Math.min(100, (value / maxValue) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {showValue && (
          <Text style={[styles.value, { color }]}>
            {Math.round(value)} {unit}
          </Text>
        )}
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  value: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
  },
  track: {
    height: 6,
    backgroundColor: Colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
