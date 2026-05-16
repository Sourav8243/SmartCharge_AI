import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import {
  Settings,
  Bell,
  Shield,
  Car,
  MapPin,
  Zap,
  ChevronRight,
  LogOut,
  Moon,
  Volume2,
  Navigation,
  HelpCircle,
  Info,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { SectionHeader, Badge } from '@/components/ThemedComponents';
import { useAuth } from '@/hooks/useAuth';

type SettingItem = {
  icon: React.ElementType;
  label: string;
  value?: string;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
  destructive?: boolean;
};

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [navigationEnabled, setNavigationEnabled] = useState(true);
  const [thresholdKm, setThresholdKm] = useState(50);
  const [emergencyThreshold, setEmergencyThreshold] = useState(15);

  const thresholdOptions = [30, 50, 75, 100];
  const emergencyOptions = [10, 15, 20, 25];

  const accountSettings: SettingItem[] = [
    { icon: Car, label: 'Vehicle Profile', value: 'Tesla Model 3', onPress: () => {} },
    { icon: MapPin, label: 'Home Location', value: 'San Francisco, CA', onPress: () => {} },
    { icon: Zap, label: 'Preferred Charger', value: 'CCS Combo', onPress: () => {} },
  ];

  const alertSettings: SettingItem[] = [
    { icon: Bell, label: 'Push Notifications', toggle: true, toggleValue: notificationsEnabled, onToggle: () => setNotificationsEnabled(!notificationsEnabled) },
    { icon: Volume2, label: 'Sound Alerts', toggle: true, toggleValue: soundEnabled, onToggle: () => setSoundEnabled(!soundEnabled) },
    { icon: Navigation, label: 'Auto-Navigation', toggle: true, toggleValue: navigationEnabled, onToggle: () => setNavigationEnabled(!navigationEnabled) },
  ];

  const appSettings: SettingItem[] = [
    { icon: Moon, label: 'Dark Mode', toggle: true, toggleValue: darkMode, onToggle: () => setDarkMode(!darkMode) },
    { icon: Shield, label: 'Privacy', onPress: () => {} },
    { icon: HelpCircle, label: 'Help & Support', onPress: () => {} },
    { icon: Info, label: 'About', value: 'v1.0.0', onPress: () => {} },
  ];

  const renderSettingItem = (item: SettingItem, index: number) => {
    const Icon = item.icon;
    return (
      <TouchableOpacity
        key={index}
        style={[styles.settingItem, item.destructive && styles.destructiveItem]}
        onPress={item.onPress}
        activeOpacity={0.7}
        disabled={item.toggle}
      >
        <View style={[styles.settingIcon, item.destructive && { backgroundColor: Colors.error + '1A' }]}>
          <Icon size={18} color={item.destructive ? Colors.error : Colors.textTertiary} />
        </View>
        <Text style={[styles.settingLabel, item.destructive && { color: Colors.error }]}>{item.label}</Text>
        {item.toggle ? (
          <Switch
            value={item.toggleValue}
            onValueChange={item.onToggle}
            trackColor={{ false: Colors.surface, true: Colors.primary + '66' }}
            thumbColor={item.toggleValue ? Colors.primary : Colors.textMuted}
          />
        ) : (
          <View style={styles.settingRight}>
            {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
            <ChevronRight size={16} color={Colors.textMuted} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitials}>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.user_metadata?.full_name || 'EV Driver'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
        </View>
        <Badge label="Pro" color={Colors.primary} />
      </View>

      {/* Threshold Settings */}
      <View style={styles.section}>
        <SectionHeader title="Alert Thresholds" subtitle="Customize when alerts trigger" />
        <View style={styles.thresholdCard}>
          <View style={styles.thresholdItem}>
            <View style={styles.thresholdHeader}>
              <Bell size={16} color={Colors.warning} />
              <Text style={styles.thresholdLabel}>Low Battery Alert</Text>
            </View>
            <Text style={styles.thresholdDesc}>Alert when range falls below</Text>
            <View style={styles.thresholdOptions}>
              {thresholdOptions.map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[styles.thresholdOption, thresholdKm === val && styles.thresholdOptionActive]}
                  onPress={() => setThresholdKm(val)}
                >
                  <Text style={[styles.thresholdOptionText, thresholdKm === val && styles.thresholdOptionTextActive]}>
                    {val} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.thresholdDivider} />
          <View style={styles.thresholdItem}>
            <View style={styles.thresholdHeader}>
              <Shield size={16} color={Colors.critical} />
              <Text style={styles.thresholdLabel}>Emergency Threshold</Text>
            </View>
            <Text style={styles.thresholdDesc}>Critical alert when range falls below</Text>
            <View style={styles.thresholdOptions}>
              {emergencyOptions.map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[styles.thresholdOption, emergencyThreshold === val && styles.thresholdOptionActive]}
                  onPress={() => setEmergencyThreshold(val)}
                >
                  <Text style={[styles.thresholdOptionText, emergencyThreshold === val && styles.thresholdOptionTextActive]}>
                    {val} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <SectionHeader title="Account" />
        <View style={styles.settingsCard}>
          {accountSettings.map(renderSettingItem)}
        </View>
      </View>

      {/* Alert Settings */}
      <View style={styles.section}>
        <SectionHeader title="Alerts & Notifications" />
        <View style={styles.settingsCard}>
          {alertSettings.map(renderSettingItem)}
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <SectionHeader title="App" />
        <View style={styles.settingsCard}>
          {appSettings.map(renderSettingItem)}
        </View>
      </View>

      {/* Sign Out */}
      <View style={styles.section}>
        <View style={styles.settingsCard}>
          <TouchableOpacity
            style={[styles.settingItem, styles.destructiveItem]}
            onPress={signOut}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIcon, { backgroundColor: Colors.error + '1A' }]}>
              <LogOut size={18} color={Colors.error} />
            </View>
            <Text style={[styles.settingLabel, { color: Colors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.xl, paddingBottom: Spacing.xxl },
  header: { marginBottom: Spacing.lg },
  title: { fontSize: Typography.fontSize.xxl, fontWeight: '700', color: Colors.textPrimary },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder, marginBottom: Spacing.lg },
  profileAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary + '22', alignItems: 'center', justifyContent: 'center' },
  profileInitials: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.primary },
  profileInfo: { flex: 1 },
  profileName: { fontSize: Typography.fontSize.md, fontWeight: '600', color: Colors.textPrimary },
  profileEmail: { fontSize: Typography.fontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  section: { marginBottom: Spacing.lg },
  thresholdCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder },
  thresholdItem: { paddingVertical: Spacing.sm },
  thresholdHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 4 },
  thresholdLabel: { fontSize: Typography.fontSize.md, fontWeight: '600', color: Colors.textPrimary },
  thresholdDesc: { fontSize: Typography.fontSize.xs, color: Colors.textTertiary, marginBottom: Spacing.sm },
  thresholdOptions: { flexDirection: 'row', gap: Spacing.sm },
  thresholdOption: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.cardBorder },
  thresholdOptionActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '1A' },
  thresholdOptionText: { fontSize: Typography.fontSize.sm, color: Colors.textTertiary, fontWeight: '500' },
  thresholdOptionTextActive: { color: Colors.primary, fontWeight: '700' },
  thresholdDivider: { height: 1, backgroundColor: Colors.cardBorder, marginVertical: Spacing.sm },
  settingsCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.cardBorder, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  destructiveItem: {},
  settingIcon: { width: 32, height: 32, borderRadius: BorderRadius.sm, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: Typography.fontSize.md, color: Colors.textPrimary, flex: 1 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  settingValue: { fontSize: Typography.fontSize.sm, color: Colors.textTertiary },
});
