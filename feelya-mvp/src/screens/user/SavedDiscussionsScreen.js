import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, font } from '../../theme';
import {
  Screen, Header, Card, EmptyState,
} from '../../components/UI';
import { useApp } from '../../store/AppContext';

function timeAgo(ms) {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function SavedDiscussionsScreen({ navigation }) {
  const { state } = useApp();

  const savedThreads = state.threads.filter((t) =>
    state.bookmarkedThreads.includes(t.id)
  );

  return (
    <Screen>
      <Header title="Saved Discussions" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {savedThreads.length === 0 ? (
          <EmptyState
            icon="bookmark-outline"
            title="No saved discussions"
            subtitle="Bookmark community discussions to find them here"
          />
        ) : (
          savedThreads.map((thread) => (
            <Card
              key={thread.id}
              style={s.card}
              onPress={() => navigation.navigate('Community', { screen: 'Thread', params: { threadId: thread.id } })}
            >
              <View style={s.tagRow}>
                {thread.tags.slice(0, 2).map((tag) => (
                  <View key={tag} style={s.tag}>
                    <Text style={s.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <Text style={s.title}>{thread.title}</Text>
              <Text style={s.body} numberOfLines={2}>{thread.body}</Text>
              <View style={s.meta}>
                <Text style={s.author}>{thread.author}</Text>
                <Text style={s.dot}> -- </Text>
                <Text style={s.time}>{timeAgo(thread.createdAt)}</Text>
                <View style={s.stats}>
                  <Ionicons name="arrow-up-outline" size={14} color={colors.textSecondary} />
                  <Text style={s.statText}>{thread.upvotes}</Text>
                  <Ionicons name="chatbubble-outline" size={12} color={colors.textSecondary} style={{ marginLeft: 8 }} />
                  <Text style={s.statText}>{thread.replyCount}</Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: {
    padding: spacing.screenPadding,
    paddingBottom: 100,
  },
  card: {
    marginBottom: spacing.md,
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },
  tagText: {
    fontSize: font.xs,
    color: colors.primary,
    fontWeight: '500',
  },
  title: {
    fontSize: font.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  body: {
    fontSize: font.caption,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  author: {
    fontSize: font.xs,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  dot: {
    fontSize: font.xs,
    color: colors.textMuted,
  },
  time: {
    fontSize: font.xs,
    color: colors.textMuted,
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: font.xs,
    color: colors.textSecondary,
    marginLeft: 2,
  },
});
