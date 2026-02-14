import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  SearchBar,
  CategoryIcon,
  FeatureCard,
  Card,
  Avatar,
  SectionTitle,
  SafetyBanner,
  GuideCard,
  Divider,
  EmptyState,
} from '../../components/UI';
import { colors, spacing, radius, font, shadow } from '../../theme';
import { useApp, MOCK_GUIDES } from '../../store/AppContext';

const CATEGORIES = [
  { icon: 'heart-outline', label: 'Anxiety', color: '#EF4444' },
  { icon: 'trending-up-outline', label: 'Confidence', color: '#F59E0B' },
  { icon: 'briefcase-outline', label: 'Career', color: '#4B7BF5' },
  { icon: 'people-outline', label: 'Relations', color: '#8B5CF6' },
  { icon: 'fitness-outline', label: 'Fitness', color: '#10B981' },
];

export default function UserHomeScreen({ navigation }) {
  const { state } = useApp();
  const lastGuide = state.lastGuideId
    ? MOCK_GUIDES.find((g) => g.id === state.lastGuideId)
    : null;

  const handleCategoryPress = (label) => {
    navigation.navigate('TopicSelect', { preselect: label });
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Hey, {state.userName || 'there'}</Text>
            <Text style={styles.tagline}>What guidance do you need?</Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate('Profile', { screen: 'ProfileMain' })}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchBar
          placeholder="Search topics, guides..."
          style={styles.searchBar}
          onChangeText={() => {}}
        />

        {/* Category Icons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
        >
          {CATEGORIES.map((cat) => (
            <CategoryIcon
              key={cat.label}
              icon={cat.icon}
              label={cat.label}
              color={cat.color}
              onPress={() => handleCategoryPress(cat.label === 'Relations' ? 'Friendships' : cat.label)}
            />
          ))}
        </ScrollView>

        {/* Feature Card */}
        <FeatureCard
          title="Talk to a Guide"
          subtitle="Pick topics, choose your mode, and connect with a peer guide in minutes."
          icon="chatbubble-ellipses"
          onPress={() => navigation.navigate('TopicSelect')}
          style={styles.featureCard}
        />

        {/* Last Guide */}
        {lastGuide && (
          <>
            <SectionTitle>Your Last Guide</SectionTitle>
            <Card style={styles.lastGuideCard}>
              <View style={styles.lastGuideRow}>
                <Avatar name={lastGuide.name} size={48} />
                <View style={styles.lastGuideInfo}>
                  <Text style={styles.lastGuideName}>{lastGuide.name}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={13} color={colors.warning} style={{ marginRight: 3 }} />
                    <Text style={styles.ratingText}>{lastGuide.rating.toFixed(1)}</Text>
                    <Text style={styles.sessionCount}> -- {lastGuide.sessions} sessions</Text>
                  </View>
                </View>
              </View>
              <Divider style={{ marginVertical: spacing.md }} />
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate('GuideProfile', { guideId: lastGuide.id })}
                >
                  <View style={[styles.actionCircle, { backgroundColor: colors.primaryLight }]}>
                    <Ionicons name="refresh-outline" size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.actionLabel}>Rebook</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate('GuideProfile', { guideId: lastGuide.id })}
                >
                  <View style={[styles.actionCircle, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="calendar-outline" size={18} color="#F59E0B" />
                  </View>
                  <Text style={styles.actionLabel}>Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate('GuideProfile', { guideId: lastGuide.id })}
                >
                  <View style={[styles.actionCircle, { backgroundColor: '#DCFCE7' }]}>
                    <Ionicons name="chatbubble-outline" size={18} color="#10B981" />
                  </View>
                  <Text style={styles.actionLabel}>Message</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </>
        )}

        {/* Top Guides */}
        <SectionTitle
          right={
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          }
        >
          Top Guides
        </SectionTitle>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.guidesRow}
        >
          {MOCK_GUIDES.map((g) => (
            <GuideCard
              key={g.id}
              name={g.name}
              rating={g.rating}
              sessions={g.sessions}
              topics={g.topics}
              onPress={() => navigation.navigate('GuideProfile', { guideId: g.id })}
            />
          ))}
        </ScrollView>

        {/* Safety Banner */}
        <SafetyBanner compact />

        {/* Recent Sessions */}
        {state.userSessions.length > 0 && (
          <>
            <SectionTitle style={{ marginTop: spacing.lg }}>Recent Sessions</SectionTitle>
            {state.userSessions.slice(0, 3).map((s) => (
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
                    <Text style={styles.sessionCost}>${s.total.toFixed(2)}</Text>
                    <Text style={styles.sessionDur}>{s.minutes}m</Text>
                  </View>
                </View>
                {s.rating ? (
                  <View style={styles.sessionRatingRow}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Ionicons
                        key={n}
                        name={n <= s.rating ? 'star' : 'star-outline'}
                        size={12}
                        color={n <= s.rating ? colors.warning : colors.border}
                        style={{ marginRight: 2 }}
                      />
                    ))}
                  </View>
                ) : null}
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: 100,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
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
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  searchBar: {
    marginBottom: spacing.lg,
  },
  catRow: {
    paddingBottom: spacing.lg,
  },
  featureCard: {
    marginBottom: spacing.lg,
  },
  seeAll: {
    fontSize: font.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  guidesRow: {
    paddingBottom: spacing.sm,
  },

  /* Last Guide */
  lastGuideCard: { marginBottom: spacing.lg },
  lastGuideRow: { flexDirection: 'row', alignItems: 'center' },
  lastGuideInfo: { flex: 1, marginLeft: spacing.md },
  lastGuideName: { fontSize: font.body, fontWeight: '600', color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  ratingText: { fontSize: font.caption, fontWeight: '600', color: colors.text },
  sessionCount: { fontSize: font.caption, color: colors.textSecondary },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  actionBtn: { alignItems: 'center' },
  actionCircle: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs,
  },
  actionLabel: { fontSize: font.xs, color: colors.text, fontWeight: '500' },

  /* Session Cards */
  sessionCard: { marginBottom: spacing.sm },
  sessionRow: { flexDirection: 'row', alignItems: 'center' },
  sessionInfo: { flex: 1, marginLeft: spacing.md },
  sessionGuide: { fontSize: font.body, fontWeight: '600', color: colors.text },
  sessionTopics: { fontSize: font.xs, color: colors.textSecondary, marginTop: 2 },
  sessionRight: { alignItems: 'flex-end' },
  sessionCost: { fontSize: font.body, fontWeight: '600', color: colors.text },
  sessionDur: { fontSize: font.xs, color: colors.textMuted, marginTop: 2 },
  sessionRatingRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
});
