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
  variant = 'primary', // primary | outline | ghost | danger | soft
  size = 'lg',
  disabled = false,
  loading = false,
  style,
}) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isSoft = variant === 'soft';
  const sizeH = size === 'sm' ? 40 : size === 'md' ? 48 : 56;
  const fontSize = size === 'sm' ? font.sm : size === 'md' ? font.md : font.lg;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.btn,
        { height: sizeH, borderRadius: radius.md },
        isPrimary && { backgroundColor: colors.primary },
        isOutline && {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.border,
        },
        isDanger && { backgroundColor: colors.danger },
        isSoft && { backgroundColor: colors.surfaceLight },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        (disabled || loading) && { opacity: 0.35 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.white : colors.text} />
      ) : (
        <Text
          style={[
            styles.btnText,
            { fontSize },
            isPrimary && { color: colors.white },
            isOutline && { color: colors.text },
            isDanger && { color: colors.white },
            isSoft && { color: colors.text },
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
export function Pill({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.pill,
        selected && styles.pillSelected,
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
export function Badge({ label, color }) {
  const c = color || colors.textSecondary;
  return (
    <View style={[styles.badge, { backgroundColor: c + '12', borderColor: c + '30' }]}>
      <Text style={[styles.badgeText, { color: c }]}>{label}</Text>
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
      <Text style={[styles.avatarText, { fontSize: size * 0.36 }]}>
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
              color: n <= rating ? colors.warning : colors.border,
              marginHorizontal: 3,
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

/* ───── SafetyBanner (subtle, not alarming) ───── */
export function SafetyBanner({ compact }) {
  return (
    <View style={[styles.safetyBanner, compact && { paddingVertical: spacing.sm + 2 }]}>
      <Text style={styles.safetyTitle}>
        Peer guidance — not therapy or medical advice
      </Text>
      {!compact && (
        <Text style={styles.safetyBody}>
          Feelya connects you with peer guides for coaching and support.
          {'\n'}If you need immediate help, call or text{' '}
          <Text style={{ fontWeight: '600' }}>988</Text>{' '}
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
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    color: colors.text,
    fontSize: font.sm,
    fontWeight: '500',
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
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.xs + 2,
    marginBottom: spacing.xs + 2,
  },
  badgeText: {
    fontSize: font.xs,
    fontWeight: '600',
  },
  avatar: {
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.textSecondary,
    fontWeight: '600',
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
    backgroundColor: colors.surfaceLight,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  safetyTitle: {
    color: colors.textSecondary,
    fontWeight: '500',
    fontSize: font.sm,
    marginBottom: 2,
  },
  safetyBody: {
    color: colors.textMuted,
    fontSize: font.xs,
    lineHeight: 18,
    marginTop: 4,
  },
});
