import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MapPin, Navigation, Zap, Clock } from 'lucide-react-native';
import { Colors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import type { ChargingStation } from '@/types';

type Props = {
  stations: Omit<ChargingStation, 'id' | 'created_at'>[];
  userLatitude?: number;
  userLongitude?: number;
  onStationSelect?: (index: number) => void;
  selectedStationIndex?: number;
};

// Web-compatible map view using a styled list/grid layout
export function MapView({
  stations,
  onStationSelect,
  selectedStationIndex,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Map header with location info */}
      <View style={styles.mapHeader}>
        <View style={styles.locationPill}>
          <MapPin size={14} color={Colors.primary} />
          <Text style={styles.locationText}>San Francisco, CA</Text>
        </View>
        <Text style={styles.stationCount}>{stations.length} stations nearby</Text>
      </View>

      {/* Visual map representation */}
      <View style={styles.mapArea}>
        <View style={styles.mapGrid}>
          {/* User position indicator */}
          <View style={styles.userMarker}>
            <View style={styles.userMarkerInner} />
            <View style={styles.userMarkerPulse} />
          </View>

          {/* Station markers */}
          {stations.slice(0, 8).map((station, index) => {
            const isSelected = index === selectedStationIndex;
            // Position markers in a grid-like pattern based on distance
            const angle = (index * 137.5 * Math.PI) / 180; // golden angle
            const dist = Math.min(station.distance_km / 10, 0.85);
            const left = 50 + Math.cos(angle) * dist * 40;
            const top = 50 + Math.sin(angle) * dist * 40;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.stationMarker,
                  {
                    left: `${left}%`,
                    top: `${top}%`,
                  },
                  isSelected && styles.selectedMarker,
                  !station.is_available && styles.unavailableMarker,
                ]}
                onPress={() => onStationSelect?.(index)}
              >
                <Zap
                  size={14}
                  color={isSelected ? Colors.primary : station.is_available ? Colors.success : Colors.error}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.error }]} />
            <Text style={styles.legendText}>Occupied</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
        </View>
      </View>

      {/* Station list below map */}
      <ScrollView
        style={styles.stationList}
        contentContainerStyle={styles.stationListContent}
        showsVerticalScrollIndicator={false}
      >
        {stations.map((station, index) => {
          const isSelected = index === selectedStationIndex;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.stationItem, isSelected && styles.selectedStationItem]}
              onPress={() => onStationSelect?.(index)}
            >
              <View style={styles.stationItemLeft}>
                <View style={[
                  styles.stationItemDot,
                  { backgroundColor: station.is_available ? Colors.success : Colors.error },
                ]} />
                <View>
                  <Text style={styles.stationItemName} numberOfLines={1}>{station.name}</Text>
                  <Text style={styles.stationItemAddress} numberOfLines={1}>{station.address}</Text>
                </View>
              </View>
              <View style={styles.stationItemRight}>
                <View style={styles.stationItemStat}>
                  <Navigation size={12} color={Colors.primary} />
                  <Text style={styles.stationItemStatText}>{station.distance_km.toFixed(1)} km</Text>
                </View>
                <View style={styles.stationItemStat}>
                  <Clock size={12} color={Colors.secondary} />
                  <Text style={styles.stationItemStatText}>{station.eta_minutes} min</Text>
                </View>
                <View style={styles.stationItemStat}>
                  <Zap size={12} color={Colors.warning} />
                  <Text style={styles.stationItemStatText}>{station.power_kw} kW</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  locationText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  stationCount: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
  },
  mapArea: {
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  mapGrid: {
    height: 280,
    position: 'relative',
    backgroundColor: Colors.backgroundSecondary,
  },
  userMarker: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.secondary,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userMarkerPulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondary + '33',
  },
  stationMarker: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    transform: [{ translateX: -14 }, { translateY: -14 }],
  },
  selectedMarker: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.primary + '22',
  },
  unavailableMarker: {
    opacity: 0.6,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
  },
  stationList: {
    flex: 1,
    marginTop: Spacing.sm,
  },
  stationListContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  stationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  selectedStationItem: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '0D',
  },
  stationItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  stationItemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stationItemName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  stationItemAddress: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginTop: 1,
  },
  stationItemRight: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  stationItemStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  stationItemStatText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
