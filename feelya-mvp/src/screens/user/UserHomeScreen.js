import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  Card,
  Avatar,
  Divider,
  SafetyBanner,
  EmptyState,
} from '../../components/UI';
import { colors, spacing, radius, font } from '../../theme';
import { useApp } from '../../store/AppContext';
import { MOCK_GUIDES } from '../../store/AppContext';

export default function UserHomeScreen({ navigation }) {
  const { state } = useApp();
  const lastGuide = state.lastGuideId
    ? MOCK_GUIDES.find((g) => g.id === state.lastGuideId)
    : null;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Text style={styles.greeting}>Hey, {state.userName || 'there'}</Text>
        <Text style={styles.tagline}>Need someone to talk to?</Text>

        {/* Primary CTA */}
        <TouchableOpacity
          style={styles.ctaCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('TopicSelect')}
        >
          <View style={styles.ctaTop}>
            <View style={styles.ctaTextBlock}>
              <Text style={styles.ctaTitle}>Start a session</Text>
              <Text style={styles.ctaDesc}>
                Pick topics, choose your mode, and connect with a peer guide in
                minutes.
              </Text>
            </View>
            <View style={styles.ctaArrow}>
              <Ionicons name="arrow-forward" size={20} color={colors.white} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Last Guide */}
        {lastGuide && (
          <Card style={styles.lastGuideCard}>
            <Text style={styles.lastGuideLabel}>Last Guide</Text>
            <View style={styles.lastGuideRow}>
              <Avatar name={lastGuide.name} size={48} />
              <View style={styles.lastGuideInfo}>
                <Text style={styles.lastGuideName}>{lastGuide.name}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons
                    name="star"
                    size={14}
                    color={colors.warning}
                    style={{ marginRight: 3 }}
                  />
                  <Text style={styles.ratingText}>
                    {lastGuide.rating.toFixed(1)}
                  </Text>
                  <Text style={styles.sessionCount}>
                    {' '}
                    -- {lastGuide.sessions} sessions
                  </Text>
                </View>
              </View>
            </View>
            <Divider style={{ marginVertical: spacing.md }} />
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() =>
                  navigation.navigate('GuideProfile', {
                    guideId: lastGuide.id,
                  })
                }
              >
                <Ionicons
                  name="refresh-outline"
                  size={18}
                  color={colors.text}
                />
                <Text style={styles.actionLabel}>Rebook</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() =>
                  navigation.navigate('GuideProfile', {
                    guideId: lastGuide.id,
                  })
                }
              >
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={colors.text}
                />
                <Text style={styles.actionLabel}>Availability</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() =>
                  Alert.alert(
                    'Messaging',
                    'Direct messaging is coming soon.'
                  )
                }
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={18}
                  color={colors.text}
                />
                <Text style={styles.actionLabel}>Message</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Safety Banner */}
        <SafetyBanner compact />

        {/* Recent Sessions */}
        <Text style={styles.sectionTitle}>
          Recent sessions ({state.userSessions.length})
        </Text>

        {state.userSessions.length === 0 ? (
          <EmptyState
            icon="chatbubbles-outline"
            title="No sessions yet"
            subtitle="Start your first session above to connect with a peer guide."
          />
        ) : (
          state.userSessions.map((s) => (
            <Card key={s.id} style={styles.sessionCard}>
              <View style={styles.sessionRow}>
                <Avatar name={s.guideName} size={40} />
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionGuide}>{s.guideName}</Text>
                  <Text style={styles.sessionTopics}>
                    {s.topics.slice(0, 2).join(', ')}
                    {s.topics.length > 2 ? ` +${s.topics.length - 2}` : ''}
                  </Text>
                </View>
                <View style={styles.sessionRight}>
                  <Text style={styles.sessionCost}>
                    ${s.total.toFixed(2)}
                  </Text>
                  <Text style={styles.sessionDur}>{s.minutes}m</Text>
                </View>
              </View>
              {s.rating ? (
                <>
                  <Divider />
                  <View style={styles.sessionRatingRow}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Ionicons
                        key={n}
                        name={n <= s.rating ? 'star' : 'star-outline'}
                        size={14}
                        color={
                          n <= s.rating ? colors.warning : colors.border
                        }
                        style={{ marginRight: 2 }}
                      />
                    ))}
                    {s.note ? (
                      <Text style={styles.ratingNote} numberOfLines={1}>
                        {s.note}
                      </Text>
                    ) : null}
                  </View>
                </>
              ) : null}
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
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: 100,
  },
  greeting: {
    fontSize: font.title,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: font.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  /* CTA Card */
  ctaCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  ctaTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ctaTextBlock: {
    flex: 1,
    marginRight: spacing.md,
  },
  ctaTitle: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  ctaDesc: {
    fontSize: font.caption,
    color: colors.white + 'BB',
    lineHeight: 20,
  },
  ctaArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Last Guide */
  lastGuideCard: {
    marginBottom: spacing.md,
  },
  lastGuideLabel: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  lastGuideRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastGuideInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  lastGuideName: {
    fontSize: font.body,
    fontWeight: '600',
    color: colors.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.text,
  },
  sessionCount: {
    fontSize: font.caption,
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionBtn: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  actionLabel: {
    fontSize: font.xs,
    color: colors.text,
    fontWeight: '500',
    marginTop: spacing.xs,
  },

  /* Section */
  sectionTitle: {
    fontSize: font.section,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },

  /* Session Cards */
  sessionCard: {
    marginBottom: spacing.sm,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  sessionGuide: {
    fontSize: font.body,
    fontWeight: '600',
    color: colors.text,
  },
  sessionTopics: {
    fontSize: font.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sessionRight: {
    alignItems: 'flex-end',
  },
  sessionCost: {
    fontSize: font.body,
    fontWeight: '600',
    color: colors.text,
  },
  sessionDur: {
    fontSize: font.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  sessionRatingRow: {
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
});
