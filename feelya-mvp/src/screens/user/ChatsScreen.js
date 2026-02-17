import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTabScrollToTop from '../../hooks/useTabScrollToTop';
import { colors, spacing, radius, font, shadow } from '../../theme';
import {
  Screen, Card, Avatar, Badge, SectionTitle, EmptyState,
} from '../../components/UI';
import { useApp, MOCK_GUIDES } from '../../store/AppContext';

const REQUEST_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export default function ChatsScreen({ navigation }) {
  const scrollRef = useTabScrollToTop();
  const { state, dispatch } = useApp();
  const upcoming = state.bookings.filter((b) => b.status === 'upcoming');
  const past = state.bookings.filter((b) => b.status !== 'upcoming');
  const pending = state.pendingRequests || [];

  // Track which request IDs have already shown the expiry prompt
  const expiredShown = useRef(new Set());
  // Force re-render every second so countdown updates
  const [, tick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Check for expired requests
  useEffect(() => {
    pending.forEach((req) => {
      const elapsed = Date.now() - req.requestedAt;
      if (elapsed >= REQUEST_TIMEOUT_MS && !expiredShown.current.has(req.id)) {
        expiredShown.current.add(req.id);
        dispatch({ type: 'REMOVE_PENDING_REQUEST', payload: req.id });
        Alert.alert(
          `${req.providerName} wasn't available`,
          'Would you like to request a new session?',
          [
            { text: 'No', style: 'cancel' },
            {
              text: 'Yes',
              onPress: () => navigation.navigate('Home', { screen: 'TopicSelect' }),
            },
          ],
        );
      }
    });
  }, [pending, dispatch, navigation]);

  const handleCancelRequest = useCallback((req) => {
    Alert.alert(
      'Cancel request',
      `Cancel your request to ${req.providerName}?`,
      [
        { text: 'Keep waiting', style: 'cancel' },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: () => dispatch({ type: 'REMOVE_PENDING_REQUEST', payload: req.id }),
        },
      ],
    );
  }, [dispatch]);

  const modeIcon = (m) =>
    m === 'chat' ? 'chatbubble-outline' : m === 'voice' ? 'mic-outline' : 'videocam-outline';

  const hasAnything = pending.length > 0 || state.bookings.length > 0 || state.userSessions.length > 0;

  return (
    <Screen>
      <ScrollView ref={scrollRef} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Activity</Text>

        {!hasAnything ? (
          <EmptyState
            icon="pulse-outline"
            title="No activity yet"
            subtitle="Start a conversation to connect with a guide"
          />
        ) : (
          <>
            {/* Pending requests */}
            {pending.length > 0 && (
              <>
                <SectionTitle>Waiting for response</SectionTitle>
                {pending.map((req) => {
                  const elapsed = Date.now() - req.requestedAt;
                  const remaining = Math.max(0, REQUEST_TIMEOUT_MS - elapsed);
                  const mins = Math.floor(remaining / 60000);
                  const secs = Math.floor((remaining % 60000) / 1000);
                  const timeStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

                  return (
                    <TouchableOpacity
                      key={req.id}
                      activeOpacity={0.85}
                      onPress={() => handleCancelRequest(req)}
                    >
                      <Card style={s.card}>
                        <View style={s.row}>
                          {req.avatar ? (
                            <Image source={{ uri: req.avatar }} style={s.avatarImg} />
                          ) : (
                            <Avatar name={req.providerName} size={48} />
                          )}
                          <View style={s.info}>
                            <Text style={s.name}>{req.providerName}</Text>
                            <Text style={s.bio} numberOfLines={1}>{req.providerTitle}</Text>
                            {req.topics && req.topics.length > 0 && (
                              <Text style={s.dateText}>
                                {req.topics.slice(0, 2).join(', ')}
                              </Text>
                            )}
                          </View>
                          <View style={s.waitingCol}>
                            <View style={s.waitingBadge}>
                              <Ionicons name="time-outline" size={12} color={colors.accent} />
                              <Text style={s.waitingText}>Waiting</Text>
                            </View>
                            <Text style={s.timerText}>{timeStr}</Text>
                          </View>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}

            {/* Active / Scheduled chats */}
            {upcoming.length > 0 && (
              <>
                <SectionTitle>Scheduled</SectionTitle>
                {upcoming.map((b) => {
                  const guide = MOCK_GUIDES.find((g) => g.id === b.guideId);
                  return (
                    <Card
                      key={b.id}
                      style={s.card}
                      onPress={() => navigation.navigate('ChatDetail', { bookingId: b.id })}
                    >
                      <View style={s.row}>
                        <Avatar name={b.guideName} size={48} />
                        <View style={s.info}>
                          <Text style={s.name}>{b.guideName}</Text>
                          {guide && (
                            <Text style={s.bio} numberOfLines={1}>{guide.bio}</Text>
                          )}
                          <View style={s.timeRow}>
                            <Ionicons name="time-outline" size={13} color={colors.textMuted} />
                            <Text style={s.dateText}>
                              {formatDate(b.date)} at {b.timeLabel}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={s.footerRow}>
                        <View style={s.modePill}>
                          <Ionicons name={modeIcon(b.mode)} size={14} color={colors.primary} />
                          <Text style={s.modeText}>{b.mode}</Text>
                        </View>
                      </View>
                    </Card>
                  );
                })}
              </>
            )}

            {/* Past chats */}
            {past.length > 0 && (
              <>
                <SectionTitle style={{ marginTop: spacing.lg }}>Past</SectionTitle>
                {past.map((b) => {
                  const guide = MOCK_GUIDES.find((g) => g.id === b.guideId);
                  return (
                    <Card
                      key={b.id}
                      style={s.card}
                      onPress={() => navigation.navigate('ChatDetail', { bookingId: b.id })}
                    >
                      <View style={s.row}>
                        <Avatar name={b.guideName} size={48} />
                        <View style={s.info}>
                          <Text style={s.name}>{b.guideName}</Text>
                          {guide && (
                            <Text style={s.bio} numberOfLines={1}>{guide.bio}</Text>
                          )}
                          <Text style={s.dateText}>
                            {formatDate(b.date)}
                          </Text>
                        </View>
                        <Badge label={b.status.charAt(0).toUpperCase() + b.status.slice(1)} color={b.status === 'completed' ? colors.textSecondary : colors.danger} />
                      </View>
                    </Card>
                  );
                })}
              </>
            )}

            {/* Recent sessions (from completed conversations) */}
            {state.userSessions.length > 0 && (
              <>
                <SectionTitle style={{ marginTop: spacing.lg }}>Recent Conversations</SectionTitle>
                {state.userSessions.slice(0, 5).map((sess) => (
                  <Card key={sess.id} style={s.card}>
                    <View style={s.row}>
                      <Avatar name={sess.guideName} size={48} />
                      <View style={s.info}>
                        <Text style={s.name}>{sess.guideName}</Text>
                        <Text style={s.bio} numberOfLines={1}>
                          {sess.topics.slice(0, 2).join(', ')}
                        </Text>
                        <Text style={s.dateText}>
                          {new Date(sess.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          {' -- '}
                          {sess.minutes}m
                        </Text>
                      </View>
                      {sess.rating ? (
                        <View style={s.ratingBadge}>
                          <Ionicons name="star" size={12} color={colors.warning} />
                          <Text style={s.ratingText}>{sess.rating}</Text>
                        </View>
                      ) : null}
                    </View>
                  </Card>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

const s = StyleSheet.create({
  scroll: { padding: spacing.screenPadding, paddingTop: spacing.xxl, paddingBottom: 100 },
  title: { fontSize: font.title, fontWeight: '600', color: colors.text, marginBottom: spacing.lg },
  card: { marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: font.body, fontWeight: '600', color: colors.text },
  bio: { fontSize: font.caption, color: colors.textSecondary, marginTop: 1 },
  dateText: { fontSize: font.xs, color: colors.textMuted, marginTop: 2 },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceLight,
  },
  waitingCol: {
    alignItems: 'center',
  },
  waitingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  waitingText: {
    fontSize: font.xs,
    fontWeight: '600',
    color: colors.accent,
    marginLeft: 4,
  },
  timerText: {
    fontSize: font.xs,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm + 2,
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  modeText: { fontSize: font.xs, color: colors.primary, marginLeft: 4, fontWeight: '500' },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  continueText: { fontSize: font.xs, fontWeight: '600', color: colors.primary, marginRight: 4 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: { fontSize: font.xs, fontWeight: '600', color: colors.text, marginLeft: 3 },
});
