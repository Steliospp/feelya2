import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import useTabScrollToTop from '../../hooks/useTabScrollToTop';
import { colors, spacing, radius, font, shadow } from '../../theme';
import {
  Screen, Avatar, BottomSheet, PrimaryButton, SecondaryButton, EmptyState,
} from '../../components/UI';
import { useApp, MOCK_GUIDES, MOCK_PROVIDERS } from '../../store/AppContext';

const JOIN_WINDOW_MINUTES = 10;
const TABS = ['Active', 'Scheduled', 'Past'];

function formatDateLong(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function getCredentialLabel(guide) {
  if (!guide) return null;
  if (guide.type === 'licensed') return 'Licensed';
  if (guide.type === 'guide') return 'Certified';
  return null;
}

function friendlyDay(dateStr) {
  const today = new Date();
  const target = new Date(dateStr + 'T12:00:00');
  const diffDays = Math.round((target - new Date(today.toISOString().split('T')[0] + 'T12:00:00')) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return target.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function ChatsScreen({ navigation }) {
  const scrollRef = useTabScrollToTop();
  const { state, dispatch } = useApp();

  const pending = state.pendingRequests || [];
  const upcoming = state.bookings.filter((b) => b.status === 'upcoming');
  const past = state.bookings.filter((b) => b.status !== 'upcoming');

  const [activeTab, setActiveTab] = useState('Scheduled');
  const [, tick] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // "Too early" bottom sheet state
  const [earlyJoinBooking, setEarlyJoinBooking] = useState(null);

  const isFocused = useIsFocused();

  /* Reset to Scheduled tab every time Activity screen regains focus */
  useEffect(() => {
    if (isFocused) {
      setActiveTab('Scheduled');
      setSearchQuery('');
      setShowSearch(false);
    }
  }, [isFocused]);

  useEffect(() => {
    const interval = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  /* Timeout handling is now global in AppContext */

  const handleCancelRequest = useCallback((req) => {
    Alert.alert(
      'Cancel request',
      `Cancel your request to ${req.providerName}?`,
      [
        { text: 'Keep waiting', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => dispatch({ type: 'REMOVE_PENDING_REQUEST', payload: req.id }) },
      ],
    );
  }, [dispatch]);

  /* Reschedule → navigate to Guide Profile with availability auto-opened */
  const handleReschedule = (booking) => {
    navigation.navigate('GuideProfileChats', {
      guideId: booking.guideId,
      bookingId: booking.id,
      autoOpenAvailability: true,
      preselectedMode: booking.mode,
    });
  };

  /* Join Chat → time-based routing */
  const handleJoinChat = (booking) => {
    const startTime = new Date(booking.date + 'T00:00:00');
    startTime.setHours(booking.hour, 0, 0, 0);
    const diffMs = startTime - Date.now();
    const diffMins = diffMs / (1000 * 60);

    if (diffMins > JOIN_WINDOW_MINUTES) {
      // Too early — show hint sheet
      setEarlyJoinBooking(booking);
    } else {
      // Within join window or session started — go to lobby
      navigation.navigate('SessionLobby', { bookingId: booking.id });
    }
  };

  /* Card tap → Guide Profile */
  const handleCardTap = (booking) => {
    navigation.navigate('GuideProfileChats', { guideId: booking.guideId });
  };

  /* Search filtering — scoped to current tab */
  const q = searchQuery.toLowerCase().trim();
  const filteredPending = q
    ? pending.filter((r) => r.providerName.toLowerCase().includes(q) || (r.providerTitle || '').toLowerCase().includes(q))
    : pending;
  const filteredUpcoming = q
    ? upcoming.filter((b) => b.guideName.toLowerCase().includes(q) || (b.topics || []).some((t) => t.toLowerCase().includes(q)))
    : upcoming;
  const filteredPast = q
    ? past.filter((b) => b.guideName.toLowerCase().includes(q) || (b.topics || []).some((t) => t.toLowerCase().includes(q)))
    : past;
  const filteredSessions = q
    ? state.userSessions.filter((s) => s.guideName.toLowerCase().includes(q))
    : state.userSessions;

  const tabCounts = {
    Active: pending.length,
    Scheduled: upcoming.length,
    Past: past.length + state.userSessions.length,
  };

  const hasAnything = pending.length > 0 || state.bookings.length > 0 || state.userSessions.length > 0;

  const findGuide = (guideId) =>
    MOCK_GUIDES.find((g) => g.id === guideId) || MOCK_PROVIDERS.find((p) => p.id === guideId);

  return (
    <Screen>
      <ScrollView ref={scrollRef} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Activity</Text>
          <TouchableOpacity
            style={s.searchBtn}
            activeOpacity={0.7}
            onPress={() => { setShowSearch((v) => !v); if (showSearch) setSearchQuery(''); }}
          >
            <Ionicons name={showSearch ? 'close' : 'search-outline'} size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        {showSearch && (
          <View style={s.searchBar}>
            <Ionicons name="search-outline" size={16} color={colors.textMuted} />
            <TextInput
              style={s.searchInput}
              placeholder={`Search ${activeTab.toLowerCase()}…`}
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Segmented tabs */}
        <View style={s.segmentRow}>
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            const count = tabCounts[tab];
            return (
              <TouchableOpacity
                key={tab}
                style={[s.segmentBtn, isActive && s.segmentBtnActive]}
                onPress={() => { setActiveTab(tab); setSearchQuery(''); }}
                activeOpacity={0.7}
              >
                <Text style={[s.segmentText, isActive && s.segmentTextActive]}>{tab}</Text>
                {count > 0 && (
                  <View style={[s.segmentBadge, isActive && s.segmentBadgeActive]}>
                    <Text style={[s.segmentBadgeText, isActive && s.segmentBadgeTextActive]}>{count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {!hasAnything ? (
          <EmptyState
            icon="pulse-outline"
            title="No activity yet"
            subtitle="Start a conversation to connect with a guide"
          />
        ) : (
          <>
            {/* ── Active tab (pending requests) ── */}
            {activeTab === 'Active' && (
              filteredPending.length === 0 ? (
                <EmptyState icon="chatbubble-outline" title={q ? 'No results' : 'No active chats'} subtitle={q ? 'Try a different search' : 'Your active conversations will appear here'} />
              ) : (
                filteredPending.map((req) => {
                  const elapsed = Date.now() - req.requestedAt;
                  const remaining = Math.max(0, (5 * 60 * 1000) - elapsed);
                  const mins = Math.floor(remaining / 60000);
                  const secs = Math.floor((remaining % 60000) / 1000);
                  const timeStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
                  return (
                    <TouchableOpacity
                      key={req.id}
                      activeOpacity={0.85}
                      onPress={() => {
                        if (req.guideId) {
                          navigation.navigate('GuideProfileChats', { guideId: req.guideId });
                        }
                      }}
                    >
                      <View style={s.card}>
                        <View style={s.cardTop}>
                          {req.avatar ? (
                            <Image source={{ uri: req.avatar }} style={s.avatarImg} />
                          ) : (
                            <Avatar name={req.providerName} size={52} />
                          )}
                          <View style={s.cardInfo}>
                            <Text style={s.cardName}>{req.providerName}</Text>
                            <Text style={s.cardSub} numberOfLines={1}>{req.providerTitle}</Text>
                          </View>
                        </View>
                        <View style={s.waitingRow}>
                          <View style={s.waitingPill}>
                            <Ionicons name="time-outline" size={14} color={colors.accent} />
                            <Text style={s.waitingLabel}>Waiting</Text>
                          </View>
                          <Text style={s.waitingTimer}>{timeStr}</Text>
                        </View>
                        <TouchableOpacity
                          style={s.cancelBtn}
                          activeOpacity={0.7}
                          onPress={() => handleCancelRequest(req)}
                        >
                          <Text style={s.cancelBtnText}>Cancel Request</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )
            )}

            {/* ── Scheduled tab ── */}
            {activeTab === 'Scheduled' && (
              filteredUpcoming.length === 0 ? (
                <EmptyState icon="calendar-outline" title={q ? 'No results' : 'No scheduled chats'} subtitle={q ? 'Try a different search' : 'Book a session to see it here'} />
              ) : (
                filteredUpcoming.map((b) => {
                  const guide = findGuide(b.guideId);
                  const cred = getCredentialLabel(guide);
                  const topic = b.topics?.[0];
                  return (
                    <TouchableOpacity
                      key={b.id}
                      activeOpacity={0.85}
                      onPress={() => handleCardTap(b)}
                    >
                      <View style={s.card}>
                        {/* Top row: avatar + name + credential */}
                        <View style={s.cardTop}>
                          {guide?.avatar ? (
                            <Image source={{ uri: guide.avatar }} style={s.avatarImg} />
                          ) : (
                            <Avatar name={b.guideName} size={52} />
                          )}
                          <View style={s.cardInfo}>
                            <View style={s.nameRow}>
                              <Text style={s.cardName}>{b.guideName}</Text>
                              {cred && (
                                <View style={s.credPill}>
                                  <Text style={s.credText}>{cred}</Text>
                                </View>
                              )}
                            </View>
                            {/* Topic pill */}
                            {topic && (
                              <View style={s.topicPill}>
                                <Text style={s.topicText}>{topic}</Text>
                              </View>
                            )}
                          </View>
                        </View>

                        {/* Meta row: day, time, duration */}
                        <View style={s.metaRow}>
                          <View style={s.metaItem}>
                            <Ionicons name="calendar-outline" size={15} color={colors.textMuted} />
                            <Text style={s.metaText}>{friendlyDay(b.date)}</Text>
                          </View>
                          <View style={s.metaItem}>
                            <Ionicons name="time-outline" size={15} color={colors.textMuted} />
                            <Text style={s.metaText}>{b.timeLabel}</Text>
                          </View>
                          <View style={s.metaItem}>
                            <Ionicons name="hourglass-outline" size={15} color={colors.textMuted} />
                            <Text style={s.metaText}>{b.duration} min</Text>
                          </View>
                        </View>

                        {/* Action buttons */}
                        <View style={s.btnRow}>
                          <TouchableOpacity
                            style={s.btnOutline}
                            activeOpacity={0.7}
                            onPress={() => handleReschedule(b)}
                          >
                            <Text style={s.btnOutlineText}>Reschedule</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={s.btnFilled}
                            activeOpacity={0.7}
                            onPress={() => handleJoinChat(b)}
                          >
                            <Text style={s.btnFilledText}>Join Chat</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )
            )}

            {/* ── Past tab ── */}
            {activeTab === 'Past' && (
              (filteredPast.length === 0 && filteredSessions.length === 0) ? (
                <EmptyState icon="checkmark-done-outline" title={q ? 'No results' : 'No past chats'} subtitle={q ? 'Try a different search' : 'Completed conversations will show here'} />
              ) : (
                <>
                  {filteredPast.map((b) => {
                    const guide = findGuide(b.guideId);
                    const cred = getCredentialLabel(guide);
                    return (
                      <TouchableOpacity
                        key={b.id}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('ChatDetail', { bookingId: b.id })}
                      >
                        <View style={s.card}>
                          <View style={s.cardTop}>
                            {guide?.avatar ? (
                              <Image source={{ uri: guide.avatar }} style={s.avatarImg} />
                            ) : (
                              <Avatar name={b.guideName} size={52} />
                            )}
                            <View style={s.cardInfo}>
                              <View style={s.nameRow}>
                                <Text style={s.cardName}>{b.guideName}</Text>
                                {cred && (
                                  <View style={s.credPill}>
                                    <Text style={s.credText}>{cred}</Text>
                                  </View>
                                )}
                              </View>
                              <Text style={s.cardSub}>{formatDateLong(b.date)}</Text>
                            </View>
                            <View style={[s.statusPill, b.status === 'completed' ? s.statusCompleted : s.statusCancelled]}>
                              <Text style={[s.statusText, b.status === 'completed' ? s.statusTextCompleted : s.statusTextCancelled]}>
                                {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                  {filteredSessions.slice(0, 5).map((sess) => (
                    <View key={sess.id} style={s.card}>
                      <View style={s.cardTop}>
                        <Avatar name={sess.guideName} size={52} />
                        <View style={s.cardInfo}>
                          <Text style={s.cardName}>{sess.guideName}</Text>
                          <Text style={s.cardSub}>
                            {new Date(sess.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            {' · '}{sess.minutes}m
                          </Text>
                        </View>
                        {sess.rating ? (
                          <View style={s.ratingPill}>
                            <Ionicons name="star" size={12} color={colors.warning} />
                            <Text style={s.ratingText}>{sess.rating}</Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  ))}
                </>
              )
            )}
          </>
        )}
      </ScrollView>

      {/* "Too early" bottom sheet */}
      <BottomSheet
        visible={!!earlyJoinBooking}
        onClose={() => setEarlyJoinBooking(null)}
        title="Your chat hasn't started yet"
      >
        {earlyJoinBooking && (
          <View>
            <Text style={s.sheetSub}>
              Starts at {earlyJoinBooking.timeLabel}. You can join 10 minutes before.
            </Text>
            <View style={s.earlyBtnRow}>
              <SecondaryButton
                title="OK"
                variant="outline"
                onPress={() => setEarlyJoinBooking(null)}
                style={{ flex: 1, marginRight: spacing.sm }}
              />
              <PrimaryButton
                title="Reschedule"
                onPress={() => {
                  const b = earlyJoinBooking;
                  setEarlyJoinBooking(null);
                  handleReschedule(b);
                }}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        )}
      </BottomSheet>
    </Screen>
  );
}

/* ═══════════════  STYLES  ═══════════════ */
const s = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xxl + 8,
    paddingBottom: 120,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: font.title,
    fontWeight: '700',
    color: colors.text,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },

  /* Segmented control */
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.full,
    padding: 3,
    marginBottom: spacing.lg,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  segmentBtnActive: {
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  segmentText: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.textMuted,
  },
  segmentTextActive: {
    color: colors.text,
  },
  segmentBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    paddingHorizontal: 5,
  },
  segmentBadgeActive: {
    backgroundColor: colors.primary,
  },
  segmentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  segmentBadgeTextActive: {
    color: colors.white,
  },

  /* Card */
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.cardPadding + 2,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surfaceLight,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cardName: {
    fontSize: font.body + 1,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  cardSub: {
    fontSize: font.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },

  /* Credential pill */
  credPill: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  credText: {
    fontSize: font.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  /* Topic pill */
  topicPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8FAF0',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
  },
  topicText: {
    fontSize: font.xs + 1,
    fontWeight: '500',
    color: '#2D8A5F',
  },

  /* Meta row */
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: font.caption,
    color: colors.text,
    marginLeft: 5,
    fontWeight: '700',
  },

  /* Action buttons */
  btnRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10,
  },
  btnOutline: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineText: {
    fontSize: font.caption + 1,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  btnFilled: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.full,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFilledText: {
    fontSize: font.caption + 1,
    fontWeight: '600',
    color: colors.white,
  },

  /* Status pills (past tab) */
  statusPill: {
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusCompleted: {
    backgroundColor: '#E8FAF0',
  },
  statusCancelled: {
    backgroundColor: '#FEF2F2',
  },
  statusText: {
    fontSize: font.xs,
    fontWeight: '600',
  },
  statusTextCompleted: {
    color: '#2D8A5F',
  },
  statusTextCancelled: {
    color: colors.danger,
  },

  /* Rating (past sessions) */
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: font.xs,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 3,
  },

  /* Waiting (active tab) */
  waitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  waitingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  waitingLabel: {
    fontSize: font.xs,
    fontWeight: '600',
    color: colors.accent,
    marginLeft: 4,
  },
  waitingTimer: {
    fontSize: font.caption,
    fontWeight: '700',
    color: colors.textMuted,
  },

  /* Cancel button (active tab) */
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: font.caption,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  /* Search bar */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    height: 42,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: font.body,
    color: colors.text,
    marginLeft: 8,
    paddingVertical: 0,
  },

  /* "Too early" bottom sheet */
  sheetSub: {
    fontSize: font.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  earlyBtnRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
});
