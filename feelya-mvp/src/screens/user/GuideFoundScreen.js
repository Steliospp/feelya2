import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font } from '../../theme';
import {
  Screen,
  PrimaryButton,
  SecondaryButton,
  Avatar,
  Badge,
  StarRating,
  Card,
  Pill,
  Divider,
} from '../../components/UI';
import { useApp } from '../../store/AppContext';

const BADGE_ICONS = {
  'Top Rated': 'trophy-outline',
  'Fast Responder': 'flash-outline',
  Empathetic: 'heart-outline',
  'Relationship Pro': 'people-outline',
  'Active Lifestyle': 'fitness-outline',
  'Lived Experience': 'ribbon-outline',
  Verified: 'shield-checkmark-outline',
};

export default function GuideFoundScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const guide = state.matchedGuide;

  if (!guide) {
    navigation.goBack();
    return null;
  }

  const topicOverlap = guide.topics.filter((t) =>
    state.selectedTopics.includes(t),
  );

  const startSession = () => {
    dispatch({ type: 'START_SESSION' });
    if (state.sessionMode === 'chat') {
      navigation.replace('SessionChat');
    } else {
      navigation.replace('SessionCall');
    }
  };

  const findSomeoneElse = () => {
    dispatch({ type: 'SET_MATCHED_GUIDE', payload: null });
    navigation.replace('Matching', { skipGuideId: guide.id });
  };

  const modeLabel =
    state.sessionMode === 'chat'
      ? 'Chat'
      : state.sessionMode === 'voice'
      ? 'Voice'
      : 'Video';

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        <View style={styles.profileSection}>
          <Avatar name={guide.name} size={80} />
          <Text style={styles.name}>{guide.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text style={styles.ratingText}>
              {guide.rating} ({guide.sessions} sessions)
            </Text>
          </View>
        </View>

        {/* Bio */}
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.bio}>{guide.bio}</Text>
        </Card>

        {/* Badges */}
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.sectionLabel}>Badges</Text>
          <View style={styles.badgeRow}>
            {guide.badges.map((b) => (
              <Badge
                key={b}
                label={b}
                icon={BADGE_ICONS[b] || 'ribbon-outline'}
              />
            ))}
            {guide.verified && (
              <Badge
                label="Verified"
                color={colors.success}
                icon={BADGE_ICONS.Verified}
              />
            )}
          </View>
        </Card>

        {/* Topics */}
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.sectionLabel}>Matching topics</Text>
          <View style={styles.topicRow}>
            {topicOverlap.map((t) => (
              <Pill key={t} label={t} selected />
            ))}
          </View>
        </Card>

        {/* Price / Mode / Response */}
        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.sectionLabel}>Rate</Text>
              <Text style={styles.statValue}>
                ${guide.ratePerMin.toFixed(2)}/min
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.sectionLabel}>Mode</Text>
              <Text style={styles.statValue}>{modeLabel}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.sectionLabel}>Response</Text>
              <Text style={styles.statValue}>~{guide.responseTime}m</Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <PrimaryButton
          title="Start session"
          onPress={startSession}
          icon="chatbubble-ellipses-outline"
        />
        <SecondaryButton
          title="Find someone else"
          variant="outline"
          onPress={findSomeoneElse}
          icon="refresh-outline"
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: 180,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  name: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  ratingText: {
    fontSize: font.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  sectionLabel: {
    fontSize: font.xs,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  bio: {
    fontSize: font.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
