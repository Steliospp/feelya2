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
  Header,
  Card,
  SectionTitle,
  CompanionCard,
  ResourceCard,
  Pill,
} from '../../components/UI';
import { colors, spacing, radius, font, shadow } from '../../theme';
import { useApp, MOCK_COMPANIONS, TOPIC_CATEGORIES, BLOG_RESOURCES } from '../../store/AppContext';

/* Prompt questions for discussion starters */
const PROMPT_QUESTIONS = {
  Anxiety: [
    'What triggers your anxiety the most?',
    'How do you usually cope when you feel anxious?',
    'Have you found anything that helps you calm down?',
  ],
  Confidence: [
    'What area of your life do you want more confidence in?',
    'When do you feel most confident?',
    'What holds you back from being more confident?',
  ],
  Relationships: [
    'What kind of relationship challenge are you facing?',
    'How do you usually handle conflict?',
    'What does a healthy relationship look like to you?',
  ],
  default: [
    'What brought you here today?',
    'How has this been affecting your daily life?',
    'What would feel different if this got better?',
  ],
};

export default function TopicHubScreen({ navigation, route }) {
  const { state } = useApp();
  const { topic } = route.params || {};

  // Find matching category for this topic
  const category = TOPIC_CATEGORIES.find((cat) =>
    cat.topics.includes(topic)
  );

  // Find companions who cover this topic
  const matchingCompanions = MOCK_COMPANIONS.filter((c) =>
    c.topics.includes(topic)
  );

  // Find related discussions
  const relatedThreads = state.threads.filter((t) =>
    t.tags.includes(topic) || t.title.toLowerCase().includes(topic.toLowerCase())
  );

  // Find related blog resources
  const relatedResources = BLOG_RESOURCES.filter((b) =>
    b.topics.includes(topic)
  );

  // Get prompt questions
  const prompts = PROMPT_QUESTIONS[topic] || PROMPT_QUESTIONS.default;

  // Related topics from same category
  const relatedTopics = category
    ? category.topics.filter((t) => t !== topic).slice(0, 8)
    : [];

  return (
    <Screen>
      <Header title={topic} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Topic header */}
        <View style={s.topicHeader}>
          <View style={[s.topicIcon, { backgroundColor: (category?.color || colors.primary) + '18' }]}>
            <Ionicons
              name={category?.icon || 'help-circle-outline'}
              size={28}
              color={category?.color || colors.primary}
            />
          </View>
          <Text style={s.topicTitle}>{topic}</Text>
          <Text style={s.topicSubtitle}>
            Explore conversations, resources, and companions for {topic.toLowerCase()}.
          </Text>
        </View>

        {/* Prompt Questions */}
        <SectionTitle>Questions to explore</SectionTitle>
        {prompts.map((q, i) => (
          <Card key={i} style={s.promptCard}>
            <View style={s.promptRow}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primary} />
              <Text style={s.promptText}>{q}</Text>
            </View>
          </Card>
        ))}

        {/* Suggested Companions */}
        {matchingCompanions.length > 0 && (
          <>
            <SectionTitle style={{ marginTop: spacing.sm }}>Companions</SectionTitle>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.companionsRow}
            >
              {matchingCompanions.map((c) => (
                <CompanionCard
                  key={c.id}
                  name={c.name}
                  rating={c.rating}
                  conversations={c.conversations}
                  topics={c.topics}
                  onPress={() => navigation.navigate('CompanionProfile', { guideId: c.id })}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* Community Discussions */}
        {relatedThreads.length > 0 && (
          <>
            <SectionTitle style={{ marginTop: spacing.sm }}>Discussions</SectionTitle>
            {relatedThreads.slice(0, 3).map((thread) => (
              <Card
                key={thread.id}
                style={s.threadCard}
                onPress={() => navigation.navigate('Community', { screen: 'Thread', params: { threadId: thread.id } })}
              >
                <Text style={s.threadTitle}>{thread.title}</Text>
                <Text style={s.threadBody} numberOfLines={2}>{thread.body}</Text>
                <View style={s.threadMeta}>
                  <Text style={s.threadAuthor}>{thread.author}</Text>
                  <View style={s.threadStats}>
                    <Ionicons name="arrow-up-outline" size={14} color={colors.textSecondary} />
                    <Text style={s.threadCount}>{thread.upvotes}</Text>
                    <Ionicons name="chatbubble-outline" size={12} color={colors.textSecondary} style={{ marginLeft: spacing.sm }} />
                    <Text style={s.threadCount}>{thread.replyCount}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}

        {/* Resources */}
        {relatedResources.length > 0 && (
          <>
            <SectionTitle style={{ marginTop: spacing.sm }}>Resources</SectionTitle>
            {relatedResources.map((blog) => (
              <ResourceCard
                key={blog.id}
                title={blog.title}
                description={blog.description}
                readTime={blog.readTime}
              />
            ))}
          </>
        )}

        {/* Related Topics */}
        {relatedTopics.length > 0 && (
          <>
            <SectionTitle style={{ marginTop: spacing.sm }}>Related topics</SectionTitle>
            <View style={s.relatedTopics}>
              {relatedTopics.map((t) => (
                <Pill
                  key={t}
                  label={t}
                  onPress={() => navigation.replace('TopicHub', { topic: t })}
                />
              ))}
            </View>
          </>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: {
    padding: spacing.screenPadding,
    paddingBottom: 120,
  },
  topicHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  topicIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  topicTitle: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  topicSubtitle: {
    fontSize: font.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  promptCard: {
    marginBottom: spacing.sm,
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  promptText: {
    flex: 1,
    fontSize: font.body,
    color: colors.text,
    marginLeft: spacing.sm,
    lineHeight: 22,
  },
  companionsRow: {
    paddingBottom: spacing.sm,
  },
  threadCard: {
    marginBottom: spacing.sm,
  },
  threadTitle: {
    fontSize: font.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  threadBody: {
    fontSize: font.caption,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: spacing.sm,
  },
  threadMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  threadAuthor: {
    fontSize: font.xs,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  threadStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  threadCount: {
    fontSize: font.xs,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  relatedTopics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
