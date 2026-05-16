import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle, Zap, MapPin, X } from 'lucide-react-native';
import { Colors, BorderRadius, Spacing, Typography } from '@/constants/theme';

type AlertType = 'low_battery' | 'critical' | 'station_found';

type Props = {
  type: AlertType;
  message: string;
  onDismiss?: () => void;
  onPress?: () => void;
};

const ALERT_CONFIG: Record<AlertType, { icon: React.ElementType; color: string; bg: string }> = {
  low_battery: { icon: AlertTriangle, color: Colors.warning, bg: 'rgba(255,149,0,0.12)' },
  critical: { icon: Zap, color: Colors.critical, bg: 'rgba(255,45,85,0.12)' },
  station_found: { icon: MapPin, color: Colors.primary, bg: 'rgba(0,212,170,0.12)' },
};

export function AlertBanner({ type, message, onDismiss, onPress }: Props) {
  const config = ALERT_CONFIG[type];
  const Icon = config.icon;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: config.bg, borderColor: config.color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconWrap, { backgroundColor: config.color + '22' }]}>
        <Icon size={18} color={config.color} />
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: config.color }]}>
          {type === 'low_battery' ? 'Low Battery' : type === 'critical' ? 'Critical Battery' : 'Station Found'}
        </Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissBtn}>
          <X size={16} color={Colors.textTertiary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    marginBottom: 2,
  },
  message: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  dismissBtn: {
    padding: Spacing.xs,
  },
});
