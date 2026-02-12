import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { Avatar } from '../../components/UI';
import { useApp, getGuideReply, QUICK_REPLIES } from '../../store/AppContext';

export default function SessionChatScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const session = state.activeSession;
  const [input, setInput] = useState('');
  const [replyIdx, setReplyIdx] = useState(0);
  const flatListRef = useRef(null);
  const timerRef = useRef(null);

  // Duration timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      dispatch({
        type: 'UPDATE_DURATION',
        payload: Math.floor((Date.now() - session.startedAt) / 1000),
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Auto-send first guide message
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { id: 'm_0', from: 'guide', text: getGuideReply(0), ts: Date.now() },
      });
      setReplyIdx(1);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: 'm_u_' + Date.now(), from: 'user', text: text.trim(), ts: Date.now() };
    dispatch({ type: 'ADD_MESSAGE', payload: userMsg });
    setInput('');

    // Simulate guide reply after a short delay
    setTimeout(() => {
      const reply = {
        id: 'm_g_' + Date.now(),
        from: 'guide',
        text: getGuideReply(replyIdx),
        ts: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: reply });
      setReplyIdx((i) => i + 1);
    }, 1500 + Math.random() * 1500);
  };

  const endSession = () => {
    clearInterval(timerRef.current);
    dispatch({ type: 'END_SESSION' });
    navigation.replace('SessionSummary');
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const messages = session?.messages || [];

  const renderMessage = ({ item }) => {
    const isUser = item.from === 'user';
    return (
      <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
        {!isUser && <Avatar name={session.guideName} size={32} />}
        <View
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleGuide,
          ]}
        >
          <Text style={[styles.bubbleText, isUser && { color: colors.white }]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <Avatar name={session?.guideName} size={36} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{session?.guideName}</Text>
          <Text style={styles.headerTimer}>
            {formatTime(session?.durationSec || 0)} — ${session?.ratePerMin?.toFixed(2)}/min
          </Text>
        </View>
        <TouchableOpacity style={styles.endBtn} onPress={endSession}>
          <Text style={styles.endBtnText}>End</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Session started — your guide will message shortly...</Text>
        }
      />

      {/* Quick replies */}
      <FlatList
        horizontal
        data={QUICK_REPLIES}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.quickChip}
            onPress={() => sendMessage(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.quickText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          returnKeyType="send"
          onSubmitEditing={() => sendMessage(input)}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && { opacity: 0.4 }]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim()}
        >
          <Text style={styles.sendText}>{'\u2191'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingTop: spacing.xxl + spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerInfo: { flex: 1, marginLeft: spacing.sm },
  headerName: { color: colors.text, fontWeight: '700', fontSize: font.md },
  headerTimer: { color: colors.textSecondary, fontSize: font.xs, marginTop: 2 },
  endBtn: {
    backgroundColor: colors.danger,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  endBtnText: { color: colors.white, fontWeight: '700', fontSize: font.sm },
  messageList: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxl,
    fontSize: font.sm,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  msgRowUser: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '75%',
    padding: spacing.md,
    borderRadius: radius.lg,
    marginLeft: spacing.sm,
  },
  bubbleGuide: {
    backgroundColor: colors.surfaceLight,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
    marginLeft: 0,
  },
  bubbleText: { color: colors.text, fontSize: font.md, lineHeight: 22 },
  quickRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  quickChip: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickText: { color: colors.textSecondary, fontSize: font.xs },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: colors.text,
    fontSize: font.md,
    marginRight: spacing.sm,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { color: colors.white, fontSize: 18, fontWeight: '700' },
});
