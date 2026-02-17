import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import {
  Screen, Header, PrimaryButton, SecondaryButton, Card,
  Pill, Divider, Badge, Avatar, BottomSheet, SectionTitle,
} from '../../components/UI';
import { useApp, MOCK_GUIDES, MOCK_PROVIDERS, generateAvailability } from '../../store/AppContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MOCK_REVIEWS = [
  { id: 'r1', author: 'Alex M.', rating: 5, date: '2 weeks ago', text: 'Really helped me work through my anxiety about starting a new job. Felt heard and understood the whole time.' },
  { id: 'r2', author: 'Jamie T.', rating: 5, date: '3 weeks ago', text: 'So easy to talk to. Gave me practical advice I could actually use, not just generic stuff.' },
  { id: 'r3', author: 'Morgan L.', rating: 4, date: '1 month ago', text: 'Great listener and very patient. Would definitely book again.' },
  { id: 'r4', author: 'Taylor R.', rating: 5, date: '1 month ago', text: 'This was my first time trying something like this and they made me feel completely comfortable. Highly recommend.' },
  { id: 'r5', author: 'Casey W.', rating: 4, date: '2 months ago', text: 'Helpful conversation about relationship issues. Gave me a new perspective I hadn\'t considered.' },
  { id: 'r6', author: 'Riley K.', rating: 5, date: '2 months ago', text: 'Talked about career stuff and they really got where I was coming from. Left feeling motivated.' },
];

