import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type TextInputProps,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '@/constants/theme';

// Themed Button
type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const bgColors = {
    primary: Colors.primary,
    secondary: Colors.secondary,
    outline: 'transparent',
    danger: Colors.error,
  };
  const textColors = {
    primary: Colors.background,
    secondary: '#fff',
    outline: Colors.primary,
    danger: '#fff',
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bgColors[variant], borderColor: Colors.primary },
        variant === 'outline' && styles.outlineButton,
        (disabled || loading) && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} size="small" />
      ) : (
        <View style={styles.buttonContent}>
          {icon}
          <Text style={[styles.buttonText, { color: textColors[variant] }, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// Themed Input
type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
};

export function Input({ label, error, icon, style, ...props }: InputProps) {
  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {icon && <View style={styles.inputIcon}>{icon}</View>}
        <TextInput
          style={[styles.input, icon ? { paddingLeft: 0 } : undefined, style]}
          placeholderTextColor={Colors.textMuted}
          {...props}
        />
      </View>
      {error && <Text style={styles.inputErrorText}>{error}</Text>}
    </View>
  );
}

// Section Header
type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
      {action}
    </View>
  );
}

// Badge
type BadgeProps = {
  label: string;
  color?: string;
  bgColor?: string;
};

export function Badge({ label, color = Colors.primary, bgColor }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: bgColor || color + '22' }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  outlineButton: {
    borderWidth: 1.5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  buttonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: Spacing.md,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 48,
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.md,
  },
  inputErrorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.error,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
  },
});
