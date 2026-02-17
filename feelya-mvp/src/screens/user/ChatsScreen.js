import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTabScrollToTop from '../../hooks/useTabScrollToTop';
import { colors, spacing, radius, font, shadow } from '../../theme';
import {
  Screen, Avatar, BottomSheet, PrimaryButton, EmptyState,
} from '../../components/UI';
import { useApp, MOCK_GUIDES, MOCK_PROVIDERS, generateAvailability } from '../../store/AppContext';

const REQUEST_TIMEOUT_MS = 5 * 60 * 1000;
const TABS = ['Active', 'Scheduled', 'Past'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

function formatDateLong(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function ChatsScreen({ navigation }) {
  const scrollRef = useTabScrollToTop();
  const { state, dispatch } = useApp();

  const pending = state.pendingRequests || [];
  const upcoming = state.bookings.filter((b) => b.status === 'upcoming');
  const past = state.bookings.filter((b) => b.status !== 'upcoming');

  const [activeTab, setActiveTab] = useState('Scheduled');
  const [, tick] = useState(0);

  // Reschedule bottom sheet state
  const [rescheduleBooking, setRescheduleBooking] = useState(null);
  const slots = rescheduleBooking ? generateAvailability(rescheduleBooking.guideId) : [];
  const dates = [...new Set(slots.map((sl) => sl.date))];
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const daySlots = slots.filter((sl) => sl.date === selectedDate);

  const expiredShown = useRef(new Set());

  useEffect(() => {
    const interval = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, []);

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
            { text: 'Yes', onPress: () => navigation.navigate('Home', { screen: 'TopicSelect' }) },
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
        { text: 'Cancel', style: 'destructive', onPress: () => dispatch({ type: 'REMOVE_PENDING_REQUEST', payload: req.id }) },
      ],
    );
  }, [dispatch]);

  const openReschedule = (booking) => {
    const sl = generateAvailability(booking.guideId);
    const ds = [...new Set(sl.map((s) => s.date))];
    setRescheduleBooking(booking);
    setSelectedDate(ds[0]);
    setSelectedSlot(null);
  };

  const handleReschedule = () => {
    if (!selectedSlot || !rescheduleBooking) return;
    const slot = slots.find((sl) => sl.id === selectedSlot);
    if (!slot) return;
    dispatch({
      type: 'RESCHEDULE_BOOKING',
      payload: { bookingId: rescheduleBooking.id, date: slot.date, hour: slot.hour, timeLabel: slot.label },
    });
    setRescheduleBooking(null);
    Alert.alert('Rescheduled', `Chat moved to ${formatDateLong(slot.date)} at ${slot.label}`);
  };

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
          <TouchableOpacity style={s.searchBtn} activeOpacity={0.7}>
            <Ionicons name="search-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Segmented tabs */}
        <View style={s.segmentRow}>
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            const count = tabCounts[tab];
            return (
              <TouchableOpacity
                key={tab}
                style={[s.segmentBtn, isActive && s.segmentBtnActive]}
                onPress={() => setActiveTab(tab)}
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
              pending.length === 0 ? (
                <EmptyState icon="chatbubble-outline" title="No active chats" subtitle="Your active conversations will appear here" />
              ) : (
                pending.map((req) => {
                  const elapsed = Date.now() - req.requestedAt;
                  const remaining = Math.max(0, REQUEST_TIMEOUT_MS - elapsed);
                  const mins = Math.floor(remaining / 60000);
                  const secs = Math.floor((remaining % 60000) / 1000);
                  const timeStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
                  return (
                    <TouchableOpacity key={req.id} activeOpacity={0.85} onPress={() => handleCancelRequest(req)}>
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
                      </View>
                    </TouchableOpacity>
                  );
                })
              )
            )}

            {/* ── Scheduled tab ── */}
            {activeTab === 'Scheduled' && (
              upcoming.length === 0 ? (
                <EmptyState icon="calendar-outline" title="No scheduled chats" subtitle="Book a session to see it here" />
              ) : (
                upcoming.map((b) => {
                  const guide = findGuide(b.guideId);
                  const cred = getCredentialLabel(guide);
                  const topic = b.topics?.[0];
                  return (
                    <View key={b.id} style={s.card}>
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
                          onPress={() => openReschedule(b)}
                        >
                          <Text style={s.btnOutlineText}>Reschedule</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={s.btnFilled}
                          activeOpacity={0.7}
                          onPress={() => navigation.navigate('ChatDetail', { bookingId: b.id })}
                        >
                          <Text style={s.btnFilledText}>Join Chat</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )
            )}

            {/* ── Past tab ── */}
            {activeTab === 'Past' && (
              (past.length === 0 && state.userSessions.length === 0) ? (
                <EmptyState icon="checkmark-done-outline" title="No past chats" subtitle="Completed conversations will show here" />
              ) : (
                <>
                  {past.map((b) => {
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
                  {state.userSessions.slice(0, 5).map((sess) => (
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

      {/* Reschedule bottom sheet */}
      <BottomSheet
        visible={!!rescheduleBooking}
        onClose={() => setRescheduleBooking(null)}
        title="Reschedule Chat"
      >
        <Text style={s.sheetSub}>Pick a new date & time</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
          {dates.map((d) => {
            const dt = new Date(d + 'T12:00:00');
            const isSel = d === selectedDate;
            return (
              <TouchableOpacity
                key={d}
                style={[s.dayBtn, isSel && s.dayBtnSel]}
                onPress={() => { setSelectedDate(d); setSelectedSlot(null); }}
                activeOpacity={0.7}
              >
                <Text style={[s.dayName, isSel && s.dayTextSel]}>{DAYS_SHORT[dt.getDay()]}</Text>
                <Text style={[s.dayNum, isSel && s.dayTextSel]}>{dt.getDate()}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={s.slotsGrid}>
          {daySlots.length === 0 ? (
            <Text style={s.noSlots}>No available slots</Text>
          ) : (
            daySlots.map((sl) => {
              const isSel = sl.id === selectedSlot;
              return (
                <TouchableOpacity
                  key={sl.id}
                  style={[s.slotBtn, isSel && s.slotBtnSel]}
                  onPress={() => setSelectedSlot(sl.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.slotText, isSel && s.slotTextSel]}>{sl.label}</Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
        {selectedSlot && (
          <PrimaryButton title="Confirm Reschedule" onPress={handleReschedule} style={{ marginTop: spacing.md }} />
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
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metaText: {
    fontSize: font.caption,
    color: colors.textSecondary,
    marginLeft: 5,
    fontWeight: '500',
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

  /* Reschedule bottom sheet */
  sheetSub: {
    fontSize: font.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  dayBtn: {
    width: 52,
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  dayBtnSel: {
    backgroundColor: colors.primary,
    ...shadow.fab,
  },
  dayName: { fontSize: font.xs, color: colors.textSecondary, fontWeight: '500' },
  dayNum: { fontSize: font.lg, fontWeight: '600', color: colors.text, marginTop: 2 },
  dayTextSel: { color: colors.white },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  slotBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  slotBtnSel: {
    backgroundColor: colors.primary,
    ...shadow.fab,
  },
  slotText: { fontSize: font.caption, fontWeight: '500', color: colors.text },
  slotTextSel: { color: colors.white },
  noSlots: { fontSize: font.caption, color: colors.textMuted, padding: spacing.md },
});
