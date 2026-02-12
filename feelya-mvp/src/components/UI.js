// Reusable design-system primitives
import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, radius, font } from '../theme';

/* ───── Button ───── */
export function Button({
  title,
  onPress,
  variant = 'primary', // primary | outline | ghost | danger
  size = 'lg',         // sm | md | lg
  disabled = false,
  loading = false,
  style,
}) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const sizeH = size === 'sm' ? 40 : size === 'md' ? 48 : 56;
  const fontSize = size === 'sm' ? font.sm : size === 'md' ? font.md : font.lg;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.btn,
        { height: sizeH, borderRadius: radius.md },
        isPrimary && { backgroundColor: colors.primary },
        isOutline && {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary,
        },
        isDanger && { backgroundColor: colors.danger },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        (disabled || loading) && { opacity: 0.45 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text
          style={[
            styles.btnText,
            { fontSize },
            isPrimary && { color: colors.white },
            isOutline && { color: colors.primary },
            isDanger && { color: colors.white },
            variant === 'ghost' && { color: colors.textSecondary },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

/* ───── Pill / Chip ───── */
export function Pill({ label, selected, onPress, color }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.pill,
        selected && {
          backgroundColor: color || colors.primary,
          borderColor: color || colors.primary,
        },
      ]}
    >
      <Text
        style={[
          styles.pillText,
          selected && { color: colors.white },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ───── Card ───── */
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/* ───── Section Title ───── */
export function SectionTitle({ children, style }) {
  return <Text style={[styles.sectionTitle, style]}>{children}</Text>;
}

/* ───── Badge ───── */
export function Badge({ label, color = colors.primary }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

/* ───── Avatar (text-based) ───── */
export function Avatar({ name, size = 48 }) {
  const initials = (name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>
        {initials}
      </Text>
    </View>
  );
}

/* ───── StarRating ───── */
export function StarRating({ rating, setRating, size = 32 }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity
          key={n}
          onPress={() => setRating && setRating(n)}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontSize: size,
              color: n <= rating ? colors.warning : colors.textMuted,
              marginHorizontal: 4,
            }}
          >
            {n <= rating ? '\u2605' : '\u2606'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

/* ───── Divider ───── */
export function Divider() {
  return <View style={styles.divider} />;
}

/* ───── SafetyBanner ───── */
export function SafetyBanner({ compact }) {
  return (
    <View style={[styles.safetyBanner, compact && { paddingVertical: spacing.sm }]}>
      <Text style={styles.safetyTitle}>
        {compact ? 'Not therapy or medical advice' : 'This is NOT therapy or medical advice'}
      </Text>
      {!compact && (
        <Text style={styles.safetyBody}>
          Feelya connects you with peer guides for coaching and support.
          {'\n'}If you are in crisis, call or text{' '}
          <Text style={{ color: colors.accent, fontWeight: '700' }}>988</Text>{' '}
          (Suicide & Crisis Lifeline).
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  btnText: {
    fontWeight: '700',
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  pillText: {
    color: colors.textSecondary,
    fontSize: font.sm,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: font.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  badgeText: {
    fontSize: font.xs,
    fontWeight: '700',
  },
  avatar: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '700',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  safetyBanner: {
    backgroundColor: colors.accent + '15',
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    padding: spacing.md,
    borderRadius: radius.sm,
  },
  safetyTitle: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: font.sm,
    marginBottom: 4,
  },
  safetyBody: {
    color: colors.textSecondary,
    fontSize: font.sm,
    lineHeight: 20,
  },
});
