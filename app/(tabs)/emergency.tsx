import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  Zap,
  MapPin,
  Navigation,
  Phone,
  Battery,
  Clock,
  Shield,
  ArrowLeft,
  Radio,
} from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { Button, Badge } from '@/components/ThemedComponents';
import { useBatterySimulation } from '@/hooks/useBatterySimulation';
import { getFastestReachableStation, getNearestAvailableStation } from '@/lib/mock-stations';
import { isStationReachable, estimateArrivalTime } from '@/lib/range-prediction';

export default function EmergencyScreen() {
  const router = useRouter();
  const { state: battery } = useBatterySimulation(400, 78);
  const [countdown, setCountdown] = useState(0);

  const fastestStation = getFastestReachableStation(battery.rangeKm);
  const nearestStation = getNearestAvailableStation();
  const isCritical = battery.rangeKm < 15;
  const isLow = battery.rangeKm < 50;

  const eta = fastestStation
    ? estimateArrivalTime(fastestStation.distance_km, battery.speedKmh, battery.trafficLevel)
    : null;

  const batteryColor =
    battery.batteryPercent > 30 ? Colors.batteryMedium
    : battery.batteryPercent > 15 ? Colors.batteryLow
    : Colors.batteryCritical;

  // Pulsing animation for critical state
  const [pulseVisible, setPulseVisible] = useState(true);
  useEffect(() => {
    if (!isCritical) return;
    const interval = setInterval(() => setPulseVisible((v) => !v), 800);
    return () => clearInterval(interval);
  }, [isCritical]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Emergency Mode</Text>
        <Badge label={isCritical ? 'CRITICAL' : 'LOW'} color={isCritical ? Colors.critical : Colors.warning} />
      </View>

      {/* Critical Warning */}
      <View style={[styles.warningCard, isCritical && styles.criticalWarning, { opacity: isCritical && !pulseVisible ? 0.7 : 1 }]}>
        <View style={[styles.warningIcon, { backgroundColor: (isCritical ? Colors.critical : Colors.warning) + '1A' }]}>
          <AlertTriangle size={28} color={isCritical ? Colors.critical : Colors.warning} />
        </View>
        <Text style={[styles.warningTitle, { color: isCritical ? Colors.critical : Colors.warning }]}>
          {isCritical ? 'CRITICAL BATTERY LEVEL' : 'LOW BATTERY WARNING'}
        </Text>
        <Text style={styles.warningMessage}>
          {isCritical
            ? `Only ${Math.round(battery.rangeKm)} km of range remaining. Find a charging station immediately!`
            : `${Math.round(battery.rangeKm)} km of range remaining. Consider charging soon.`}
        </Text>
      </View>

      {/* Battery Status */}
      <View style={styles.batteryCard}>
        <View style={styles.batteryRow}>
          <Battery size={20} color={batteryColor} />
          <Text style={styles.batteryLabel}>Battery Level</Text>
          <Text style={[styles.batteryValue, { color: batteryColor }]}>{Math.round(battery.batteryPercent)}%</Text>
        </View>
        <View style={styles.batteryBar}>
          <View style={[styles.batteryFill, { width: `${battery.batteryPercent}%`, backgroundColor: batteryColor }]} />
        </View>
        <View style={styles.batteryRow}>
          <MapPin size={16} color={Colors.textTertiary} />
          <Text style={styles.batterySubLabel}>Remaining Range</Text>
          <Text style={styles.batterySubValue}>{Math.round(battery.rangeKm)} km</Text>
        </View>
      </View>

      {/* Fastest Reachable Station */}
      {fastestStation ? (
        <View style={styles.stationCard}>
          <View style={styles.stationHeader}>
            <View style={styles.stationIcon}>
              <Zap size={20} color={Colors.primary} />
            </View>
            <View style={styles.stationInfo}>
              <Text style={styles.stationName}>{fastestStation.name}</Text>
              <Text style={styles.stationAddress}>{fastestStation.address}</Text>
            </View>
            <Badge label="Fastest" color={Colors.primary} />
          </View>

          <View style={styles.stationDetails}>
            <View style={styles.stationDetail}>
              <MapPin size={16} color={Colors.primary} />
              <Text style={styles.stationDetailLabel}>Distance</Text>
              <Text style={styles.stationDetailValue}>{fastestStation.distance_km.toFixed(1)} km</Text>
            </View>
            <View style={styles.stationDetail}>
              <Clock size={16} color={Colors.secondary} />
              <Text style={styles.stationDetailLabel}>ETA</Text>
              <Text style={styles.stationDetailValue}>{eta} min</Text>
            </View>
            <View style={styles.stationDetail}>
              <Zap size={16} color={Colors.warning} />
              <Text style={styles.stationDetailLabel}>Power</Text>
              <Text style={styles.stationDetailValue}>{fastestStation.power_kw} kW</Text>
            </View>
            <View style={styles.stationDetail}>
              <Shield size={16} color={Colors.success} />
              <Text style={styles.stationDetailLabel}>Available</Text>
              <Text style={styles.stationDetailValue}>{fastestStation.available_connectors}/{fastestStation.total_connectors}</Text>
            </View>
          </View>

          <View style={styles.stationActions}>
            <Button
              title="Navigate Now"
              onPress={() => router.push('/(tabs)/navigation')}
              icon={<Navigation size={18} color={Colors.background} />}
            />
            <Button
              title="Call Station"
              variant="outline"
              onPress={() => {}}
              icon={<Phone size={18} color={Colors.primary} />}
              style={{ marginTop: Spacing.sm }}
            />
          </View>
        </View>
      ) : (
        <View style={styles.noStationCard}>
          <AlertTriangle size={32} color={Colors.error} />
          <Text style={styles.noStationTitle}>No Reachable Stations</Text>
          <Text style={styles.noStationDesc}>
            Your current range is too low to reach any nearby charging station. Please call for roadside assistance.
          </Text>
          <Button title="Call Roadside Assistance" variant="danger" onPress={() => {}} icon={<Phone size={18} color="#fff" />} style={{ marginTop: Spacing.md }} />
        </View>
      )}

      {/* Emergency Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>Emergency Tips</Text>
        {[
          { icon: Battery, text: 'Turn off AC and reduce speed to extend range' },
          { icon: Radio, text: 'Call ahead to confirm station availability' },
          { icon: Shield, text: 'Pull over safely if battery becomes critically low' },
          { icon: Phone, text: 'Keep roadside assistance number handy' },
        ].map((tip, index) => {
          const Icon = tip.icon;
          return (
            <View key={index} style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Icon size={14} color={Colors.textTertiary} />
              </View>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.xl, paddingBottom: Spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  title: { fontSize: Typography.fontSize.xxl, fontWeight: '700', color: Colors.textPrimary },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  warningCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1.5, borderColor: Colors.warning + '44', alignItems: 'center', marginBottom: Spacing.md },
  criticalWarning: { borderColor: Colors.critical + '66', backgroundColor: Colors.critical + '0D' },
  warningIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  warningTitle: { fontSize: Typography.fontSize.lg, fontWeight: '700', marginBottom: Spacing.sm, textAlign: 'center' },
  warningMessage: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  batteryCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder, marginBottom: Spacing.md },
  batteryRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  batteryLabel: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, flex: 1 },
  batteryValue: { fontSize: Typography.fontSize.lg, fontWeight: '700' },
  batteryBar: { height: 8, backgroundColor: Colors.surface, borderRadius: 4, overflow: 'hidden', marginBottom: Spacing.sm },
  batteryFill: { height: '100%', borderRadius: 4 },
  batterySubLabel: { fontSize: Typography.fontSize.xs, color: Colors.textTertiary, flex: 1 },
  batterySubValue: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.textPrimary },
  stationCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1.5, borderColor: Colors.primary + '44', marginBottom: Spacing.md },
  stationHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  stationIcon: { width: 40, height: 40, borderRadius: BorderRadius.md, backgroundColor: Colors.primary + '1A', alignItems: 'center', justifyContent: 'center' },
  stationInfo: { flex: 1 },
  stationName: { fontSize: Typography.fontSize.md, fontWeight: '600', color: Colors.textPrimary },
  stationAddress: { fontSize: Typography.fontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  stationDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  stationDetail: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1, minWidth: '45%' },
  stationDetailLabel: { fontSize: Typography.fontSize.xs, color: Colors.textTertiary, flex: 1 },
  stationDetailValue: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.textPrimary },
  stationActions: {},
  noStationCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1.5, borderColor: Colors.error + '44', alignItems: 'center', marginBottom: Spacing.md },
  noStationTitle: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.error, marginTop: Spacing.md },
  noStationDesc: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm, lineHeight: 20 },
  tipsSection: { backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder },
  tipsTitle: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  tipItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  tipIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  tipText: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, flex: 1 },
});
