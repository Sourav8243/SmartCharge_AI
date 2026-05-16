import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Filter, Zap, List, Map, SlidersHorizontal } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { SectionHeader, Badge, Button } from '@/components/ThemedComponents';
import { StationCard } from '@/components/StationCard';
import { MapView } from '@/components/MapView';
import { getNearbyStations } from '@/lib/mock-stations';
import { useBatterySimulation } from '@/hooks/useBatterySimulation';
import { isStationReachable } from '@/lib/range-prediction';

type FilterType = 'all' | 'available' | 'fast' | 'nearest';
type ViewMode = 'list' | 'map';

export default function StationsScreen() {
  const router = useRouter();
  const { state: battery } = useBatterySimulation(400, 78);
  const [filter, setFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedStationIndex, setSelectedStationIndex] = useState<number | undefined>(undefined);

  const allStations = useMemo(() => getNearbyStations(10), []);

  const filteredStations = useMemo(() => {
    switch (filter) {
      case 'available':
        return allStations.filter((s) => s.is_available);
      case 'fast':
        return allStations.filter((s) => s.power_kw >= 150);
      case 'nearest':
        return allStations.slice(0, 3);
      default:
        return allStations;
    }
  }, [allStations, filter]);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'available', label: 'Available' },
    { key: 'fast', label: 'Fast Charge' },
    { key: 'nearest', label: 'Nearest' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Charging Stations</Text>
          <Text style={styles.subtitle}>{filteredStations.length} stations within 10 km</Text>
        </View>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <List size={16} color={viewMode === 'list' ? Colors.primary : Colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'map' && styles.toggleBtnActive]}
            onPress={() => setViewMode('map')}
          >
            <Map size={16} color={viewMode === 'map' ? Colors.primary : Colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Range indicator */}
      <View style={styles.rangeIndicator}>
        <MapPin size={14} color={Colors.primary} />
        <Text style={styles.rangeText}>
          Your range: <Text style={styles.rangeValue}>{Math.round(battery.rangeKm)} km</Text>
        </Text>
        <Badge
          label={`${allStations.filter((s) => isStationReachable(s.distance_km, battery.rangeKm)).length} reachable`}
          color={Colors.success}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow} contentContainerStyle={styles.filtersContent}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            {f.key === 'fast' && <Zap size={12} color={filter === f.key ? Colors.primary : Colors.textTertiary} />}
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      {viewMode === 'map' ? (
        <MapView
          stations={filteredStations}
          onStationSelect={(index) => setSelectedStationIndex(index)}
          selectedStationIndex={selectedStationIndex}
        />
      ) : (
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredStations.map((station, index) => (
            <StationCard
              key={index}
              station={station}
              isRecommended={index === 0 && station.is_available}
              onSelect={() => setSelectedStationIndex(index)}
              onNavigate={() => router.push('/(tabs)/navigation')}
            />
          ))}

          {filteredStations.length === 0 && (
            <View style={styles.emptyState}>
              <Zap size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No stations found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingTop: Spacing.xl, marginBottom: Spacing.sm },
  title: { fontSize: Typography.fontSize.xxl, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: Typography.fontSize.sm, color: Colors.textTertiary, marginTop: 2 },
  viewToggle: { flexDirection: 'row', gap: 4, backgroundColor: Colors.surface, borderRadius: BorderRadius.sm, padding: 2 },
  toggleBtn: { width: 36, height: 36, borderRadius: BorderRadius.sm, alignItems: 'center', justifyContent: 'center' },
  toggleBtnActive: { backgroundColor: Colors.primary + '22' },
  rangeIndicator: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, marginBottom: Spacing.sm },
  rangeText: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  rangeValue: { fontWeight: '700', color: Colors.primary },
  filtersRow: { maxHeight: 44, marginBottom: Spacing.sm },
  filtersContent: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.cardBorder },
  filterChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '1A' },
  filterText: { fontSize: Typography.fontSize.sm, color: Colors.textTertiary, fontWeight: '500' },
  filterTextActive: { color: Colors.primary, fontWeight: '600' },
  listContainer: { flex: 1 },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xxl },
  emptyTitle: { fontSize: Typography.fontSize.lg, fontWeight: '600', color: Colors.textSecondary, marginTop: Spacing.md },
  emptySubtitle: { fontSize: Typography.fontSize.sm, color: Colors.textMuted, marginTop: 4 },
});
