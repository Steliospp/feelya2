import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../../theme';
import { Screen, Header, Card, Pill, Input, Avatar } from '../../../components/UI';
import { useApp } from '../../../store/AppContext';

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

export default function ThreadScreen({ navigation, route }) {
  const { threadId, autoFocusReply } = route.params;
  const { state, dispatch } = useApp();
  const [replyText, setReplyText] = useState('');

  const thread = state.threads.find((t) => t.id === threadId);
  const replies = state.replies[threadId] || [];
  const isUpvoted = state.upvotedThreads.includes(threadId);
  const isBookmarked = state.bookmarkedThreads.includes(threadId);

  if (!thread) {
    return (
      <Screen>
        <Header title="Thread" onBack={() => navigation.goBack()} />
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>Thread not found.</Text>
        </View>
      </Screen>
    );
  }

  const handleSendReply = () => {
    const trimmed = replyText.trim();
    if (!trimmed) return;
    dispatch({
      type: 'ADD_REPLY',
      payload: {
        threadId,
        reply: {
          author: state.userName || 'You',
          body: trimmed,
        },
      },
    });
    setReplyText('');
  };

  return (
    <Screen>
      <Header
        title={thread.title}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Original Post */}
          <Card style={styles.postCard}>
            <View style={styles.postHeader}>
              <Avatar name={thread.author} size={36} />
              <View style={styles.postHeaderInfo}>
                <Text style={styles.postAuthor}>{thread.author}</Text>
                <Text style={styles.postTime}>
                  {timeAgo(thread.createdAt)}
                </Text>
              </View>
            </View>
            <Text style={styles.postBody}>{thread.body}</Text>
            {thread.tags && thread.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {thread.tags.map((tag) => (
                  <Pill key={tag} label={tag} />
                ))}
              </View>
            )}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                hitSlop={8}
                onPress={() =>
                  dispatch({
                    type: 'TOGGLE_THREAD_UPVOTE',
                    payload: threadId,
                  })
                }
              >
                <Ionicons
                  name={isUpvoted ? 'arrow-up' : 'arrow-up-outline'}
                  size={18}
                  color={isUpvoted ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.actionCount,
                    isUpvoted && { color: colors.primary },
                  ]}
                >
                  {thread.upvotes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                hitSlop={8}
                onPress={() =>
                  dispatch({
                    type: 'TOGGLE_BOOKMARK',
                    payload: threadId,
                  })
                }
              >
                <Ionicons
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={17}
                  color={isBookmarked ? colors.primary : colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </Card>

          {/* Replies */}
          {replies.length > 0 && (
            <Text style={styles.repliesTitle}>
              Replies ({replies.length})
            </Text>
          )}
          {replies.map((reply) => {
            const replyUpvoted = state.upvotedReplies.includes(reply.id);
            return (
              <View key={reply.id} style={styles.replyCard}>
                <View style={styles.replyHeader}>
                  <Avatar name={reply.author} size={30} />
                  <View style={styles.replyHeaderInfo}>
                    <Text style={styles.replyAuthor}>{reply.author}</Text>
                    <Text style={styles.replyTime}>
                      {timeAgo(reply.createdAt)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.replyUpvote}
                    hitSlop={8}
                    onPress={() =>
                      dispatch({
                        type: 'TOGGLE_REPLY_UPVOTE',
                        payload: { threadId, replyId: reply.id },
                      })
                    }
                  >
                    <Ionicons
                      name={replyUpvoted ? 'arrow-up' : 'arrow-up-outline'}
                      size={16}
                      color={
                        replyUpvoted ? colors.primary : colors.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.replyUpvoteCount,
                        replyUpvoted && { color: colors.primary },
                      ]}
                    >
                      {reply.upvotes}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.replyBody}>{reply.body}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Reply Composer */}
        <View style={styles.composer}>
          <View style={styles.composerInner}>
            <Input
              placeholder="Write a reply..."
              value={replyText}
              onChangeText={setReplyText}
              returnKeyType="send"
              onSubmitEditing={handleSendReply}
              autoFocus={!!autoFocusReply}
              style={styles.composerInput}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                !replyText.trim() && styles.sendBtnDisabled,
              ]}
              onPress={handleSendReply}
              disabled={!replyText.trim()}
            >
              <Ionicons
                name="send"
                size={18}
                color={replyText.trim() ? colors.white : colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.lg,
  },
  postCard: {
    marginBottom: spacing.md,
    ...shadow.card,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  postHeaderInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  postAuthor: {
    fontSize: font.body,
    fontWeight: '600',
    color: colors.text,
  },
  postTime: {
    fontSize: font.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  postBody: {
    fontSize: font.body,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  actionCount: {
    fontSize: font.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  repliesTitle: {
    fontSize: font.section,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  replyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.cardPadding,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  replyHeaderInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  replyAuthor: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.text,
  },
  replyTime: {
    fontSize: font.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  replyUpvote: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyUpvoteCount: {
    fontSize: font.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  replyBody: {
    fontSize: font.body,
    color: colors.text,
    lineHeight: 21,
  },
  composer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.sm,
    ...shadow.tab,
  },
  composerInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  composerInput: {
    flex: 1,
    marginRight: spacing.sm,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.surfaceLight,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: font.body,
    color: colors.textMuted,
  },
});
