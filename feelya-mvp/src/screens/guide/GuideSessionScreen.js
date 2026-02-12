import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { Button, Avatar, Card } from '../../components/UI';
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
    <View style={styles.container}>
      <View style={styles.center}>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE SESSION</Text>
        </View>

        <Avatar name={session?.userName} size={80} />
        <Text style={styles.name}>{session?.userName}</Text>
        <Text style={styles.mode}>{modeLabel}</Text>

        <Text style={styles.timer}>{formatTime(session?.durationSec)}</Text>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Rate</Text>
            <Text style={styles.statValue}>${state.guideRate.toFixed(2)}/min</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Earned</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              ${currentEarnings}
            </Text>
          </Card>
        </View>

        <View style={styles.topicRow}>
          {(session?.topics || []).map((t) => (
            <View key={t} style={styles.topicChip}>
              <Text style={styles.topicText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="End Session" variant="danger" onPress={endSession} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
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
  mode: {
    fontSize: font.sm,
    color: colors.textSecondary,
    marginTop: 4,
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
  topicChip: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  topicText: { fontSize: font.xs, color: colors.textSecondary },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