export default function GuideProfileScreen({ navigation, route }) {
  const { dispatch } = useApp();
  const {
    guideId,
    bookingId,
    mode: initialMode,
    autoOpenAvailability,
    preselectedMode,
  } = route.params || {};
  const guide = MOCK_GUIDES.find((g) => g.id === guideId)
    || MOCK_PROVIDERS.find((p) => p.id === guideId);

  const slots = generateAvailability(guideId);
  const dates = [...new Set(slots.map((s) => s.date))];

  const scrollRef = useRef(null);
  const availabilityY = useRef(0);

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBooking, setShowBooking] = useState(!!initialMode);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMode, setSelectedMode] = useState(preselectedMode || 'chat');
  const [showReviews, setShowReviews] = useState(false);

  /* Auto-scroll to Availability when coming from Reschedule */
  useEffect(() => {
    if (autoOpenAvailability && scrollRef.current) {
      const timer = setTimeout(() => {
        scrollRef.current.scrollTo({ y: availabilityY.current, animated: true });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [autoOpenAvailability]);

  if (!guide) {
    return (
      <Screen>
        <Header title="Guide" onBack={() => navigation.goBack()} />
        <View style={s.empty}>
          <Text style={s.emptyText}>Guide not found</Text>
        </View>
      </Screen>
    );
  }

  const daySlots = slots.filter((sl) => sl.date === selectedDate);

  const handleBook = () => {
    if (!selectedSlot) return;
    setShowConfirm(true);
  };

  const confirmBooking = () => {
    const slot = slots.find((sl) => sl.id === selectedSlot);
    if (!slot) return;
    const price = guide.ratePerMin
      ? +(30 * guide.ratePerMin).toFixed(2)
      : guide.pricePerSession || 0;

    if (bookingId) {
      dispatch({
        type: 'RESCHEDULE_BOOKING',
        payload: { bookingId, date: slot.date, hour: slot.hour, timeLabel: slot.label },
      });
    } else {
      dispatch({
        type: 'ADD_BOOKING',
        payload: {
          id: 'b_' + Date.now(),
          guideId: guide.id,
          guideName: guide.name,
          date: slot.date,
          hour: slot.hour,
          timeLabel: slot.label,
          mode: selectedMode,
          duration: 30,
          price,
          status: 'upcoming',
          topics: guide.topics.slice(0, 2),
        },
      });

    }

    setShowConfirm(false);
    setShowBooking(false);
    Alert.alert(
      bookingId ? 'Rescheduled' : 'Confirmed',
      `Chat with ${guide.name} on ${formatDate(slot.date)} at ${slot.label}`,
      [{ text: 'OK', onPress: () => navigation.navigate('Chats', { screen: 'ChatsMain' }) }]
    );
  };

  return (
    <Screen>
      <Header title={guide.name} onBack={() => navigation.goBack()} />
      <ScrollView ref={scrollRef} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={s.profile}>
          <Avatar name={guide.name} size={72} />
          <Text style={s.name}>{guide.name}</Text>
          <View style={s.ratingRow}>
            <Ionicons name="star" size={16} color={colors.warning} />
            <Text style={s.ratingText}>{guide.rating} ({guide.conversations || guide.reviews} conversations)</Text>
          </View>
        </View>

        {/* Bio */}
        <Card style={s.bioCard}>
          <Text style={s.bio}>{guide.bio}</Text>
        </Card>

        {/* Action buttons — separated intents */}
        <View style={s.actionsRow}>
          <PrimaryButton
            title="Chat again"
            icon="chatbubble-outline"
            onPress={() => setShowBooking(true)}
            style={{ flex: 1, marginRight: spacing.sm }}
          />
          <SecondaryButton
            title="Reviews"
            variant="soft"
            icon="star-outline"
            onPress={() => setShowReviews(true)}
            style={{ flex: 1 }}
          />
        </View>

        {/* Topics */}
        <SectionTitle>Topics</SectionTitle>
        <View style={s.pills}>
          {guide.topics.map((t) => (
            <Pill key={t} label={t} />
          ))}
        </View>

        {/* Badges */}
        <View style={s.badgeRow}>
          {guide.badges.map((b) => (
            <Badge key={b} label={b} icon="ribbon-outline" />
          ))}
          {guide.verified && <Badge label="Verified" color={colors.success} icon="checkmark-circle-outline" />}
        </View>

        <Divider />

        {/* Inline availability (always visible for profile context) */}
        <View onLayout={(e) => { availabilityY.current = e.nativeEvent.layout.y; }}>
          <SectionTitle>{bookingId ? 'Pick a new time' : 'Availability'}</SectionTitle>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.weekStrip}>
          {dates.map((d) => {
            const dt = new Date(d + 'T12:00:00');
            const isSelected = d === selectedDate;
            return (
              <TouchableOpacity
                key={d}
                style={[s.dayBtn, isSelected && s.dayBtnSelected]}
                onPress={() => { setSelectedDate(d); setSelectedSlot(null); }}
                activeOpacity={0.7}
              >
                <Text style={[s.dayName, isSelected && s.dayTextSelected]}>
                  {DAYS[dt.getDay()]}
                </Text>
                <Text style={[s.dayNum, isSelected && s.dayTextSelected]}>
                  {dt.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={s.slotsGrid}>
          {daySlots.length === 0 ? (
            <Text style={s.noSlots}>No available slots</Text>
          ) : (
            daySlots.map((sl) => {
              const isSelected = sl.id === selectedSlot;
              return (
                <TouchableOpacity
                  key={sl.id}
                  style={[s.slotBtn, isSelected && s.slotBtnSelected]}
                  onPress={() => setSelectedSlot(sl.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.slotText, isSelected && s.slotTextSelected]}>
                    {sl.label}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={{ height: 8 }} />
      </ScrollView>

      {/* Footer for when a slot is selected */}
      {selectedSlot && !showBooking && (
        <View style={s.footer}>
          <PrimaryButton
            title={bookingId ? 'Reschedule to this time' : 'Plan a chat'}
            onPress={() => setShowBooking(true)}
          />
        </View>
      )}

      {/* Booking confirmation bottom sheet */}
      <BottomSheet visible={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Chat">
        <View style={s.confirmRow}>
          <Avatar name={guide.name} size={40} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={s.confirmName}>{guide.name}</Text>
            <Text style={s.confirmDate}>
              {selectedSlot && formatDate(slots.find((sl) => sl.id === selectedSlot)?.date)}{' '}
              at {slots.find((sl) => sl.id === selectedSlot)?.label}
            </Text>
          </View>
        </View>

        <Text style={s.confirmLabel}>Mode</Text>
        <View style={s.modePills}>
          {['chat', 'voice', 'video'].map((m) => (
            <Pill key={m} label={m.charAt(0).toUpperCase() + m.slice(1)} selected={selectedMode === m} onPress={() => setSelectedMode(m)} />
          ))}
        </View>

        <View style={s.confirmDetails}>
          <View style={s.confirmDetailRow}>
            <Text style={s.confirmDetailLabel}>Duration</Text>
            <Text style={s.confirmDetailValue}>30 min</Text>
          </View>
          {guide.ratePerMin ? (
            <>
              <View style={s.confirmDetailRow}>
                <Text style={s.confirmDetailLabel}>Rate</Text>
                <Text style={s.confirmDetailValue}>${guide.ratePerMin.toFixed(2)}/min</Text>
              </View>
              <View style={s.confirmDetailRow}>
                <Text style={s.confirmDetailLabel}>Estimated total</Text>
                <Text style={[s.confirmDetailValue, { fontWeight: '700' }]}>
                  ${(30 * guide.ratePerMin).toFixed(2)}
                </Text>
              </View>
            </>
          ) : (
            <View style={s.confirmDetailRow}>
              <Text style={s.confirmDetailLabel}>Session price</Text>
              <Text style={[s.confirmDetailValue, { fontWeight: '700' }]}>
                ${guide.pricePerSession || 0}
              </Text>
            </View>
          )}
        </View>

        <PrimaryButton title="Confirm" onPress={confirmBooking} style={{ marginTop: spacing.md }} />
      </BottomSheet>

      {/* Chat scheduling bottom sheet */}
      <BottomSheet visible={showBooking && !showConfirm} onClose={() => setShowBooking(false)} title="Plan a chat">
        <Text style={s.bookingSubtitle}>Pick a time to chat with {guide.name}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
          {dates.map((d) => {
            const dt = new Date(d + 'T12:00:00');
            const isSelected = d === selectedDate;
            return (
              <TouchableOpacity
                key={d}
                style={[s.dayBtn, isSelected && s.dayBtnSelected]}
                onPress={() => { setSelectedDate(d); setSelectedSlot(null); }}
                activeOpacity={0.7}
              >
                <Text style={[s.dayName, isSelected && s.dayTextSelected]}>{DAYS[dt.getDay()]}</Text>
                <Text style={[s.dayNum, isSelected && s.dayTextSelected]}>{dt.getDate()}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={s.slotsGrid}>
          {daySlots.length === 0 ? (
            <Text style={s.noSlots}>No available slots</Text>
          ) : (
            daySlots.map((sl) => {
              const isSelected = sl.id === selectedSlot;
              return (
                <TouchableOpacity
                  key={sl.id}
                  style={[s.slotBtn, isSelected && s.slotBtnSelected]}
                  onPress={() => setSelectedSlot(sl.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.slotText, isSelected && s.slotTextSelected]}>{sl.label}</Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
        {selectedSlot && (
          <PrimaryButton title={bookingId ? 'Reschedule' : 'Continue'} onPress={handleBook} style={{ marginTop: spacing.md }} />
        )}
      </BottomSheet>

      {/* Reviews bottom sheet */}
      <BottomSheet visible={showReviews} onClose={() => setShowReviews(false)} title="Reviews">
        <View style={s.reviewSummary}>
          <Ionicons name="star" size={20} color={colors.warning} />
          <Text style={s.reviewRating}>{guide.rating}</Text>
          <Text style={s.reviewCount}>({guide.conversations || guide.reviews} reviews)</Text>
        </View>
        <ScrollView style={s.reviewScroll} showsVerticalScrollIndicator={false}>
          {MOCK_REVIEWS.map((r) => (
            <View key={r.id} style={s.reviewCard}>
              <View style={s.reviewHeader}>
                <Avatar name={r.author} size={32} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={s.reviewAuthor}>{r.author}</Text>
                  <Text style={s.reviewDate}>{r.date}</Text>
                </View>
                <View style={s.reviewStars}>
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Ionicons key={i} name="star" size={12} color={colors.warning} />
                  ))}
                </View>
              </View>
              <Text style={s.reviewText}>{r.text}</Text>
            </View>
          ))}
        </ScrollView>
      </BottomSheet>
    </Screen>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

const s = StyleSheet.create({
  scroll: { padding: spacing.screenPadding, paddingBottom: 80 },
  profile: { alignItems: 'center', marginBottom: spacing.lg },
  name: { fontSize: font.xl, fontWeight: '700', color: colors.text, marginTop: spacing.md },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  ratingText: { fontSize: font.caption, color: colors.textSecondary, marginLeft: 4 },
  bioCard: { marginBottom: spacing.md },
  bio: { fontSize: font.body, color: colors.textSecondary, lineHeight: 22 },

  actionsRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },

  pills: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  weekStrip: { marginBottom: spacing.md },
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
  dayBtnSelected: {
    backgroundColor: colors.primary,
    ...shadow.fab,
  },
  dayName: { fontSize: font.xs, color: colors.textSecondary, fontWeight: '500' },
  dayNum: { fontSize: font.lg, fontWeight: '600', color: colors.text, marginTop: 2 },
  dayTextSelected: { color: colors.white },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.xs },
  slotBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  slotBtnSelected: {
    backgroundColor: colors.primary,
    ...shadow.fab,
  },
  slotText: { fontSize: font.caption, fontWeight: '500', color: colors.text },
  slotTextSelected: { color: colors.white },
  noSlots: { fontSize: font.caption, color: colors.textMuted, padding: spacing.md },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.bg,
    ...shadow.tab,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: font.body, color: colors.textMuted },
  confirmRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  confirmName: { fontSize: font.body, fontWeight: '600', color: colors.text },
  confirmDate: { fontSize: font.caption, color: colors.textSecondary, marginTop: 2 },
  confirmLabel: { fontSize: font.caption, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.sm, marginTop: spacing.sm },
  modePills: { flexDirection: 'row', marginBottom: spacing.sm },
  confirmDetails: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.cardPadding,
    marginTop: spacing.sm,
  },
  confirmDetailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  confirmDetailLabel: { fontSize: font.caption, color: colors.textSecondary },
  confirmDetailValue: { fontSize: font.caption, fontWeight: '600', color: colors.text },
  bookingSubtitle: { fontSize: font.body, color: colors.textSecondary, marginBottom: spacing.md },
  reviewSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  reviewRating: { fontSize: font.xl, fontWeight: '700', color: colors.text, marginLeft: 6 },
  reviewCount: { fontSize: font.caption, color: colors.textSecondary, marginLeft: 6 },
  reviewScroll: { maxHeight: 360 },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.cardPadding,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  reviewAuthor: { fontSize: font.body, fontWeight: '600', color: colors.text },
  reviewDate: { fontSize: font.xs, color: colors.textMuted, marginTop: 1 },
  reviewStars: { flexDirection: 'row' },
  reviewText: { fontSize: font.caption, color: colors.textSecondary, lineHeight: 20 },
});
