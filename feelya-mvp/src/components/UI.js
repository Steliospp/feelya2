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
import { colors, spacing, radius, font, shadow } from '../theme';

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
            <View style={screenStyles.headerBackCircle}>
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </View>
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
            <View style={screenStyles.headerBackCircle}>
              <Ionicons name={rightIcon || 'ellipsis-horizontal'} size={20} color={colors.text} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>
    </View>
  );
}

/* ───── SearchBar ───── */
export function SearchBar({ placeholder, value, onChangeText, style }) {
  return (
    <View style={[searchStyles.container, style]}>
      <Ionicons name="search-outline" size={18} color={colors.textMuted} style={{ marginRight: spacing.sm }} />
      <RNTextInput
        style={searchStyles.input}
        placeholder={placeholder || 'Search...'}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

/* ───── CategoryIcon ───── */
export function CategoryIcon({ icon, label, color, onPress, size = 56 }) {
  return (
    <TouchableOpacity style={catStyles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[catStyles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '18' }]}>
        <Ionicons name={icon} size={size * 0.42} color={color} />
      </View>
      <Text style={catStyles.label} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ───── FeatureCard (gradient-like promo card) ───── */
export function FeatureCard({ title, subtitle, icon, onPress, style }) {
  return (
    <TouchableOpacity
      style={[featStyles.card, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={featStyles.content}>
        <Text style={featStyles.title}>{title}</Text>
        <Text style={featStyles.subtitle}>{subtitle}</Text>
        <View style={featStyles.arrowBtn}>
          <Ionicons name="arrow-forward" size={16} color={colors.white} />
        </View>
      </View>
      <View style={featStyles.iconWrap}>
        <Ionicons name={icon || 'sparkles'} size={48} color={colors.white + '30'} />
      </View>
    </TouchableOpacity>
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
          borderWidth: 1,
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

/* ───── Card (shadow-based) ───── */
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
          <Ionicons name={icon} size={20} color={colors.primary} />
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
  const insets = useSafeAreaInsets();

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
                maxHeight: '85%',
                paddingBottom: insets.bottom || spacing.md,
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                }],
              },
            ]}
          >
            <Pressable style={{ flex: 1 }}>
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
export function SectionTitle({ children, style, right }) {
  return (
    <View style={miscStyles.sectionTitleRow}>
      <Text style={[miscStyles.sectionTitle, style]}>{children}</Text>
      {right && right}
    </View>
  );
}

/* ───── Badge ───── */
export function Badge({ label, color, icon }) {
  const c = color || colors.primary;
  return (
    <View style={[miscStyles.badge, { backgroundColor: c + '14', borderColor: c + '30' }]}>
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
        <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
        <Text style={miscStyles.safetyTitle}>This is a place to talk things through -- not therapy</Text>
      </View>
      {!compact && (
        <Text style={miscStyles.safetyBody}>
          Feelya connects you with guides for support and conversation.
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
      {icon && (
        <View style={miscStyles.emptyIconCircle}>
          <Ionicons name={icon} size={32} color={colors.primary} />
        </View>
      )}
      <Text style={miscStyles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={miscStyles.emptySubtitle}>{subtitle}</Text>}
    </View>
  );
}

/* ───── QuoteCard ───── */
export function QuoteCard({ text, author, style }) {
  return (
    <View style={[quoteCardStyles.card, style]}>
      <View style={quoteCardStyles.iconWrap}>
        <Ionicons name="leaf-outline" size={20} color={colors.primary} />
      </View>
      <Text style={quoteCardStyles.text}>{text}</Text>
      {author && <Text style={quoteCardStyles.author}>-- {author}</Text>}
    </View>
  );
}

/* ───── PrimaryCTA ───── */
export function PrimaryCTA({ title, subtitle, onPress, style }) {
  return (
    <TouchableOpacity style={[ctaStyles.card, style]} onPress={onPress} activeOpacity={0.85}>
      <View style={ctaStyles.content}>
        <Text style={ctaStyles.title}>{title}</Text>
        {subtitle && <Text style={ctaStyles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={ctaStyles.arrow}>
        <Ionicons name="arrow-forward" size={20} color={colors.white} />
      </View>
    </TouchableOpacity>
  );
}

/* ───── CategoryTile ───── */
export function CategoryTile({ label, icon, color, onPress, style }) {
  return (
    <TouchableOpacity style={[tileStyles.tile, style]} onPress={onPress} activeOpacity={0.8}>
      <View style={[tileStyles.iconCircle, { backgroundColor: (color || colors.primary) + '18' }]}>
        <Ionicons name={icon || 'ellipse-outline'} size={22} color={color || colors.primary} />
      </View>
      <Text style={tileStyles.label} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ───── ResumeCard ───── */
export function ResumeCard({ name, topics, timeLabel, date, onPress, style }) {
  return (
    <TouchableOpacity style={[resumeCardStyles.card, style]} onPress={onPress} activeOpacity={0.85}>
      <View style={resumeCardStyles.row}>
        <Avatar name={name} size={44} />
        <View style={resumeCardStyles.info}>
          <Text style={resumeCardStyles.name} numberOfLines={1}>{name}</Text>
          <Text style={resumeCardStyles.topics} numberOfLines={1}>
            {topics?.slice(0, 2).join(', ')}
          </Text>
          {(date || timeLabel) && (
            <View style={resumeCardStyles.timeRow}>
              <Ionicons name="time-outline" size={12} color={colors.textMuted} />
              <Text style={resumeCardStyles.timeText}>
                {date}{timeLabel ? ` at ${timeLabel}` : ''}
              </Text>
            </View>
          )}
        </View>
        <View style={resumeCardStyles.arrowCircle}>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* ───── GuideCard (horizontal scroll card) ───── */
export function GuideCard({ name, rating, conversations, topics, onPress, style }) {
  const initials = (name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return (
    <TouchableOpacity style={[guideCardStyles.card, style]} onPress={onPress} activeOpacity={0.85}>
      <View style={guideCardStyles.avatarBg}>
        <Text style={guideCardStyles.avatarText}>{initials}</Text>
      </View>
      <View style={guideCardStyles.info}>
        <Text style={guideCardStyles.name} numberOfLines={1}>{name}</Text>
        <View style={guideCardStyles.ratingRow}>
          <Ionicons name="star" size={12} color={colors.warning} />
          <Text style={guideCardStyles.rating}>{rating}</Text>
          <Text style={guideCardStyles.conversations}> ({conversations})</Text>
        </View>
        <Text style={guideCardStyles.topics} numberOfLines={1}>
          {topics?.slice(0, 2).join(' / ')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// Backward-compat alias
export const CompanionCard = GuideCard;

/* ───── ResourceCard (blog/article preview) ───── */
export function ResourceCard({ title, description, readTime, onPress, style }) {
  return (
    <TouchableOpacity style={[resourceCardStyles.card, style]} onPress={onPress} activeOpacity={0.85}>
      <View style={resourceCardStyles.imagePlaceholder}>
        <Ionicons name="document-text-outline" size={24} color={colors.primary} />
      </View>
      <View style={resourceCardStyles.content}>
        <Text style={resourceCardStyles.title} numberOfLines={2}>{title}</Text>
        <Text style={resourceCardStyles.description} numberOfLines={2}>{description}</Text>
        {readTime && <Text style={resourceCardStyles.readTime}>{readTime}</Text>}
      </View>
    </TouchableOpacity>
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
  headerBackCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  headerTitle: { flex: 1, fontSize: font.section, fontWeight: '600', color: colors.text, textAlign: 'center' },
  headerRight: { width: 40, alignItems: 'flex-end' },
});

const searchStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    ...shadow.card,
  },
  input: {
    flex: 1,
    fontSize: font.body,
    color: colors.text,
    padding: 0,
  },
});

const catStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: font.xs,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

const featStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: { flex: 1 },
  title: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: font.caption,
    color: colors.white + 'CC',
    lineHeight: 19,
    marginBottom: spacing.md,
  },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white + '25',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  iconWrap: {
    position: 'absolute',
    right: -8,
    bottom: -8,
  },
});

const btnStyles = StyleSheet.create({
  primary: {
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primaryText: { color: colors.white, fontSize: font.body, fontWeight: '600', letterSpacing: 0.2 },
  secondary: {
    height: 50,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  secondaryText: { color: colors.text, fontSize: font.body, fontWeight: '500', letterSpacing: 0.1 },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.cardPadding,
    ...shadow.card,
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
    backgroundColor: colors.primaryLight,
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
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.md },
  title: { fontSize: font.lg, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
});

const guideCardStyles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    ...shadow.card,
  },
  avatarBg: {
    width: '100%',
    height: 80,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  info: {},
  name: {
    fontSize: font.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: font.xs,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 3,
  },
  conversations: {
    fontSize: font.xs,
    color: colors.textMuted,
  },
  topics: {
    fontSize: font.xs,
    color: colors.textSecondary,
  },
});

const quoteCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  text: {
    fontSize: font.body,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  author: {
    fontSize: font.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});

const ctaStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.fab,
  },
  content: { flex: 1 },
  title: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: font.caption,
    color: colors.white + 'CC',
    lineHeight: 19,
  },
  arrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white + '25',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
});

const tileStyles = StyleSheet.create({
  tile: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: font.body,
    fontWeight: '600',
    color: colors.text,
  },
});

const resumeCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.cardPadding,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: font.body, fontWeight: '600', color: colors.text },
  topics: { fontSize: font.caption, color: colors.textSecondary, marginTop: 1 },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  timeText: { fontSize: font.xs, color: colors.textMuted, marginLeft: 4 },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const resourceCardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.cardPadding,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  imagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: { flex: 1 },
  title: {
    fontSize: font.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: font.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  readTime: {
    fontSize: font.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});

const miscStyles = StyleSheet.create({
  avatar: { backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.primary, fontWeight: '600' },
  starRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  sectionTitle: { color: colors.text, fontSize: font.section, fontWeight: '600' },
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
  safetyBanner: { backgroundColor: colors.primaryLight, padding: spacing.cardPadding, borderRadius: radius.md },
  safetyTitle: { color: colors.textSecondary, fontWeight: '500', fontSize: font.caption },
  safetyBody: { color: colors.textMuted, fontSize: font.xs, lineHeight: 18, marginTop: spacing.xs, marginLeft: 22 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: { fontSize: font.body, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },
  emptySubtitle: { fontSize: font.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
});
