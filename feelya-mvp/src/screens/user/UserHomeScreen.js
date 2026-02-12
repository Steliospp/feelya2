import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { Button, Card, Avatar, StarRating, Divider, SafetyBanner } from '../../components/UI';
import { useApp } from '../../store/AppContext';

export default function UserHomeScreen({ navigation }) {
  const { state } = useApp();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <Text style={styles.greeting}>
          Hey, {state.userName || 'there'} {'\u{1F44B}'}
        </Text>
        <Text style={styles.tagline}>
          Need someone to talk to? We've got you.
        </Text>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('TopicSelect')}
        >
          <Text style={styles.ctaTitle}>Start a new session</Text>
          <Text style={styles.ctaDesc}>
            Pick topics, choose your mode, and connect with a peer guide in minutes.
          </Text>
          <View style={styles.ctaArrow}>
            <Text style={styles.ctaArrowText}>{'\u2192'}</Text>
          </View>
        </TouchableOpacity>

        <SafetyBanner compact />

        {/* Session History */}
        <Text style={styles.sectionTitle}>
          Past sessions ({state.userSessions.length})
        </Text>

        {state.userSessions.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>
              No sessions yet. Start your first one above!
            </Text>
          </Card>
        ) : (
          state.userSessions.map((s) => (
            <Card key={s.id} style={{ marginBottom: spacing.sm }}>
              <View style={styles.sessionRow}>
                <Avatar name={s.guideName} size={40} />
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionGuide}>{s.guideName}</Text>
                  <Text style={styles.sessionMeta}>
                    {s.topics.slice(0, 2).join(', ')}
                    {s.topics.length > 2 ? ` +${s.topics.length - 2}` : ''}
                  </Text>
                </View>
                <View style={styles.sessionRight}>
                  <Text style={styles.sessionCost}>${s.total.toFixed(2)}</Text>
                  <Text style={styles.sessionDur}>{s.minutes}m</Text>
                </View>
              </View>
              {s.rating && (
                <>
                  <Divider />
                  <View style={styles.ratingRow}>
                    <StarRating rating={s.rating} size={14} />
                    {s.note ? (
                      <Text style={styles.ratingNote} numberOfLines={1}>
                        {s.note}
                      </Text>
                    ) : null}
                  </View>
                </>
              )}
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

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => navigation.navigate('TopicSelect')}
        >
          <Text style={styles.tabIcon}>{'\u{1F50D}'}</Text>
          <Text style={styles.tabLabel}>Find Guide</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, styles.tabActive]}>
          <Text style={styles.tabIcon}>{'\u{1F3E0}'}</Text>
          <Text style={[styles.tabLabel, { color: colors.primary }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.tabIcon}>{'\u2699\uFE0F'}</Text>
          <Text style={styles.tabLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    padding: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: 100,
  },
  greeting: {
    fontSize: font.xxl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  tagline: {
    fontSize: font.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  ctaCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  ctaTitle: {
    fontSize: font.xl,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  ctaDesc: {
    fontSize: font.sm,
    color: colors.white + 'CC',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  ctaArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white + '22',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  ctaArrowText: { color: colors.white, fontSize: 20, fontWeight: '700' },
  sectionTitle: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: font.sm,
    textAlign: 'center',
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionInfo: { flex: 1, marginLeft: spacing.md },
  sessionGuide: { fontSize: font.md, fontWeight: '700', color: colors.text },
  sessionMeta: { fontSize: font.xs, color: colors.textSecondary, marginTop: 2 },
  sessionRight: { alignItems: 'flex-end' },
  sessionCost: { fontSize: font.md, fontWeight: '700', color: colors.text },
  sessionDur: { fontSize: font.xs, color: colors.textMuted, marginTop: 2 },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNote: {
    fontSize: font.xs,
    color: colors.textMuted,
    marginLeft: spacing.sm,
    flex: 1,
  },
  sessionDate: {
    fontSize: font.xs,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  tabActive: {},
  tabIcon: { fontSize: 20 },
  tabLabel: {
    fontSize: font.xs,
    color: colors.textMuted,
    marginTop: 4,
  },
});
