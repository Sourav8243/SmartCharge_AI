import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Zap,
  MapPin,
  Battery,
  Gauge,
  Wind,
  Thermometer,
  AlertTriangle,
  Navigation,
  TrendingUp,
  Clock,
} from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { BatteryGauge } from '@/components/BatteryGauge';
import { StatCard } from '@/components/StatCard';
import { AlertBanner } from '@/components/AlertBanner';
import { SectionHeader, Badge } from '@/components/ThemedComponents';
import { StationCard } from '@/components/StationCard';
import { useBatterySimulation } from '@/hooks/useBatterySimulation';
import { getNearbyStations, getNearestAvailableStation } from '@/lib/mock-stations';
import { predictRange, getPredictionConfidence } from '@/lib/range-prediction';
import type { Alert as AlertType } from '@/types';

export default function DashboardScreen() {
  const router = useRouter();
  const { state: battery, toggleAC, setTrafficLevel } = useBatterySimulation(400, 78);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [thresholdKm] = useState(50);

  const nearbyStations = getNearbyStations(10);
  const nearestStation = getNearestAvailableStation();

  const predictedRange = predictRange({
    batteryPercent: battery.batteryPercent,
    maxRangeKm: 400,
    speedKmh: battery.speedKmh,
    acActive: battery.acActive,
    trafficLevel: battery.trafficLevel,
  });

  const confidence = getPredictionConfidence({
    batteryPercent: battery.batteryPercent,
    maxRangeKm: 400,
    speedKmh: battery.speedKmh,
    acActive: battery.acActive,
    trafficLevel: battery.trafficLevel,
  });

  // Generate alerts based on battery state
  useEffect(() => {
    const newAlerts: AlertType[] = [];
    if (battery.rangeKm < 15) {
      newAlerts.push({
        id: 'critical',
        user_id: '',
        vehicle_id: '',
        alert_type: 'critical',
        message: `Critical battery! Only ${Math.round(battery.rangeKm)} km remaining. Find the nearest station immediately.`,
        is_read: false,
        created_at: new Date().toISOString(),
      });
    } else if (battery.rangeKm < thresholdKm) {
      newAlerts.push({
        id: 'low_battery',
        user_id: '',
        vehicle_id: '',
        alert_type: 'low_battery',
        message: `Range below ${thresholdKm} km threshold. ${Math.round(battery.rangeKm)} km remaining. Consider charging soon.`,
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }
    if (nearestStation && battery.rangeKm < thresholdKm) {
      newAlerts.push({
        id: 'station_found',
        user_id: '',
        vehicle_id: '',
        alert_type: 'station_found',
        message: `${nearestStation.name} is ${nearestStation.distance_km.toFixed(1)} km away with ${nearestStation.available_connectors} connectors available.`,
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }
    setAlerts(newAlerts);
  }, [battery.rangeKm, thresholdKm, nearestStation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const batteryColor =
    battery.batteryPercent > 60
      ? Colors.batteryHigh
      : battery.batteryPercent > 30
        ? Colors.batteryMedium
        : battery.batteryPercent > 15
          ? Colors.batteryLow
          : Colors.batteryCritical;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}</Text>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.emergencyButton} onPress={() => router.push('/(tabs)/emergency')}>
          <AlertTriangle size={16} color={Colors.critical} />
          <Text style={styles.emergencyButtonText}>SOS</Text>
        </TouchableOpacity>
      </View>

      {/* Alerts */}
      {alerts.map((alert) => (
        <AlertBanner
          key={alert.id}
          type={alert.alert_type as 'low_battery' | 'critical' | 'station_found'}
          message={alert.message}
          onPress={alert.alert_type === 'station_found' ? () => router.push('/(tabs)/stations') : undefined}
          onDismiss={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
        />
      ))}

      {/* Battery Gauge */}
      <View style={styles.gaugeSection}>
        <BatteryGauge percent={battery.batteryPercent} size={220} />
        <View style={styles.rangeInfo}>
          <Text style={[styles.rangeValue, { color: batteryColor }]}>{Math.round(battery.rangeKm)}</Text>
          <Text style={styles.rangeUnit}>km range</Text>
        </View>
      </View>

      {/* AI Prediction */}
      <View style={styles.predictionCard}>
        <View style={styles.predictionHeader}>
          <TrendingUp size={16} color={Colors.primary} />
          <Text style={styles.predictionTitle}>AI Range Prediction</Text>
          <Badge
            label={`${confidence.percent}% confidence`}
            color={confidence.level === 'high' ? Colors.success : confidence.level === 'medium' ? Colors.warning : Colors.error}
          />
        </View>
        <View style={styles.predictionRow}>
          <View style={styles.predictionItem}>
            <Text style={styles.predictionLabel}>Estimated Range</Text>
            <Text style={[styles.predictionValue, { color: Colors.primary }]}>{predictedRange} km</Text>
          </View>
          <View style={styles.predictionDivider} />
          <View style={styles.predictionItem}>
            <Text style={styles.predictionLabel}>Current Range</Text>
            <Text style={[styles.predictionValue, { color: batteryColor }]}>{Math.round(battery.rangeKm)} km</Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Battery"
          value={Math.round(battery.batteryPercent)}
          unit="%"
          color={batteryColor}
          icon={<Battery size={14} color={batteryColor} />}
        />
        <StatCard
          title="Speed"
          value={Math.round(battery.speedKmh)}
          unit="km/h"
          color={Colors.secondary}
          icon={<Gauge size={14} color={Colors.secondary} />}
        />
        <StatCard
          title="AC Status"
          value={battery.acActive ? 'ON' : 'OFF'}
          color={battery.acActive ? Colors.warning : Colors.textTertiary}
          icon={<Thermometer size={14} color={battery.acActive ? Colors.warning : Colors.textTertiary} />}
        />
        <StatCard
          title="Traffic"
          value={battery.trafficLevel.charAt(0).toUpperCase() + battery.trafficLevel.slice(1)}
          color={battery.trafficLevel === 'low' ? Colors.success : battery.trafficLevel === 'medium' ? Colors.warning : Colors.error}
          icon={<Wind size={14} color={Colors.textTertiary} />}
        />
      </View>

      {/* Quick Controls */}
      <View style={styles.controlsSection}>
        <SectionHeader title="Quick Controls" />
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.controlButton, battery.acActive && styles.controlButtonActive]}
            onPress={toggleAC}
          >
            <Thermometer size={20} color={battery.acActive ? Colors.warning : Colors.textTertiary} />
            <Text style={[styles.controlLabel, battery.acActive && { color: Colors.warning }]}>
              AC {battery.acActive ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
          {(['low', 'medium', 'high'] as const).map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.controlButton, battery.trafficLevel === level && styles.controlButtonActive]}
              onPress={() => setTrafficLevel(level)}
            >
              <Wind
                size={20}
                color={
                  battery.trafficLevel === level
                    ? level === 'low' ? Colors.success : level === 'medium' ? Colors.warning : Colors.error
                    : Colors.textTertiary
                }
              />
              <Text
                style={[
                  styles.controlLabel,
                  battery.trafficLevel === level && {
                    color: level === 'low' ? Colors.success : level === 'medium' ? Colors.warning : Colors.error,
                  },
                ]}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Nearest Station */}
      {nearestStation && (
        <View style={styles.nearestSection}>
          <SectionHeader
            title="Nearest Station"
            subtitle={`${nearbyStations.length} stations within 10 km`}
            action={
              <TouchableOpacity onPress={() => router.push('/(tabs)/stations')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            }
          />
          <StationCard
            station={nearestStation}
            isRecommended
            onNavigate={() => router.push('/(tabs)/navigation')}
            onSelect={() => router.push('/(tabs)/stations')}
          />
        </View>
      )}

      {/* Recent Activity */}
      <View style={styles.activitySection}>
        <SectionHeader title="Vehicle Status" />
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <Clock size={16} color={Colors.textTertiary} />
            <Text style={styles.activityLabel}>Charging Status</Text>
            <Text style={[styles.activityValue, { color: battery.isCharging ? Colors.success : Colors.textSecondary }]}>
              {battery.isCharging ? 'Charging' : 'Not Charging'}
            </Text>
          </View>
          <View style={styles.activityDivider} />
          <View style={styles.activityItem}>
            <Zap size={16} color={Colors.textTertiary} />
            <Text style={styles.activityLabel}>Energy Consumption</Text>
            <Text style={styles.activityValue}>{(400 - predictedRange) > 0 ? Math.round((400 - predictedRange) * 0.2) : 0} Wh/km</Text>
          </View>
          <View style={styles.activityDivider} />
          <View style={styles.activityItem}>
            <Navigation size={16} color={Colors.textTertiary} />
            <Text style={styles.activityLabel}>Est. Charge Time</Text>
            <Text style={styles.activityValue}>{Math.round((100 - battery.batteryPercent) * 0.6)} min</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.critical + '1A',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.critical + '44',
  },
  emergencyButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.critical,
  },
  gaugeSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  rangeInfo: {
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  rangeValue: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: '700',
  },
  rangeUnit: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
    marginTop: -4,
  },
  predictionCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: Spacing.lg,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  predictionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  predictionItem: {
    flex: 1,
  },
  predictionLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  predictionValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
  },
  predictionDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.cardBorder,
    marginHorizontal: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  controlsSection: {
    marginBottom: Spacing.lg,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  controlButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  controlButtonActive: {
    borderColor: Colors.primary + '66',
    backgroundColor: Colors.primary + '0D',
  },
  controlLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    fontWeight: '600',
    marginTop: 4,
  },
  nearestSection: {
    marginBottom: Spacing.lg,
  },
  viewAllText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  activitySection: {
    marginBottom: Spacing.lg,
  },
  activityCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  activityLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  activityValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  activityDivider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
  },
});
