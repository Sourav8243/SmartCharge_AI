import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Zap, Clock, Star, Navigation, Plug } from 'lucide-react-native';
import { Colors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import type { ChargingStation } from '@/types';

type Props = {
  station: Omit<ChargingStation, 'id' | 'created_at'>;
  onSelect?: () => void;
  onNavigate?: () => void;
  isRecommended?: boolean;
};

export function StationCard({ station, onSelect, onNavigate, isRecommended }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, isRecommended && styles.recommendedCard]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      {isRecommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>RECOMMENDED</Text>
        </View>
      )}
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <View style={[styles.statusDot, station.is_available ? styles.available : styles.unavailable]} />
          <Text style={styles.name} numberOfLines={1}>{station.name}</Text>
        </View>
        <View style={styles.ratingRow}>
          <Star size={12} color={Colors.warning} fill={Colors.warning} />
          <Text style={styles.rating}>{station.rating.toFixed(1)}</Text>
        </View>
      </View>

      <View style={styles.addressRow}>
        <MapPin size={12} color={Colors.textTertiary} />
        <Text style={styles.address} numberOfLines={1}>{station.address}</Text>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <MapPin size={14} color={Colors.primary} />
          <Text style={styles.detailValue}>{station.distance_km.toFixed(1)} km</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={14} color={Colors.secondary} />
          <Text style={styles.detailValue}>{station.eta_minutes} min</Text>
        </View>
        <View style={styles.detailItem}>
          <Zap size={14} color={Colors.warning} />
          <Text style={styles.detailValue}>{station.power_kw} kW</Text>
        </View>
        <View style={styles.detailItem}>
          <Plug size={14} color={Colors.textTertiary} />
          <Text style={styles.detailValue}>
            {station.available_connectors}/{station.total_connectors}
          </Text>
        </View>
      </View>

      <View style={styles.typesRow}>
        {station.charging_types.map((type) => (
          <View key={type} style={styles.typeBadge}>
            <Text style={styles.typeText}>{type}</Text>
          </View>
        ))}
        <Text style={styles.price}>${station.price_per_kwh.toFixed(2)}/kWh</Text>
      </View>

      {onNavigate && station.is_available && (
        <TouchableOpacity style={styles.navButton} onPress={onNavigate}>
          <Navigation size={16} color={Colors.primary} />
          <Text style={styles.navButtonText}>Navigate</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: Spacing.sm,
  },
  recommendedCard: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  recommendedBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  recommendedText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.background,
    letterSpacing: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  available: {
    backgroundColor: Colors.success,
  },
  unavailable: {
    backgroundColor: Colors.error,
  },
  name: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.sm,
  },
  address: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    flex: 1,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  typesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  typeBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  typeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  price: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 'auto',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
  },
  navButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
});
