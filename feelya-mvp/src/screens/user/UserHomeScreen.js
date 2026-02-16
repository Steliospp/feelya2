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
  Card,
  Avatar,
  SectionTitle,
  SafetyBanner,
  CompanionCard,
  ResourceCard,
  Pill,
  EmptyState,
} from '../../components/UI';
import { colors, spacing, radius, font, shadow } from '../../theme';
import { useApp, MOCK_COMPANIONS, TOPIC_CATEGORIES, BLOG_RESOURCES } from '../../store/AppContext';

/* ── Popular topic bubbles for "What's on your mind" ── */
const POPULAR_TOPICS = [
  'Anxiety', 'Confidence', 'Relationships', 'Career', 'Loneliness',
  'Burnout', 'Family', 'Identity', 'Motivation', 'Productivity',
  'Social Skills', 'Public Speaking', 'Dating', 'Overthinking',
  'Self-esteem', 'Breakups', 'Sleep', 'Stress', 'Mindset',
  'Boundaries',
];

export default function UserHomeScreen({ navigation }) {
  const { state } = useApp();

  const activeBookings = state.bookings.filter((b) => b.status === 'upcoming');
  const recentSessions = state.userSessions.slice(0, 3);
  const hasActiveChats = activeBookings.length > 0 || recentSessions.length > 0;

  const handleTopicPress = (topic) => {
    // Topic bubbles navigate to TopicHub, NOT start chat
    navigation.navigate('TopicHub', { topic });
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Hey, {state.userName || 'there'}</Text>
            <Text style={styles.tagline}>What's on your mind today?</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile', { screen: 'ProfileMain' })}
          >
            <Avatar name={state.userName} size={44} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchBar
          placeholder="Search topics, companions..."
          style={styles.searchBar}
          onChangeText={() => {}}
        />

        {/* Continue Conversations */}
        {hasActiveChats && (
          <>
            <SectionTitle
              right={
                <TouchableOpacity onPress={() => navigation.navigate('Chats')}>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              }
            >
              Continue Conversations
            </SectionTitle>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chatsRow}
            >
              {activeBookings.map((b) => {
                const companion = MOCK_COMPANIONS.find((g) => g.id === b.guideId);
                return (
                  <Card key={b.id} style={styles.chatCard} onPress={() => navigation.navigate('Chats', { screen: 'ChatDetail', params: { bookingId: b.id } })}>
                    <Avatar name={b.guideName} size={40} />
                    <Text style={styles.chatName} numberOfLines={1}>{b.guideName}</Text>
                    <Text style={styles.chatPreview} numberOfLines={1}>
                      {b.topics.slice(0, 2).join(', ')}
                    </Text>
                    <View style={styles.chatStatusRow}>
                      <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                      <Text style={styles.chatStatus}>Scheduled</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.chatContinueBtn}
                      onPress={() => navigation.navigate('Chats', { screen: 'ChatDetail', params: { bookingId: b.id } })}
                    >
                      <Text style={styles.chatContinueText}>Continue</Text>
                    </TouchableOpacity>
                  </Card>
                );
              })}
              {recentSessions.map((s) => (
                <Card key={s.id} style={styles.chatCard}>
                  <Avatar name={s.guideName} size={40} />
                  <Text style={styles.chatName} numberOfLines={1}>{s.guideName}</Text>
                  <Text style={styles.chatPreview} numberOfLines={1}>
                    {s.topics.slice(0, 2).join(', ')}
                  </Text>
                  <View style={styles.chatStatusRow}>
                    <View style={[styles.statusDot, { backgroundColor: colors.textMuted }]} />
                    <Text style={styles.chatStatus}>Completed</Text>
                  </View>
                </Card>
              ))}
            </ScrollView>
          </>
        )}

        {/* What's On Your Mind */}
        <SectionTitle>What's on your mind?</SectionTitle>
        <View style={styles.topicBubbles}>
          {POPULAR_TOPICS.map((topic) => (
            <Pill
              key={topic}
              label={topic}
              onPress={() => handleTopicPress(topic)}
            />
          ))}
        </View>

        {/* Suggested Companions */}
        <SectionTitle
          right={
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          }
        >
          Suggested Companions
        </SectionTitle>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.companionsRow}
        >
          {MOCK_COMPANIONS.map((g) => (
            <CompanionCard
              key={g.id}
              name={g.name}
              rating={g.rating}
              conversations={g.conversations}
              topics={g.topics}
              onPress={() => navigation.navigate('CompanionProfile', { guideId: g.id })}
            />
          ))}
        </ScrollView>

        {/* Resources */}
        <SectionTitle>Resources</SectionTitle>
        {BLOG_RESOURCES.slice(0, 3).map((blog) => (
          <ResourceCard
            key={blog.id}
            title={blog.title}
            description={blog.description}
            readTime={blog.readTime}
          />
        ))}

        {/* Safety Banner */}
        <View style={{ marginTop: spacing.lg }}>
          <SafetyBanner compact />
        </View>
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
  profileBtn: {
    ...shadow.card,
  },
  searchBar: {
    marginBottom: spacing.lg,
  },
  seeAll: {
    fontSize: font.caption,
    color: colors.primary,
    fontWeight: '600',
  },

  /* Continue Conversations */
  chatsRow: {
    paddingBottom: spacing.sm,
  },
  chatCard: {
    width: 160,
    alignItems: 'center',
    marginRight: spacing.md,
    paddingVertical: spacing.md,
  },
  chatName: {
    fontSize: font.body,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.sm,
  },
  chatPreview: {
    fontSize: font.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chatStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  chatStatus: {
    fontSize: font.xs,
    color: colors.textMuted,
  },
  chatContinueBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  chatContinueText: {
    fontSize: font.xs,
    fontWeight: '600',
    color: colors.primary,
  },

  /* Topics */
  topicBubbles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },

  /* Companions */
  companionsRow: {
    paddingBottom: spacing.sm,
  },
});
