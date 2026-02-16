import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import {
  Screen, Card, Avatar, Badge, SectionTitle, EmptyState,
} from '../../components/UI';
import { useApp, MOCK_GUIDES } from '../../store/AppContext';

export default function ChatsScreen({ navigation }) {
  const { state } = useApp();
  const upcoming = state.bookings.filter((b) => b.status === 'upcoming');
  const past = state.bookings.filter((b) => b.status !== 'upcoming');
  const pending = state.pendingRequests || [];

  const modeIcon = (m) =>
    m === 'chat' ? 'chatbubble-outline' : m === 'voice' ? 'mic-outline' : 'videocam-outline';

  const hasAnything = pending.length > 0 || state.bookings.length > 0 || state.userSessions.length > 0;

  return (
    <Screen>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
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
                {pending.map((req) => (
                  <Card key={req.id} style={s.card}>
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
                      <View style={s.waitingBadge}>
                        <Ionicons name="time-outline" size={12} color={colors.accent} />
                        <Text style={s.waitingText}>Waiting</Text>
                      </View>
                    </View>
                  </Card>
                ))}
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
                        <TouchableOpacity
                          style={s.continueBtn}
                          onPress={() => navigation.navigate('ChatDetail', { bookingId: b.id })}
                        >
                          <Text style={s.continueText}>Continue</Text>
                          <Ionicons name="arrow-forward" size={14} color={colors.primary} />
                        </TouchableOpacity>
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
                        <Badge label={b.status} color={b.status === 'completed' ? colors.textSecondary : colors.danger} />
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
