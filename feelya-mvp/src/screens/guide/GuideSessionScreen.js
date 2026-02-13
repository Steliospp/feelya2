import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font } from '../../theme';
import { Screen, Avatar, Card, SecondaryButton, Pill } from '../../components/UI';
import { useApp } from '../../store/AppContext';

export default function GuideSessionScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const session = state.guideActiveSession;
  const timerRef = useRef(null);

  useEffect(() => {
    if (!session) {
      navigation.replace('GuideHome');
      return;
    }
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
      dispatch({ type: 'GUIDE_UPDATE_DURATION', payload: elapsed });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const endSession = () => {
    Alert.alert('End Session', 'Are you sure you want to end this session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End',
        style: 'destructive',
        onPress: () => {
          clearInterval(timerRef.current);
          dispatch({ type: 'GUIDE_END_SESSION' });
          navigation.replace('GuideHome');
        },
      },
    ]);
  };

  const formatTime = (sec) => {
    const m = Math.floor((sec || 0) / 60);
    const s = (sec || 0) % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const modeIcon =
    session?.mode === 'chat'
      ? 'chatbubble-outline'
      : session?.mode === 'voice'
      ? 'mic-outline'
      : 'videocam-outline';

  const modeLabel =
    session?.mode === 'chat'
      ? 'Chat'
      : session?.mode === 'voice'
      ? 'Voice'
      : 'Video';

  const currentEarnings = +(
    Math.max(1, Math.ceil((session?.durationSec || 0) / 60)) * state.guideRate
  ).toFixed(2);

  return (
    <Screen>
      <View style={styles.center}>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE SESSION</Text>
        </View>

        <Avatar name={session?.userName} size={80} />
        <Text style={styles.name}>{session?.userName}</Text>
        <View style={styles.modeRow}>
          <Ionicons name={modeIcon} size={14} color={colors.textSecondary} style={{ marginRight: spacing.xs }} />
          <Text style={styles.mode}>{modeLabel}</Text>
        </View>

        <Text style={styles.timer}>{formatTime(session?.durationSec)}</Text>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Ionicons name="pricetag-outline" size={16} color={colors.textMuted} style={{ marginBottom: spacing.xs }} />
            <Text style={styles.statLabel}>Rate</Text>
            <Text style={styles.statValue}>${state.guideRate.toFixed(2)}/min</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="wallet-outline" size={16} color={colors.success} style={{ marginBottom: spacing.xs }} />
            <Text style={styles.statLabel}>Earned</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              ${currentEarnings}
            </Text>
          </Card>
        </View>

        <View style={styles.topicRow}>
          {(session?.topics || []).map((t) => (
            <Pill key={t} label={t} selected={false} />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <SecondaryButton
          title="End Session"
          variant="danger"
          onPress={endSession}
          icon="stop-circle-outline"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    marginRight: spacing.sm,
  },
  liveText: {
    fontSize: font.xs,
    fontWeight: '700',
    color: colors.danger,
    letterSpacing: 1,
  },
  name: {
    fontSize: font.xl,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.md,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  mode: {
    fontSize: font.caption,
    color: colors.textSecondary,
  },
  timer: {
    fontSize: 56,
    fontWeight: '200',
    color: colors.text,
    marginVertical: spacing.xl,
    fontVariant: ['tabular-nums'],
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  statLabel: { fontSize: font.xs, color: colors.textMuted },
  statValue: { fontSize: font.lg, fontWeight: '700', color: colors.text, marginTop: 4 },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footer: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
});
