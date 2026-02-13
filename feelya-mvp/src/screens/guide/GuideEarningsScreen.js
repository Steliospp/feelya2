import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font } from '../../theme';
import { Screen, Header, Card, Avatar, EmptyState } from '../../components/UI';
import { useApp } from '../../store/AppContext';

export default function GuideEarningsScreen({ navigation }) {
  const { state } = useApp();

  return (
    <Screen>
      <Header title="Earnings" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Total earnings card */}
        <Card style={styles.totalCard}>
          <Ionicons name="wallet-outline" size={28} color={colors.success} style={{ marginBottom: spacing.sm }} />
          <Text style={styles.totalLabel}>Total Earned</Text>
          <Text style={styles.totalValue}>${state.guideEarnings.toFixed(2)}</Text>
          <Text style={styles.totalSessions}>
            from {state.guideSessions.length} session
            {state.guideSessions.length !== 1 ? 's' : ''}
          </Text>
        </Card>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Ionicons name="pricetag-outline" size={16} color={colors.accent} style={{ marginBottom: spacing.xs }} />
            <Text style={styles.statValue}>${state.guideRate.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Rate/min</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="time-outline" size={16} color={colors.accent} style={{ marginBottom: spacing.xs }} />
            <Text style={styles.statValue}>
              {state.guideSessions.reduce((sum, s) => sum + s.minutes, 0)}
            </Text>
            <Text style={styles.statLabel}>Total mins</Text>
          </Card>
        </View>

        {/* Section title */}
        <Text style={styles.sectionTitle}>Past Sessions</Text>

        {state.guideSessions.length === 0 ? (
          <EmptyState
            icon="chatbubbles-outline"
            title="No sessions yet"
            subtitle="Go online to receive requests!"
          />
        ) : (
          state.guideSessions.map((s) => (
            <Card key={s.id} style={{ marginBottom: spacing.sm }}>
              <View style={styles.sessionRow}>
                <Avatar name={s.userName} size={40} />
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionName}>{s.userName}</Text>
                  <Text style={styles.sessionMeta}>
                    {s.topics.join(', ')} -- {s.mode}
                  </Text>
                </View>
                <View style={styles.sessionRight}>
                  <Text style={styles.sessionEarned}>+${s.earned.toFixed(2)}</Text>
                  <Text style={styles.sessionDur}>{s.minutes}m</Text>
                </View>
              </View>
              <Text style={styles.sessionDate}>
                {new Date(s.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </Card>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  totalCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceLight,
  },
  totalLabel: { fontSize: font.caption, color: colors.textMuted },
  totalValue: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.success,
    marginVertical: spacing.sm,
  },
  totalSessions: { fontSize: font.caption, color: colors.textSecondary },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statValue: { fontSize: font.xl, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: font.xs, color: colors.textMuted, marginTop: 4 },
  sectionTitle: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  sessionRow: { flexDirection: 'row', alignItems: 'center' },
  sessionInfo: { flex: 1, marginLeft: spacing.md },
  sessionName: { fontSize: font.body, fontWeight: '700', color: colors.text },
  sessionMeta: { fontSize: font.xs, color: colors.textSecondary, marginTop: 2 },
  sessionRight: { alignItems: 'flex-end' },
  sessionEarned: { fontSize: font.body, fontWeight: '700', color: colors.success },
  sessionDur: { fontSize: font.xs, color: colors.textMuted, marginTop: 2 },
  sessionDate: { fontSize: font.xs, color: colors.textMuted, marginTop: spacing.sm },
});
