import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  TextInput as RNTextInput,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Animated,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font } from '../theme';

/* ───── Screen (safe-area wrapper) ───── */
export function Screen({ children, style }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        screenStyles.screen,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/* ───── Header ───── */
export function Header({ title, onBack, rightAction, rightIcon, style }) {
  return (
    <View style={[screenStyles.header, style]}>
      <View style={screenStyles.headerLeft}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} hitSlop={12} style={screenStyles.headerBackBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>
      <Text style={screenStyles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={screenStyles.headerRight}>
        {rightAction ? (
          <TouchableOpacity onPress={rightAction} hitSlop={12}>
            <Ionicons name={rightIcon || 'ellipsis-horizontal'} size={22} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>
    </View>
  );
}

/* ───── PrimaryButton ───── */
export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        btnStyles.primary,
        (disabled || loading) && { opacity: 0.35 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <View style={btnStyles.inner}>
          {icon && (
            <Ionicons name={icon} size={20} color={colors.white} style={{ marginRight: spacing.sm }} />
          )}
          <Text style={btnStyles.primaryText}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

/* ───── SecondaryButton ───── */
export function SecondaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  variant = 'outline', // outline | ghost | danger | soft
  style,
}) {
  const isDanger = variant === 'danger';
  const isSoft = variant === 'soft';
  const isGhost = variant === 'ghost';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        btnStyles.secondary,
        !isGhost && !isSoft && {
          borderWidth: 1.5,
          borderColor: isDanger ? colors.danger : colors.border,
        },
        isSoft && { backgroundColor: colors.surfaceLight },
        (disabled || loading) && { opacity: 0.35 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isDanger ? colors.danger : colors.text} />
      ) : (
        <View style={btnStyles.inner}>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={isDanger ? colors.danger : isGhost ? colors.textSecondary : colors.text}
              style={{ marginRight: spacing.sm }}
            />
          )}
          <Text
            style={[
              btnStyles.secondaryText,
              isDanger && { color: colors.danger },
              isGhost && { color: colors.textSecondary },
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

/* ───── Card ───── */
export function Card({ children, style, onPress }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  const extra = onPress ? { onPress, activeOpacity: 0.85 } : {};
  return (
    <Wrapper style={[cardStyles.card, style]} {...extra}>
      {children}
    </Wrapper>
  );
}

/* ───── Input ───── */
export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  multiline,
  maxLength,
  keyboardType,
  returnKeyType,
  onSubmitEditing,
  autoFocus,
  style,
  inputStyle,
  icon,
}) {
  return (
    <View style={style}>
      {label && <Text style={inputStyles.label}>{label}</Text>}
      <View style={[inputStyles.wrap, multiline && { minHeight: 88 }]}>
        {icon && (
          <Ionicons name={icon} size={20} color={colors.textMuted} style={{ marginRight: spacing.sm }} />
        )}
        <RNTextInput
          style={[
            inputStyles.field,
            multiline && { textAlignVertical: 'top', paddingTop: spacing.md },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          maxLength={maxLength}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          autoFocus={autoFocus}
        />
      </View>
    </View>
  );
}

/* ───── Pill / Chip ───── */
export function Pill({ label, selected, onPress, icon }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[pillStyles.pill, selected && pillStyles.selected]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={14}
          color={selected ? colors.white : colors.textSecondary}
          style={{ marginRight: 4 }}
        />
      )}
      <Text style={[pillStyles.text, selected && { color: colors.white }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ───── ListRow ───── */
export function ListRow({ icon, title, subtitle, right, onPress, showChevron = true }) {
  return (
    <TouchableOpacity
      style={listStyles.row}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {icon && (
        <View style={listStyles.icon}>
          <Ionicons name={icon} size={20} color={colors.textSecondary} />
        </View>
      )}
      <View style={listStyles.content}>
        <Text style={listStyles.title}>{title}</Text>
        {subtitle && <Text style={listStyles.subtitle}>{subtitle}</Text>}
      </View>
      {right && <View style={{ marginRight: spacing.sm }}>{right}</View>}
      {onPress && showChevron && (
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

/* ───── BottomSheet ───── */
export function BottomSheet({ visible, onClose, title, children }) {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      slideAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={sheetStyles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '100%' }}
        >
          <Animated.View
            style={[
              sheetStyles.card,
              {
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                }],
              },
            ]}
          >
            <Pressable>
              <View style={sheetStyles.handle} />
              {title && <Text style={sheetStyles.title}>{title}</Text>}
              {children}
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

/* ───── Skeleton ───── */
export function Skeleton({ width, height = 16, borderRadius: br = radius.sm, style }) {
  const pulse = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);
  return (
    <Animated.View
      style={[{ width, height, borderRadius: br, backgroundColor: colors.surfaceLight, opacity: pulse }, style]}
    />
  );
}

/* ───── Avatar ───── */
export function Avatar({ name, size = 48 }) {
  const initials = (name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return (
    <View style={[miscStyles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[miscStyles.avatarText, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

/* ───── StarRating ───── */
export function StarRating({ rating, setRating, size = 32 }) {
  return (
    <View style={miscStyles.starRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} onPress={() => setRating && setRating(n)} activeOpacity={0.7} hitSlop={4}>
          <Ionicons
            name={n <= rating ? 'star' : 'star-outline'}
            size={size}
            color={n <= rating ? colors.warning : colors.border}
            style={{ marginHorizontal: 3 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

/* ───── SectionTitle ───── */
export function SectionTitle({ children, style }) {
  return <Text style={[miscStyles.sectionTitle, style]}>{children}</Text>;
}

/* ───── Badge ───── */
export function Badge({ label, color, icon }) {
  const c = color || colors.textSecondary;
  return (
    <View style={[miscStyles.badge, { backgroundColor: c + '12', borderColor: c + '30' }]}>
      {icon && <Ionicons name={icon} size={12} color={c} style={{ marginRight: 3 }} />}
      <Text style={[miscStyles.badgeText, { color: c }]}>{label}</Text>
    </View>
  );
}

/* ───── Divider ───── */
export function Divider({ style }) {
  return <View style={[miscStyles.divider, style]} />;
}

/* ───── SafetyBanner ───── */
export function SafetyBanner({ compact }) {
  return (
    <View style={[miscStyles.safetyBanner, compact && { paddingVertical: spacing.sm + 2 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: compact ? 0 : 2 }}>
        <Ionicons name="shield-checkmark-outline" size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
        <Text style={miscStyles.safetyTitle}>Peer guidance -- not therapy or medical advice</Text>
      </View>
      {!compact && (
        <Text style={miscStyles.safetyBody}>
          Feelya connects you with peer guides for coaching and support.
          {'\n'}If you need immediate help, call or text{' '}
          <Text style={{ fontWeight: '600' }}>988</Text> (Suicide & Crisis Lifeline).
        </Text>
      )}
    </View>
  );
}

/* ───── EmptyState ───── */
export function EmptyState({ icon, title, subtitle }) {
  return (
    <View style={miscStyles.emptyState}>
      {icon && <Ionicons name={icon} size={48} color={colors.textMuted} style={{ marginBottom: spacing.md }} />}
      <Text style={miscStyles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={miscStyles.emptySubtitle}>{subtitle}</Text>}
    </View>
  );
}

/* ═══════ STYLES ═══════ */

const screenStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: 12,
    backgroundColor: colors.bg,
  },
  headerLeft: { width: 40 },
  headerBackBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: font.section, fontWeight: '600', color: colors.text, textAlign: 'center' },
  headerRight: { width: 40, alignItems: 'flex-end' },
});

const btnStyles = StyleSheet.create({
  primary: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primaryText: { color: colors.white, fontSize: font.body, fontWeight: '600', letterSpacing: 0.2 },
  secondary: {
    height: 52,
    backgroundColor: 'transparent',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  secondaryText: { color: colors.text, fontSize: font.body, fontWeight: '600', letterSpacing: 0.2 },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.cardPadding,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

const inputStyles = StyleSheet.create({
  label: { fontSize: font.caption, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.sm },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  field: { flex: 1, fontSize: font.body, color: colors.text, paddingVertical: 14 },
});

const pillStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { color: colors.text, fontSize: font.caption, fontWeight: '500' },
});

const listStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.screenPadding,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: { flex: 1 },
  title: { fontSize: font.body, fontWeight: '500', color: colors.text },
  subtitle: { fontSize: font.caption, color: colors.textSecondary, marginTop: 2 },
});

const sheetStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxl,
    maxHeight: '85%',
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.md },
  title: { fontSize: font.lg, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
});

const miscStyles = StyleSheet.create({
  avatar: { backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.textSecondary, fontWeight: '600' },
  starRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { color: colors.text, fontSize: font.section, fontWeight: '600', marginBottom: spacing.md },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.xs + 2,
    marginBottom: spacing.xs + 2,
  },
  badgeText: { fontSize: font.xs, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  safetyBanner: { backgroundColor: colors.surfaceLight, padding: spacing.cardPadding, borderRadius: radius.md },
  safetyTitle: { color: colors.textSecondary, fontWeight: '500', fontSize: font.caption },
  safetyBody: { color: colors.textMuted, fontSize: font.xs, lineHeight: 18, marginTop: spacing.xs, marginLeft: 22 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg },
  emptyTitle: { fontSize: font.body, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },
  emptySubtitle: { fontSize: font.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
});
