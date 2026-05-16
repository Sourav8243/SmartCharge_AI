import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  Navigation,
  MapPin,
  Clock,
  Zap,
  Battery,
  Route,
  ChevronRight,
  ArrowLeft,
  Phone,
  Share,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { Button, Badge } from '@/components/ThemedComponents';
import { RangeBar } from '@/components/RangeBar';
import { useBatterySimulation } from '@/hooks/useBatterySimulation';
import { getNearestAvailableStation, getFastestReachableStation } from '@/lib/mock-stations';
import { estimateArrivalTime, isStationReachable } from '@/lib/range-prediction';

export default function NavigationScreen() {
  const router = useRouter();
  const { state: battery } = useBatterySimulation(400, 78);
  const [navigating, setNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  const targetStation = getNearestAvailableStation();
  const reachable = targetStation ? isStationReachable(targetStation.distance_km, battery.rangeKm) : false;
  const eta = targetStation ? estimateArrivalTime(targetStation.distance_km, battery.speedKmh, battery.trafficLevel) : 0;

  // Simulate navigation progress
  useEffect(() => {
    if (!navigating) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setNavigating(false);
          return 100;
        }
        return prev + 2;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [navigating]);

  const batteryOnArrival = targetStation
    ? Math.max(0, Math.round(battery.batteryPercent - (targetStation.distance_km / 400) * 100))
    : 0;

  const batteryColor =
    battery.batteryPercent > 60 ? Colors.batteryHigh
    : battery.batteryPercent > 30 ? Colors.batteryMedium
    : battery.batteryPercent > 15 ? Colors.batteryLow
    : Colors.batteryCritical;

  if (!targetStation) {
    return (
      <View style={styles.emptyContainer}>
        <MapPin size={48} color={Colors.textMuted} />
        <Text style={styles.emptyTitle}>No stations available</Text>
        <Text style={styles.emptySubtitle}>No charging stations found nearby</Text>
        <Button title="Go Back" onPress={() => router.back()} variant="outline" style={{ marginTop: Spacing.lg }} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Navigation</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Share size={20} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* Destination Card */}
      <View style={styles.destinationCard}>
        <View style={styles.destinationHeader}>
          <View style={styles.destinationIcon}>
            <Zap size={20} color={Colors.primary} />
          </View>
          <View style={styles.destinationInfo}>
            <Text style={styles.destinationName}>{targetStation.name}</Text>
            <Text style={styles.destinationAddress}>{targetStation.address}</Text>
          </View>
          <Badge label="Recommended" color={Colors.primary} />
        </View>

        <View style={styles.destinationDetails}>
          <View style={styles.detailItem}>
            <MapPin size={16} color={Colors.primary} />
            <Text style={styles.detailLabel}>Distance</Text>
            <Text style={styles.detailValue}>{targetStation.distance_km.toFixed(1)} km</Text>
          </View>
          <View style={styles.detailItem}>
            <Clock size={16} color={Colors.secondary} />
            <Text style={styles.detailLabel}>ETA</Text>
            <Text style={styles.detailValue}>{eta} min</Text>
          </View>
          <View style={styles.detailItem}>
            <Zap size={16} color={Colors.warning} />
            <Text style={styles.detailLabel}>Power</Text>
            <Text style={styles.detailValue}>{targetStation.power_kw} kW</Text>
          </View>
          <View style={styles.detailItem}>
            <Battery size={16} color={batteryColor} />
            <Text style={styles.detailLabel}>On Arrival</Text>
            <Text style={[styles.detailValue, { color: batteryColor }]}>{batteryOnArrival}%</Text>
          </View>
        </View>
      </View>

      {/* Reachability Status */}
      <View style={[styles.reachabilityCard, { borderColor: reachable ? Colors.success : Colors.error }]}>
        <View style={[styles.reachabilityIcon, { backgroundColor: reachable ? Colors.success + '1A' : Colors.error + '1A' }]}>
          <Route size={20} color={reachable ? Colors.success : Colors.error} />
        </View>
        <View style={styles.reachabilityInfo}>
          <Text style={[styles.reachabilityTitle, { color: reachable ? Colors.success : Colors.error }]}>
            {reachable ? 'Station is Reachable' : 'Station May Not Be Reachable'}
          </Text>
          <Text style={styles.reachabilityDesc}>
            {reachable
              ? `You have enough charge to reach this station with margin to spare.`
              : `Your current range may not be sufficient. Consider a closer station.`}
          </Text>
        </View>
      </View>

      {/* Navigation Progress */}
      {navigating && (
        <View style={styles.progressSection}>
          <SectionHeader title="Navigation Progress" />
          <View style={styles.progressCard}>
            <RangeBar
              label="Distance Covered"
              value={progress}
              maxValue={100}
              unit="%"
              color={Colors.primary}
            />
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatLabel}>Remaining</Text>
                <Text style={styles.progressStatValue}>
                  {((1 - progress / 100) * targetStation.distance_km).toFixed(1)} km
                </Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatLabel}>ETA</Text>
                <Text style={styles.progressStatValue}>
                  {Math.round((1 - progress / 100) * eta)} min
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Route Steps */}
      <View style={styles.routeSection}>
        <SectionHeader title="Route Details" />
        <View style={styles.routeCard}>
          {[
            { icon: MapPin, label: 'Current Location', detail: 'San Francisco, CA', color: Colors.secondary },
            { icon: Route, label: 'Head North on Bay St', detail: `${(targetStation.distance_km * 0.3).toFixed(1)} km`, color: Colors.textTertiary },
            { icon: Route, label: 'Turn right onto Battery St', detail: `${(targetStation.distance_km * 0.4).toFixed(1)} km`, color: Colors.textTertiary },
            { icon: Route, label: 'Continue to destination', detail: `${(targetStation.distance_km * 0.3).toFixed(1)} km`, color: Colors.textTertiary },
            { icon: Zap, label: targetStation.name, detail: targetStation.address, color: Colors.primary },
          ].map((step, index) => {
            const Icon = step.icon;
            return (
              <View key={index} style={styles.routeStep}>
                <View style={styles.routeStepLeft}>
                  <View style={[styles.routeStepIcon, { backgroundColor: step.color + '1A' }]}>
                    <Icon size={14} color={step.color} />
                  </View>
                  {index < 4 && <View style={styles.routeStepLine} />}
                </View>
                <View style={styles.routeStepContent}>
                  <Text style={styles.routeStepLabel}>{step.label}</Text>
                  <Text style={styles.routeStepDetail}>{step.detail}</Text>
                </View>
                <ChevronRight size={16} color={Colors.textMuted} />
              </View>
            );
          })}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {!navigating ? (
          <Button
            title="Start Navigation"
            onPress={() => setNavigating(true)}
            icon={<Navigation size={18} color={Colors.background} />}
          />
        ) : (
          <Button
            title="Stop Navigation"
            onPress={() => { setNavigating(false); setProgress(0); }}
            variant="danger"
          />
        )}
        <Button title="Call Station" variant="outline" onPress={() => {}} icon={<Phone size={18} color={Colors.primary} />} style={{ marginTop: Spacing.sm }} />
      </View>
    </ScrollView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={{ marginBottom: Spacing.sm }}>
      <Text style={{ fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.textPrimary }}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.xl, paddingBottom: Spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  title: { fontSize: Typography.fontSize.xxl, fontWeight: '700', color: Colors.textPrimary },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  shareButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background, padding: Spacing.xl },
  emptyTitle: { fontSize: Typography.fontSize.lg, fontWeight: '600', color: Colors.textSecondary, marginTop: Spacing.md },
  emptySubtitle: { fontSize: Typography.fontSize.sm, color: Colors.textMuted, marginTop: 4 },
  destinationCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder, marginBottom: Spacing.md },
  destinationHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  destinationIcon: { width: 40, height: 40, borderRadius: BorderRadius.md, backgroundColor: Colors.primary + '1A', alignItems: 'center', justifyContent: 'center' },
  destinationInfo: { flex: 1 },
  destinationName: { fontSize: Typography.fontSize.md, fontWeight: '600', color: Colors.textPrimary },
  destinationAddress: { fontSize: Typography.fontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  destinationDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1, minWidth: '45%' },
  detailLabel: { fontSize: Typography.fontSize.xs, color: Colors.textTertiary, flex: 1 },
  detailValue: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.textPrimary },
  reachabilityCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, marginBottom: Spacing.md },
  reachabilityIcon: { width: 44, height: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  reachabilityInfo: { flex: 1 },
  reachabilityTitle: { fontSize: Typography.fontSize.md, fontWeight: '700', marginBottom: 2 },
  reachabilityDesc: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
  progressSection: { marginBottom: Spacing.md },
  progressCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder },
  progressStats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: Spacing.sm },
  progressStat: { alignItems: 'center' },
  progressStatLabel: { fontSize: Typography.fontSize.xs, color: Colors.textTertiary },
  progressStatValue: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.textPrimary, marginTop: 2 },
  routeSection: { marginBottom: Spacing.md },
  routeCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder },
  routeStep: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  routeStepLeft: { width: 32, alignItems: 'center' },
  routeStepIcon: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  routeStepLine: { width: 2, height: 20, backgroundColor: Colors.cardBorder, marginTop: 2 },
  routeStepContent: { flex: 1, paddingVertical: Spacing.sm },
  routeStepLabel: { fontSize: Typography.fontSize.sm, fontWeight: '500', color: Colors.textPrimary },
  routeStepDetail: { fontSize: Typography.fontSize.xs, color: Colors.textTertiary, marginTop: 1 },
  actions: { marginTop: Spacing.sm },
});
