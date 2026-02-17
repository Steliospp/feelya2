import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../../theme';
import {
  Screen, Header, PrimaryButton, SecondaryButton, Card,
  Avatar, Badge, Divider, BottomSheet, Pill,
} from '../../../components/UI';
import { useApp, MOCK_GUIDES, MOCK_PROVIDERS, generateAvailability } from '../../../store/AppContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CANCEL_REASONS = [
  'Schedule conflict',
  'Found another guide',
  'Changed my mind',
  'Other reason',
];

export default function BookingDetailScreen({ navigation, route }) {
  const { state, dispatch } = useApp();
  const { bookingId } = route.params || {};
  const booking = state.bookings.find((b) => b.id === bookingId);
  const guide = MOCK_GUIDES.find((g) => g.id === booking?.guideId)
    || MOCK_PROVIDERS.find((p) => p.id === booking?.guideId);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showReschedule, setShowReschedule] = useState(false);

  const slots = booking ? generateAvailability(booking.guideId) : [];
  const dates = [...new Set(slots.map((sl) => sl.date))];
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const daySlots = slots.filter((sl) => sl.date === selectedDate);

  if (!booking) {
    return (
      <Screen>
        <Header title="Chat Details" onBack={() => navigation.goBack()} />
        <View style={s.empty}>
          <Text style={s.emptyText}>Conversation not found</Text>
        </View>
      </Screen>
    );
  }

  const isUpcoming = booking.status === 'upcoming';
  const modeIcon = booking.mode === 'chat' ? 'chatbubble-outline' : booking.mode === 'voice' ? 'mic-outline' : 'videocam-outline';
  const statusColor = booking.status === 'upcoming' ? colors.primary : booking.status === 'completed' ? colors.textSecondary : colors.danger;

  const handleCancel = () => {
    dispatch({ type: 'CANCEL_BOOKING', payload: bookingId });
    setShowCancel(false);
    Alert.alert('Cancelled', 'Your booking has been cancelled.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleReschedule = () => {
    if (!selectedSlot) return;
    const slot = slots.find((sl) => sl.id === selectedSlot);
    if (!slot) return;
    dispatch({
      type: 'RESCHEDULE_BOOKING',
      payload: { bookingId, date: slot.date, hour: slot.hour, timeLabel: slot.label },
    });
    setShowReschedule(false);
    Alert.alert('Rescheduled', `Chat moved to ${formatDate(slot.date)} at ${slot.label}`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <Screen>
      <Header title="Chat Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.guideSection}>
          <Avatar name={booking.guideName} size={64} />
          <Text style={s.guideName}>{booking.guideName}</Text>
          {guide && (
            <View style={s.ratingRow}>
              <Ionicons name="star" size={14} color={colors.warning} />
              <Text style={s.ratingText}>{guide.rating} ({guide.conversations || guide.reviews} conversations)</Text>
            </View>
          )}
        </View>

        <Card style={s.detailCard}>
          <DetailRow label="Date" value={formatDate(booking.date)} />
          <Divider />
          <DetailRow label="Time" value={booking.timeLabel} />
          <Divider />
          <DetailRow label="Mode" value={booking.mode.charAt(0).toUpperCase() + booking.mode.slice(1)} icon={modeIcon} />
          <Divider />
          <DetailRow label="Duration" value={`${booking.duration} min`} />
          <Divider />
          <DetailRow label="Topics" value={booking.topics.join(', ')} />
          <Divider />
          <View style={s.detailRow}>
            <Text style={s.detailLabel}>Status</Text>
            <Badge label={booking.status} color={statusColor} />
          </View>
        </Card>

        <Card style={s.priceCard}>
          <Text style={s.priceLabel}>Total</Text>
          <Text style={s.priceValue}>${booking.price.toFixed(2)}</Text>
        </Card>

        {isUpcoming && (
          <View style={s.actions}>
            <PrimaryButton
              title="Reschedule"
              icon="calendar-outline"
              onPress={() => {
                setSelectedSlot(null);
                setSelectedDate(dates[0]);
                setShowReschedule(true);
              }}
            />
            <SecondaryButton
              title="Cancel Booking"
              variant="danger"
              icon="close-circle-outline"
              onPress={() => setShowCancel(true)}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        )}

        {booking.status === 'completed' && (
          <View style={s.actions}>
            <PrimaryButton
              title="Chat again"
              icon="chatbubble-outline"
              onPress={() =>
                navigation.navigate('GuideProfileChats', { guideId: booking.guideId, mode: 'booking' })
              }
            />
          </View>
        )}

        <SecondaryButton
          title="View profile"
          variant="soft"
          icon="person-outline"
          onPress={() =>
            navigation.navigate('GuideProfileChats', { guideId: booking.guideId })
          }
          style={{ marginTop: spacing.sm }}
        />
      </ScrollView>

      <BottomSheet visible={showCancel} onClose={() => setShowCancel(false)} title="Cancel Chat">
        <Text style={s.cancelSubtitle}>Why are you cancelling?</Text>
        <View style={s.reasonPills}>
          {CANCEL_REASONS.map((r) => (
            <Pill key={r} label={r} selected={cancelReason === r} onPress={() => setCancelReason(r)} />
          ))}
        </View>
        <SecondaryButton
          title="Confirm Cancellation"
          variant="danger"
          onPress={handleCancel}
          disabled={!cancelReason}
          style={{ marginTop: spacing.md }}
        />
      </BottomSheet>

      <BottomSheet visible={showReschedule} onClose={() => setShowReschedule(false)} title="Reschedule Chat">
        <Text style={s.cancelSubtitle}>Pick a new date & time</Text>
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
          <PrimaryButton title="Confirm Reschedule" onPress={handleReschedule} style={{ marginTop: spacing.md }} />
        )}
      </BottomSheet>
    </Screen>
  );
}

function DetailRow({ label, value, icon }) {
  return (
    <View style={s.detailRow}>
      <Text style={s.detailLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon && <Ionicons name={icon} size={16} color={colors.primary} style={{ marginRight: 4 }} />}
        <Text style={s.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

const s = StyleSheet.create({
  scroll: { padding: spacing.screenPadding, paddingBottom: spacing.xxl },
  guideSection: { alignItems: 'center', marginBottom: spacing.lg },
  guideName: { fontSize: font.xl, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  ratingText: { fontSize: font.caption, color: colors.textSecondary, marginLeft: 4 },
  detailCard: { marginBottom: spacing.md, ...shadow.card },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: font.caption, color: colors.textMuted },
  detailValue: { fontSize: font.body, fontWeight: '500', color: colors.text },
  priceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    backgroundColor: colors.primaryLight,
    ...shadow.card,
  },
  priceLabel: { fontSize: font.lg, fontWeight: '600', color: colors.text },
  priceValue: { fontSize: font.title, fontWeight: '700', color: colors.primary },
  actions: { marginBottom: spacing.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: font.body, color: colors.textMuted },
  cancelSubtitle: { fontSize: font.body, color: colors.textSecondary, marginBottom: spacing.md },
  reasonPills: { flexDirection: 'row', flexWrap: 'wrap' },
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
  slotBtnSelected: {
    backgroundColor: colors.primary,
    ...shadow.fab,
  },
  slotText: { fontSize: font.caption, fontWeight: '500', color: colors.text },
  slotTextSelected: { color: colors.white },
  noSlots: { fontSize: font.caption, color: colors.textMuted, padding: spacing.md },
});
