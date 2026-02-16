import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../../theme';
import {
  Screen, Card, Avatar, Badge, SectionTitle, EmptyState, Pill,
} from '../../../components/UI';
import { useApp } from '../../../store/AppContext';

export default function BookingsScreen({ navigation }) {
  const { state } = useApp();
  const upcoming = state.bookings.filter((b) => b.status === 'upcoming');
  const past = state.bookings.filter((b) => b.status !== 'upcoming');

  const modeIcon = (m) =>
    m === 'chat' ? 'chatbubble-outline' : m === 'voice' ? 'mic-outline' : 'videocam-outline';

  const statusColor = (st) =>
    st === 'upcoming' ? colors.primary : st === 'completed' ? colors.textSecondary : colors.danger;

  return (
    <Screen>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Chats</Text>

        {state.bookings.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="No bookings yet"
            subtitle="Start a conversation to connect with a guide"
          />
        ) : (
          <>
            {upcoming.length > 0 && (
              <>
                <SectionTitle>Upcoming</SectionTitle>
                {upcoming.map((b) => (
                  <Card
                    key={b.id}
                    style={s.card}
                    onPress={() => navigation.navigate('BookingDetail', { bookingId: b.id })}
                  >
                    <View style={s.row}>
                      <Avatar name={b.guideName} size={44} />
                      <View style={s.info}>
                        <Text style={s.name}>{b.guideName}</Text>
                        <Text style={s.dateText}>
                          {formatDate(b.date)} at {b.timeLabel}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                    </View>
                    <View style={s.metaRow}>
                      <View style={s.modePill}>
                        <Ionicons name={modeIcon(b.mode)} size={14} color={colors.primary} />
                        <Text style={s.modeText}>{b.mode}</Text>
                      </View>
                      <Text style={s.price}>${b.price.toFixed(2)}</Text>
                      <Badge label="Upcoming" color={colors.primary} />
                    </View>
                  </Card>
                ))}
              </>
            )}

            {past.length > 0 && (
              <>
                <SectionTitle style={{ marginTop: spacing.lg }}>Past</SectionTitle>
                {past.map((b) => (
                  <Card
                    key={b.id}
                    style={s.card}
                    onPress={() => navigation.navigate('BookingDetail', { bookingId: b.id })}
                  >
                    <View style={s.row}>
                      <Avatar name={b.guideName} size={44} />
                      <View style={s.info}>
                        <Text style={s.name}>{b.guideName}</Text>
                        <Text style={s.dateText}>
                          {formatDate(b.date)} at {b.timeLabel}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                    </View>
                    <View style={s.metaRow}>
                      <View style={s.modePill}>
                        <Ionicons name={modeIcon(b.mode)} size={14} color={colors.primary} />
                        <Text style={s.modeText}>{b.mode}</Text>
                      </View>
                      <Text style={s.price}>${b.price.toFixed(2)}</Text>
                      <Badge label={b.status} color={statusColor(b.status)} />
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
  scroll: { padding: spacing.screenPadding, paddingTop: spacing.xxl },
  title: { fontSize: font.title, fontWeight: '600', color: colors.text, marginBottom: spacing.lg },
  card: { marginBottom: spacing.sm, ...shadow.card },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: font.body, fontWeight: '600', color: colors.text },
  dateText: { fontSize: font.caption, color: colors.textSecondary, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm + 2 },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: spacing.sm,
  },
  modeText: { fontSize: font.xs, color: colors.primary, marginLeft: 4, fontWeight: '500' },
  price: { fontSize: font.caption, fontWeight: '600', color: colors.text, marginRight: spacing.sm, flex: 1 },
});
