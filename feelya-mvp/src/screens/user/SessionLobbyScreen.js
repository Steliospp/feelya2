import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import { Screen, Header, Avatar, SecondaryButton } from '../../components/UI';
import { useApp, MOCK_GUIDES, MOCK_PROVIDERS } from '../../store/AppContext';

function friendlyDay(dateStr) {
  const today = new Date();
  const target = new Date(dateStr + 'T12:00:00');
  const diffDays = Math.round(
    (target - new Date(today.toISOString().split('T')[0] + 'T12:00:00')) / 86400000,
  );
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return target.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function SessionLobbyScreen({ navigation, route }) {
  const { state } = useApp();
  const { bookingId } = route.params || {};
  const booking = state.bookings.find((b) => b.id === bookingId);

  const guide =
    booking &&
    (MOCK_GUIDES.find((g) => g.id === booking.guideId) ||
      MOCK_PROVIDERS.find((p) => p.id === booking.guideId));

  /* pulse animation for the waiting indicator */
  const pulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
  }, [pulse]);

  /* countdown to session start */
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!booking) {
    return (
      <Screen>
        <Header title="Lobby" onBack={() => navigation.goBack()} />
        <View style={s.center}>
          <Text style={s.subtitle}>Booking not found</Text>
        </View>
      </Screen>
    );
  }

  const startTime = new Date(booking.date + 'T00:00:00');
  startTime.setHours(booking.hour, 0, 0, 0);
  const diffMs = startTime - now;
  const minsLeft = Math.max(0, Math.ceil(diffMs / 60000));

  const modeIcon =
    booking.mode === 'video' ? 'videocam-outline' :
    booking.mode === 'voice' ? 'call-outline' :
    'chatbubble-outline';

  return (
    <Screen>
      <Header title="Waiting Room" onBack={() => navigation.goBack()} />

      <View style={s.content}>
        {/* Guide avatar + name */}
        <View style={s.avatarWrap}>
          <Avatar name={booking.guideName} size={80} />
          <Animated.View style={[s.pulseRing, { opacity: pulse }]} />
        </View>

        <Text style={s.guideName}>{booking.guideName}</Text>
        <Text style={s.waiting}>Waiting for your guide to join…</Text>

        {/* Session details card */}
        <View style={s.detailCard}>
          <View style={s.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
            <Text style={s.detailText}>{friendlyDay(booking.date)}</Text>
          </View>
          <View style={s.detailRow}>
            <Ionicons name="time-outline" size={16} color={colors.textMuted} />
            <Text style={s.detailText}>{booking.timeLabel}</Text>
          </View>
          <View style={s.detailRow}>
            <Ionicons name={modeIcon} size={16} color={colors.textMuted} />
            <Text style={s.detailText}>
              {booking.mode.charAt(0).toUpperCase() + booking.mode.slice(1)} · {booking.duration} min
            </Text>
          </View>
        </View>

        {/* Countdown */}
        {minsLeft > 0 && (
          <View style={s.countdownPill}>
            <Ionicons name="hourglass-outline" size={14} color={colors.primary} />
            <Text style={s.countdownText}>
              Starts in {minsLeft} min{minsLeft !== 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {minsLeft === 0 && (
          <View style={[s.countdownPill, { backgroundColor: '#E8FAF0' }]}>
            <Ionicons name="checkmark-circle-outline" size={14} color="#2D8A5F" />
            <Text style={[s.countdownText, { color: '#2D8A5F' }]}>Session is starting</Text>
          </View>
        )}
      </View>

      {/* Bottom action */}
      <View style={s.footer}>
        <SecondaryButton
          title="Leave Lobby"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 80,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  pulseRing: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  guideName: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  waiting: {
    fontSize: font.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  subtitle: {
    fontSize: font.body,
    color: colors.textMuted,
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.cardPadding + 4,
    width: '100%',
    ...shadow.card,
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailText: {
    fontSize: font.body,
    color: colors.text,
    marginLeft: 10,
    fontWeight: '500',
  },
  countdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  countdownText: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  footer: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
});
