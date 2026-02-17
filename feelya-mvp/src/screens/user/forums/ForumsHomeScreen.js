import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTabScrollToTop from '../../../hooks/useTabScrollToTop';
import { colors, spacing, radius, font, shadow } from '../../../theme';
import { Screen, Card, SearchBar, Pill, ResourceCard } from '../../../components/UI';
import { useApp, COMMUNITY_CATEGORIES, BLOG_RESOURCES } from '../../../store/AppContext';

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
  const scrollRef = useTabScrollToTop();
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('discussions');
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

  const filteredResources = useMemo(() => {
    if (!search.trim()) return BLOG_RESOURCES;
    const q = search.trim().toLowerCase();
    return BLOG_RESOURCES.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <Screen>
      <View style={styles.topBar}>
        <Text style={styles.title}>Community</Text>
        {activeTab === 'discussions' && (
          <TouchableOpacity
            hitSlop={12}
            onPress={() => navigation.navigate('CreatePost')}
            style={styles.addBtn}
          >
            <Text style={styles.addBtnText}>Start discussion</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'discussions' && styles.tabActive]}
          onPress={() => setActiveTab('discussions')}
        >
          <Text style={[styles.tabText, activeTab === 'discussions' && styles.tabTextActive]}>
            Discussions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'resources' && styles.tabActive]}
          onPress={() => setActiveTab('resources')}
        >
          <Text style={[styles.tabText, activeTab === 'resources' && styles.tabTextActive]}>
            Resources
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar
          placeholder={activeTab === 'discussions' ? 'Search discussions...' : 'Search resources...'}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {activeTab === 'discussions' ? (
        <>
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
            ref={scrollRef}
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
                      <TouchableOpacity
                        style={styles.metaBtn}
                        hitSlop={8}
                        onPress={() =>
                          navigation.navigate('Thread', { threadId: thread.id, autoFocusReply: true })
                        }
                      >
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
        </>
      ) : (
        /* Resources tab */
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.feed}
          showsVerticalScrollIndicator={false}
        >
          {filteredResources.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No resources found.</Text>
            </View>
          ) : (
            filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                title={resource.title}
                description={resource.description}
                readTime={resource.readTime}
                onPress={() => navigation.navigate('CommunityResourceDetail', { resourceId: resource.id })}
              />
            ))
          )}
        </ScrollView>
      )}
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
  /* Tabs */
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: font.body,
    fontWeight: '500',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
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
