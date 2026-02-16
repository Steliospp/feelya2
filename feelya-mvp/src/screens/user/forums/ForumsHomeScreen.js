import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../../theme';
import { Screen, Card, SearchBar, Pill } from '../../../components/UI';
import { useApp, COMMUNITY_CATEGORIES } from '../../../store/AppContext';

function timeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ForumsHomeScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredThreads = useMemo(() => {
    let threads = state.threads;
    if (selectedCategory !== 'all') {
      threads = threads.filter((t) => t.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      threads = threads.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.body.toLowerCase().includes(q)
      );
    }
    return threads;
  }, [state.threads, selectedCategory, search]);

  return (
    <Screen>
      <View style={styles.topBar}>
        <Text style={styles.title}>Community</Text>
        <TouchableOpacity
          hitSlop={12}
          onPress={() => navigation.navigate('CreatePost')}
          style={styles.addBtn}
        >
          <Text style={styles.addBtnText}>Start discussion</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar
          placeholder="Search discussions..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.chipsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
        >
          {COMMUNITY_CATEGORIES.map((cat) => (
            <Pill
              key={cat.id}
              label={cat.label}
              selected={selectedCategory === cat.id}
              onPress={() => setSelectedCategory(cat.id)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.feed}
        showsVerticalScrollIndicator={false}
      >
        {filteredThreads.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No discussions found.</Text>
          </View>
        ) : (
          filteredThreads.map((thread) => {
            const isUpvoted = state.upvotedThreads.includes(thread.id);
            const isBookmarked = state.bookmarkedThreads.includes(thread.id);
            return (
              <Card
                key={thread.id}
                style={styles.threadCard}
                onPress={() =>
                  navigation.navigate('Thread', { threadId: thread.id })
                }
              >
                <Text style={styles.threadTitle}>{thread.title}</Text>
                <Text
                  style={styles.threadBody}
                  numberOfLines={2}
                >
                  {thread.body}
                </Text>
                <View style={styles.threadMeta}>
                  <Text style={styles.metaAuthor}>{thread.author}</Text>
                  <Text style={styles.metaDot}> -- </Text>
                  <Text style={styles.metaTime}>
                    {timeAgo(thread.createdAt)}
                  </Text>
                  <View style={styles.metaSpacer} />
                  <TouchableOpacity
                    style={styles.metaBtn}
                    hitSlop={8}
                    onPress={() =>
                      dispatch({
                        type: 'TOGGLE_THREAD_UPVOTE',
                        payload: thread.id,
                      })
                    }
                  >
                    <Ionicons
                      name={isUpvoted ? 'arrow-up' : 'arrow-up-outline'}
                      size={16}
                      color={isUpvoted ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.metaCount,
                        isUpvoted && { color: colors.primary },
                      ]}
                    >
                      {thread.upvotes}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.metaBtn} hitSlop={8}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.metaCount}>{thread.replyCount}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.metaBtn}
                    hitSlop={8}
                    onPress={() =>
                      dispatch({
                        type: 'TOGGLE_BOOKMARK',
                        payload: thread.id,
                      })
                    }
                  >
                    <Ionicons
                      name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                      size={15}
                      color={
                        isBookmarked ? colors.primary : colors.textSecondary
                      }
                    />
                  </TouchableOpacity>
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: font.title,
    fontWeight: '600',
    color: colors.text,
  },
  addBtn: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addBtnText: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.primary,
  },
  searchWrap: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.sm,
  },
  chipsWrap: {
    marginBottom: spacing.sm,
  },
  chipsContent: {
    paddingHorizontal: spacing.screenPadding,
  },
  feed: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
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
  },
  metaAuthor: {
    fontSize: font.xs,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  metaDot: {
    fontSize: font.xs,
    color: colors.textMuted,
  },
  metaTime: {
    fontSize: font.xs,
    color: colors.textMuted,
  },
  metaSpacer: {
    flex: 1,
  },
  metaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  metaCount: {
    fontSize: font.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: font.body,
    color: colors.textMuted,
  },
});
