import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTabScrollToTop from '../../hooks/useTabScrollToTop';
import {
  Screen,
  QuoteCard,
  PrimaryCTA,
  GuideCard,
  SectionTitle,
  ResourceCard,
} from '../../components/UI';
import MoodCheckInCard from '../../components/MoodCheckInCard';
import { colors, spacing, radius, font } from '../../theme';
import { useApp, MOCK_GUIDES, BLOG_RESOURCES, getDailyQuote } from '../../store/AppContext';

const CTA_COPY = {
  calm: { title: 'Talk it through', subtitle: 'Stay grounded, reflect, or browse support.' },
  okay: { title: 'Talk it through', subtitle: 'Stay grounded, reflect, or browse support.' },
  overwhelmed: { title: 'Talk it through', subtitle: 'Get support or try a quick reset.' },
  anxious: { title: 'Talk it through', subtitle: 'Get support or try a quick reset.' },
  low: { title: 'Talk it through', subtitle: 'Find someone to listen\u2014no pressure.' },
  drained: { title: 'Talk it through', subtitle: 'Find someone to listen\u2014no pressure.' },
  frustrated: { title: 'Talk it through', subtitle: 'Vent, then get clarity.' },
};

export default function UserHomeScreen({ navigation }) {
  const scrollRef = useTabScrollToTop();
  const { state } = useApp();
  const quote = getDailyQuote();

  const [mood, setMood] = useState('okay');
  const onMoodChange = useCallback((m) => setMood(m), []);

  const cta = CTA_COPY[mood] || CTA_COPY.okay;

  // Show max 3 suggested guides
  const suggestedGuides = MOCK_GUIDES.slice(0, 3);

  return (
    <Screen>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              Welcome back{state.userName ? `, ${state.userName}` : ''}
            </Text>
            <Text style={styles.tagline}>How are you feeling today?</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile', { screen: 'ProfileMain' })}
          >
            <View style={styles.profileCircle}>
              <Ionicons name="person-outline" size={20} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Daily Quote */}
        <QuoteCard
          text={quote.text}
          author={quote.author}
          style={styles.quoteCard}
        />

        {/* Mood Check-In */}
        <MoodCheckInCard onMoodChange={onMoodChange} style={styles.moodCard} />

        {/* Primary CTA */}
        <PrimaryCTA
          title={cta.title}
          subtitle={cta.subtitle}
          onPress={() => navigation.navigate('TopicSelect')}
          style={styles.cta}
        />

        {/* Suggested Guides */}
        <SectionTitle>Recommended for you</SectionTitle>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.guidesRow}
        >
          {suggestedGuides.map((g) => (
            <GuideCard
              key={g.id}
              name={g.name}
              rating={g.rating}
              conversations={g.conversations}
              topics={g.topics}
              onPress={() => navigation.navigate('GuideProfile', { guideId: g.id })}
            />
          ))}
        </ScrollView>

        {/* Resources carousel */}
        <SectionTitle
          right={
            <TouchableOpacity onPress={() => navigation.navigate('Community', { screen: 'CommunityMain', params: { tab: 'resources' } })}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          }
        >
          Worth a read
        </SectionTitle>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.resourcesRow}
        >
          {BLOG_RESOURCES.map((r) => (
            <ResourceCard
              key={r.id}
              title={r.title}
              description={r.description}
              readTime={r.readTime}
              onPress={() => navigation.navigate('HomeResourceDetail', { resourceId: r.id })}
              style={styles.resourceCardHorizontal}
            />
          ))}
        </ScrollView>

        {/* Safety pill */}
        <TouchableOpacity style={styles.safetyPill} activeOpacity={0.7}>
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
          <Text style={styles.safetyText}>
            Not therapy -- peer support and conversation.{' '}
            <Text style={{ fontWeight: '600' }}>988</Text> for crisis help.
          </Text>
        </TouchableOpacity>
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
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: font.body,
    color: colors.textSecondary,
  },
  profileBtn: {},
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteCard: {
    marginBottom: spacing.md,
  },
  moodCard: {
    marginBottom: spacing.md,
  },
  cta: {
    marginBottom: spacing.lg,
  },
  seeAll: {
    fontSize: font.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  guidesRow: {
    paddingBottom: spacing.md,
  },
  resourcesRow: {
    paddingBottom: spacing.sm,
  },
  resourceCardHorizontal: {
    width: 240,
    marginRight: spacing.md,
    marginBottom: 0,
  },
  safetyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    marginTop: spacing.lg,
  },
  safetyText: {
    fontSize: font.xs,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
});
