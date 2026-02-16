import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import { Screen, Header, SearchBar, BottomSheet, PrimaryButton } from '../../components/UI';
import { MOCK_PROVIDERS, generateAvailability } from '../../store/AppContext';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'licensed', label: 'Licensed' },
  { id: 'guide', label: 'Guides' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ScheduleSessionScreen({ navigation, route }) {
  const { selectedTopics = [], supportType = 'all' } = route.params || {};
  const [filter, setFilter] = useState(supportType === 'all' ? 'all' : supportType);
  const [search, setSearch] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const providers = useMemo(() => {
    let list = [...MOCK_PROVIDERS];
    if (filter !== 'all') list = list.filter((p) => p.type === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.topics.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [filter, search]);

  const slots = selectedProvider ? generateAvailability(selectedProvider.id) : [];
  const dates = [...new Set(slots.map((sl) => sl.date))];
  const dateSlots = selectedDate ? slots.filter((sl) => sl.date === selectedDate) : [];

  const handleBook = () => {
    if (!selectedSlot || !selectedProvider) return;
    const providerName = selectedProvider.name;
    const dateStr = formatDate(selectedSlot.date);
    const timeStr = selectedSlot.label;
    setSelectedProvider(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    Alert.alert(
      'Session booked',
      `Your session with ${providerName} is confirmed for ${dateStr} at ${timeStr}.`,
      [{ text: 'OK', onPress: () => navigation.navigate('HomeMain') }],
    );
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00');
    const day = DAYS[d.getDay()];
    return `${day}, ${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  };

  return (
    <Screen>
      <Header title="Schedule a session" onBack={() => navigation.goBack()} />

      <View style={s.searchWrap}>
        <SearchBar placeholder="Search by name or topic..." value={search} onChangeText={setSearch} />
      </View>

      {/* Filter chips */}
      <View style={s.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[s.filterChip, filter === f.id && s.filterChipActive]}
            onPress={() => setFilter(f.id)}
          >
            <Text style={[s.filterText, filter === f.id && s.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {providers.length === 0 ? (
          <View style={s.emptyWrap}>
            <Text style={s.emptyText}>No providers found</Text>
          </View>
        ) : (
          providers.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={s.card}
              onPress={() => {
                setSelectedProvider(p);
                setSelectedDate(null);
                setSelectedSlot(null);
              }}
              activeOpacity={0.85}
            >
              <View style={s.cardTop}>
                <View style={s.avatarWrap}>
                  <Image source={{ uri: p.avatar }} style={s.avatarImg} />
                  {p.online && <View style={s.onlineDot} />}
                </View>
                <View style={s.cardInfo}>
                  <Text style={s.cardName}>{p.name}</Text>
                  <Text style={s.cardTitle}>{p.title}</Text>
                  <View style={s.ratingRow}>
                    <Ionicons name="star" size={12} color={colors.warning} />
                    <Text style={s.ratingText}>{p.rating}</Text>
                    <Text style={s.reviewCount}>({p.reviews})</Text>
                    {p.online ? (
                      <Text style={s.onlineLabel}>Online</Text>
                    ) : (
                      <Text style={s.offlineLabel}>{p.lastActive}</Text>
                    )}
                  </View>
                </View>
                <View style={s.priceCol}>
                  <Text style={s.priceAmount}>${p.pricePerSession}</Text>
                  <Text style={s.pricePer}>/ session</Text>
                </View>
              </View>
              <View style={s.topicRow}>
                {p.topics.slice(0, 4).map((t) => (
                  <View
                    key={t}
                    style={[
                      s.topicPill,
                      selectedTopics.includes(t) && s.topicPillMatch,
                    ]}
                  >
                    <Text
                      style={[
                        s.topicText,
                        selectedTopics.includes(t) && s.topicTextMatch,
                      ]}
                    >
                      {t}
                    </Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={s.scheduleBtn} onPress={() => {
                setSelectedProvider(p);
                setSelectedDate(null);
                setSelectedSlot(null);
              }}>
                <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                <Text style={s.scheduleBtnText}>View availability</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Scheduling Bottom Sheet */}
      <BottomSheet
        visible={!!selectedProvider}
        onClose={() => setSelectedProvider(null)}
        title={selectedProvider ? `Book with ${selectedProvider.name}` : ''}
      >
        {selectedProvider && (
          <View>
            {/* Date selector */}
            <Text style={s.sheetLabel}>Pick a date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.dateRow}>
              {dates.map((d) => {
                const active = selectedDate === d;
                return (
                  <TouchableOpacity
                    key={d}
                    style={[s.dateBtn, active && s.dateBtnActive]}
                    onPress={() => { setSelectedDate(d); setSelectedSlot(null); }}
                  >
                    <Text style={[s.dateBtnDay, active && s.dateBtnDayActive]}>
                      {DAYS[new Date(d + 'T12:00:00').getDay()]}
                    </Text>
                    <Text style={[s.dateBtnNum, active && s.dateBtnNumActive]}>
                      {new Date(d + 'T12:00:00').getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Time slots */}
            {selectedDate && (
              <>
                <Text style={[s.sheetLabel, { marginTop: spacing.md }]}>Pick a time</Text>
                <View style={s.slotGrid}>
                  {dateSlots.map((sl) => {
                    const active = selectedSlot?.label === sl.label && selectedSlot?.date === sl.date;
                    return (
                      <TouchableOpacity
                        key={sl.label}
                        style={[s.slotBtn, active && s.slotBtnActive]}
                        onPress={() => setSelectedSlot(sl)}
                      >
                        <Text style={[s.slotText, active && s.slotTextActive]}>{sl.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            {selectedSlot && (
              <PrimaryButton
                title={`Book ${formatDate(selectedSlot.date)} at ${selectedSlot.label}`}
                onPress={handleBook}
                style={{ marginTop: spacing.lg }}
              />
            )}
          </View>
        )}
      </BottomSheet>
    </Screen>
  );
}

const s = StyleSheet.create({
  searchWrap: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceLight,
    marginRight: spacing.sm,
  },
  filterChipActive: { backgroundColor: colors.primary },
  filterText: { fontSize: font.caption, fontWeight: '600', color: colors.textSecondary },
  filterTextActive: { color: colors.white },
  list: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 100,
  },
  /* Card */
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  cardTop: { flexDirection: 'row', marginBottom: spacing.sm },
  avatarWrap: { position: 'relative' },
  avatarImg: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surfaceLight },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: colors.success, borderWidth: 2.5, borderColor: colors.surface,
  },
  cardInfo: { flex: 1, marginLeft: spacing.md },
  cardName: { fontSize: font.body, fontWeight: '600', color: colors.text },
  cardTitle: { fontSize: font.xs, color: colors.textSecondary, marginTop: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  ratingText: { fontSize: font.xs, fontWeight: '600', color: colors.text, marginLeft: 3 },
  reviewCount: { fontSize: font.xs, color: colors.textMuted, marginLeft: 2 },
  onlineLabel: { fontSize: font.xs, color: colors.success, fontWeight: '500', marginLeft: 'auto' },
  offlineLabel: { fontSize: font.xs, color: colors.textMuted, marginLeft: 'auto' },
  priceCol: { alignItems: 'flex-end' },
  priceAmount: { fontSize: font.lg, fontWeight: '700', color: colors.text },
  pricePer: { fontSize: font.xs, color: colors.textMuted },
  topicRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  topicPill: {
    backgroundColor: colors.surfaceLight, borderRadius: radius.full,
    paddingHorizontal: 8, paddingVertical: 3, marginRight: 6, marginBottom: 4,
  },
  topicPillMatch: { backgroundColor: colors.primaryLight },
  topicText: { fontSize: font.xs, color: colors.textSecondary },
  topicTextMatch: { color: colors.primary, fontWeight: '500' },
  scheduleBtn: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight, borderRadius: radius.full,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  scheduleBtnText: { fontSize: font.caption, fontWeight: '600', color: colors.primary, marginLeft: 6 },
  emptyWrap: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { fontSize: font.body, color: colors.textMuted },
  /* Bottom sheet */
  sheetLabel: { fontSize: font.section, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  dateRow: { marginBottom: spacing.sm },
  dateBtn: {
    width: 52, height: 64, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surfaceLight, marginRight: spacing.sm,
  },
  dateBtnActive: { backgroundColor: colors.primary },
  dateBtnDay: { fontSize: font.xs, color: colors.textSecondary, marginBottom: 2 },
  dateBtnDayActive: { color: colors.white },
  dateBtnNum: { fontSize: font.lg, fontWeight: '600', color: colors.text },
  dateBtnNumActive: { color: colors.white },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  slotBtn: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.full,
    backgroundColor: colors.surfaceLight, marginRight: spacing.sm, marginBottom: spacing.sm,
  },
  slotBtnActive: { backgroundColor: colors.primary },
  slotText: { fontSize: font.caption, fontWeight: '500', color: colors.text },
  slotTextActive: { color: colors.white, fontWeight: '600' },
});
