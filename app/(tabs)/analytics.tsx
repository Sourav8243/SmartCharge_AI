import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  Battery,
  Gauge,
  Wind,
  Thermometer,
  TrendingUp,
  Zap,
  Activity,
  BarChart3,
  Clock,
} from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { BatteryGauge } from '@/components/BatteryGauge';
import { StatCard } from '@/components/StatCard';
import { RangeBar } from '@/components/RangeBar';
import { SectionHeader, Badge } from '@/components/ThemedComponents';
import { useBatterySimulation } from '@/hooks/useBatterySimulation';
import { predictRange, getPredictionConfidence, estimateArrivalTime } from '@/lib/range-prediction';
import { getNearestAvailableStation } from '@/lib/mock-stations';

export default function AnalyticsScreen() {
  const { state: battery, toggleAC, setTrafficLevel, setSpeed } = useBatterySimulation(400, 78);
  const [historyData, setHistoryData] = useState<number[]>([]);

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

  const nearestStation = getNearestAvailableStation();
  const etaToStation = nearestStation
    ? estimateArrivalTime(nearestStation.distance_km, battery.speedKmh, battery.trafficLevel)
    : null;

  // Track battery history
  useEffect(() => {
    setHistoryData((prev) => {
      const updated = [...prev, battery.batteryPercent];
      return updated.length > 20 ? updated.slice(-20) : updated;
    });
  }, [battery.batteryPercent]);

  const batteryColor =
    battery.batteryPercent > 60 ? Colors.batteryHigh
    : battery.batteryPercent > 30 ? Colors.batteryMedium
    : battery.batteryPercent > 15 ? Colors.batteryLow
    : Colors.batteryCritical;

  // Energy consumption estimate
  const energyConsumption = Math.round(15 + (battery.speedKmh / 100) * 8 + (battery.acActive ? 3 : 0) + (battery.trafficLevel === 'high' ? 4 : battery.trafficLevel === 'medium' ? 2 : 0));

  // Speed slider simulation
  const speedLevels = [0, 30, 50, 80, 100, 120];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Battery Analytics</Text>
        <Badge
          label={battery.isCharging ? 'CHARGING' : 'DRIVING'}
          color={battery.isCharging ? Colors.success : Colors.secondary}
        />
      </View>

      {/* Main Battery Display */}
      <View style={styles.mainGauge}>
        <BatteryGauge percent={battery.batteryPercent} size={180} />
        <View style={styles.gaugeDetails}>
          <View style={styles.gaugeDetailItem}>
            <Text style={styles.gaugeDetailLabel}>Current Range</Text>
            <Text style={[styles.gaugeDetailValue, { color: batteryColor }]}>{Math.round(battery.rangeKm)} km</Text>
          </View>
          <View style={styles.gaugeDetailDivider} />
          <View style={styles.gaugeDetailItem}>
            <Text style={styles.gaugeDetailLabel}>AI Predicted</Text>
            <Text style={[styles.gaugeDetailValue, { color: Colors.primary }]}>{predictedRange} km</Text>
          </View>
        </View>
      </View>

      {/* AI Prediction Details */}
      <View style={styles.predictionSection}>
        <SectionHeader title="AI Range Prediction" subtitle="Based on current driving conditions" />
        <View style={styles.predictionCard}>
          <View style={styles.predictionRow}>
            <View style={styles.predictionMetric}>
              <TrendingUp size={18} color={Colors.primary} />
              <Text style={styles.predictionMetricLabel}>Predicted Range</Text>
              <Text style={[styles.predictionMetricValue, { color: Colors.primary }]}>{predictedRange} km</Text>
            </View>
            <View style={styles.predictionMetric}>
              <Activity size={18} color={Colors.secondary} />
              <Text style={styles.predictionMetricLabel}>Confidence</Text>
              <Text style={[styles.predictionMetricValue, { color: confidence.level === 'high' ? Colors.success : confidence.level === 'medium' ? Colors.warning : Colors.error }]}>
                {confidence.percent}%
              </Text>
            </View>
            <View style={styles.predictionMetric}>
              <Zap size={18} color={Colors.warning} />
              <Text style={styles.predictionMetricLabel}>Consumption</Text>
              <Text style={styles.predictionMetricValue}>{energyConsumption} Wh/km</Text>
            </View>
          </View>

          {/* Range comparison bars */}
          <View style={styles.rangeBars}>
            <RangeBar
              label="Actual Range"
              value={battery.rangeKm}
              maxValue={400}
              unit="km"
              color={batteryColor}
            />
            <RangeBar
              label="AI Predicted Range"
              value={predictedRange}
              maxValue={400}
              unit="km"
              color={Colors.primary}
            />
          </View>
        </View>
      </View>

      {/* Driving Factors */}
      <View style={styles.factorsSection}>
        <SectionHeader title="Driving Factors" subtitle="Factors affecting your range" />
        <View style={styles.factorsGrid}>
          <View style={styles.factorCard}>
            <Gauge size={22} color={Colors.secondary} />
            <Text style={styles.factorLabel}>Speed</Text>
            <Text style={styles.factorValue}>{Math.round(battery.speedKmh)} km/h</Text>
            <RangeBar value={battery.speedKmh} maxValue={150} color={Colors.secondary} showValue={false} label="" />
          </View>
          <View style={styles.factorCard}>
            <Thermometer size={22} color={battery.acActive ? Colors.warning : Colors.textTertiary} />
            <Text style={styles.factorLabel}>AC</Text>
            <Text style={[styles.factorValue, { color: battery.acActive ? Colors.warning : Colors.textTertiary }]}>
              {battery.acActive ? 'ON' : 'OFF'}
            </Text>
            <TouchableOpacity style={styles.factorToggle} onPress={toggleAC}>
              <View style={[styles.toggleTrack, battery.acActive && styles.toggleTrackActive]}>
                <View style={[styles.toggleThumb, battery.acActive && styles.toggleThumbActive]} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.factorCard}>
            <Wind size={22} color={battery.trafficLevel === 'low' ? Colors.success : battery.trafficLevel === 'medium' ? Colors.warning : Colors.error} />
            <Text style={styles.factorLabel}>Traffic</Text>
            <Text style={[styles.factorValue, { color: battery.trafficLevel === 'low' ? Colors.success : battery.trafficLevel === 'medium' ? Colors.warning : Colors.error }]}>
              {battery.trafficLevel.charAt(0).toUpperCase() + battery.trafficLevel.slice(1)}
            </Text>
            <View style={styles.trafficButtons}>
              {(['low', 'medium', 'high'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[styles.trafficBtn, battery.trafficLevel === level && styles.trafficBtnActive]}
                  onPress={() => setTrafficLevel(level)}
                >
                  <Text style={[styles.trafficBtnText, battery.trafficLevel === level && styles.trafficBtnTextActive]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Speed Control */}
      <View style={styles.speedSection}>
        <SectionHeader title="Speed Simulation" subtitle="Adjust to see impact on range" />
        <View style={styles.speedControl}>
          {speedLevels.map((speed) => (
            <TouchableOpacity
              key={speed}
              style={[styles.speedButton, Math.round(battery.speedKmh) === speed && styles.speedButtonActive]}
              onPress={() => setSpeed(speed)}
            >
              <Text style={[styles.speedButtonText, Math.round(battery.speedKmh) === speed && styles.speedButtonTextActive]}>
                {speed}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Battery History Chart */}
      <View style={styles.historySection}>
        <SectionHeader title="Battery History" subtitle="Last 20 readings" />
        <View style={styles.chartCard}>
          <View style={styles.chart}>
            {historyData.map((val, i) => (
              <View key={i} style={styles.chartBarContainer}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      height: `${Math.max(val, 2)}%`,
                      backgroundColor: val > 60 ? Colors.batteryHigh : val > 30 ? Colors.batteryMedium : val > 15 ? Colors.batteryLow : Colors.batteryCritical,
                    },
                  ]}
                />
              </View>
            ))}
          </View>
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabel}>20 ticks ago</Text>
            <Text style={styles.chartLabel}>Now</Text>
          </View>
        </View>
      </View>

      {/* Station ETA */}
      {nearestStation && etaToStation && (
        <View style={styles.etaSection}>
          <SectionHeader title="Nearest Station ETA" />
          <View style={styles.etaCard}>
            <View style={styles.etaItem}>
              <Clock size={18} color={Colors.primary} />
              <Text style={styles.etaLabel}>Estimated Arrival</Text>
              <Text style={[styles.etaValue, { color: Colors.primary }]}>{etaToStation} min</Text>
            </View>
            <View style={styles.etaDivider} />
            <View style={styles.etaItem}>
              <Battery size={18} color={batteryColor} />
              <Text style={styles.etaLabel}>Battery on Arrival</Text>
              <Text style={[styles.etaValue, { color: batteryColor }]}>
                {Math.max(0, Math.round(battery.batteryPercent - (nearestStation.distance_km / 400) * 100))}%
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.xl, paddingBottom: Spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  title: { fontSize: Typography.fontSize.xxl, fontWeight: '700', color: Colors.textPrimary },
  mainGauge: { alignItems: 'center', marginBottom: Spacing.lg },
  gaugeDetails: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, marginTop: Spacing.sm },
  gaugeDetailItem: { alignItems: 'center' },
  gaugeDetailLabel: { fontSize: Typography.fontSize.xs, color: Colors.textTertiary, marginBottom: 2 },
  gaugeDetailValue: { fontSize: Typography.fontSize.xl, fontWeight: '700' },
  gaugeDetailDivider: { width: 1, height: 32, backgroundColor: Colors.cardBorder },
  predictionSection: { marginBottom: Spacing.lg },
  predictionCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder },
  predictionRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: Spacing.md },
  predictionMetric: { alignItems: 'center', gap: 4 },
  predictionMetricLabel: { fontSize: Typography.fontSize.xs, color: Colors.textTertiary },
  predictionMetricValue: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  rangeBars: { gap: Spacing.xs },
  factorsSection: { marginBottom: Spacing.lg },
  factorsGrid: { gap: Spacing.sm },
  factorCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  factorLabel: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, fontWeight: '500' },
  factorValue: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  factorToggle: { padding: Spacing.xs },
  toggleTrack: { width: 40, height: 22, borderRadius: 11, backgroundColor: Colors.surface, justifyContent: 'center', padding: 2 },
  toggleTrackActive: { backgroundColor: Colors.warning + '44' },
  toggleThumb: { width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.textTertiary },
  toggleThumbActive: { backgroundColor: Colors.warning, alignSelf: 'flex-end' },
  trafficButtons: { flexDirection: 'row', gap: 4 },
  trafficBtn: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: BorderRadius.sm, backgroundColor: Colors.surface },
  trafficBtnActive: { backgroundColor: Colors.primary + '22' },
  trafficBtnText: { fontSize: Typography.fontSize.xs, color: Colors.textTertiary },
  trafficBtnTextActive: { color: Colors.primary, fontWeight: '600' },
  speedSection: { marginBottom: Spacing.lg },
  speedControl: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
  speedButton: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.cardBorder },
  speedButtonActive: { borderColor: Colors.secondary, backgroundColor: Colors.secondary + '1A' },
  speedButtonText: { fontSize: Typography.fontSize.sm, color: Colors.textTertiary, fontWeight: '500' },
  speedButtonTextActive: { color: Colors.secondary, fontWeight: '700' },
  historySection: { marginBottom: Spacing.lg },
  chartCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 3 },
  chartBarContainer: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  chartBar: { width: '100%', minHeight: 2, borderRadius: 2 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
  chartLabel: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
  etaSection: { marginBottom: Spacing.lg },
  etaCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder },
  etaItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  etaLabel: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, flex: 1 },
  etaValue: { fontSize: Typography.fontSize.md, fontWeight: '700' },
  etaDivider: { height: 1, backgroundColor: Colors.cardBorder },
});
