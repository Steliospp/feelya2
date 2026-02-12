import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { Button, Avatar, Badge, StarRating, Card } from '../../components/UI';
import { useApp } from '../../store/AppContext';

export default function GuideFoundScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const guide = state.matchedGuide;

  if (!guide) {
    navigation.goBack();
    return null;
  }

  const topicOverlap = guide.topics.filter((t) =>
    state.selectedTopics.includes(t)
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Avatar name={guide.name} size={72} />
          <Text style={styles.name}>{guide.name}</Text>
          <View style={styles.ratingRow}>
            <StarRating rating={Math.round(guide.rating)} size={16} />
            <Text style={styles.ratingText}>
              {guide.rating} ({guide.sessions} sessions)
            </Text>
          </View>
        </View>

        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.bio}>{guide.bio}</Text>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.label}>Badges</Text>
          <View style={styles.badgeRow}>
            {guide.badges.map((b) => (
              <Badge key={b} label={b} />
            ))}
            {guide.verified && <Badge label="Verified" color={colors.success} />}
          </View>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.label}>Topics</Text>
          <View style={styles.topicRow}>
            {topicOverlap.map((t) => (
              <View key={t} style={styles.topicChip}>
                <Text style={styles.topicText}>{t}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.label}>Rate</Text>
              <Text style={styles.price}>${guide.ratePerMin.toFixed(2)}/min</Text>
            </View>
            <View>
              <Text style={styles.label}>Mode</Text>
              <Text style={styles.price}>
                {state.sessionMode === 'chat'
                  ? 'Chat'
                  : state.sessionMode === 'voice'
                  ? 'Voice'
                  : 'Video'}
              </Text>
            </View>
            <View>
              <Text style={styles.label}>Response</Text>
              <Text style={styles.price}>~{guide.responseTime}m</Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Start session" onPress={startSession} />
        <Button
          title="Find someone else"
          variant="outline"
          size="md"
          onPress={findSomeoneElse}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: 160,
  },
  profileSection: { alignItems: 'center', marginBottom: spacing.lg },
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
    fontSize: font.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  bio: {
    fontSize: font.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  label: {
    fontSize: font.xs,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  topicRow: { flexDirection: 'row', flexWrap: 'wrap' },
  topicChip: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  topicText: { color: colors.textSecondary, fontSize: font.xs, fontWeight: '500' },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: { fontSize: font.lg, fontWeight: '600', color: colors.text },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
