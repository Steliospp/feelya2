import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { Avatar } from '../../components/UI';
import { useApp } from '../../store/AppContext';

export default function SessionCallScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const session = state.activeSession;
  const [muted, setMuted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      dispatch({
        type: 'UPDATE_DURATION',
        payload: Math.floor((Date.now() - session.startedAt) / 1000),
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

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

  const isVideo = session?.mode === 'video';

  return (
    <View style={styles.container}>
      {/* Fake video / voice background */}
      <View style={styles.callArea}>
        {isVideo && (
          <View style={styles.videoBg}>
            <Text style={styles.videoPlaceholder}>Video feed (simulated)</Text>
          </View>
        )}
        <Avatar name={session?.guideName} size={100} />
        <Text style={styles.name}>{session?.guideName}</Text>
        <Text style={styles.mode}>
          {isVideo ? '\u{1F4F9} Video Call' : '\u{1F3A4} Voice Call'}
        </Text>
        <Text style={styles.timer}>{formatTime(session?.durationSec || 0)}</Text>
        <Text style={styles.rate}>${session?.ratePerMin?.toFixed(2)}/min</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlBtn, muted && styles.controlBtnActive]}
          onPress={() => setMuted((m) => !m)}
        >
          <Text style={styles.controlIcon}>{muted ? '\u{1F507}' : '\u{1F50A}'}</Text>
          <Text style={styles.controlLabel}>{muted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCallBtn} onPress={endSession}>
          <Text style={styles.endCallIcon}>{'\u{1F4DE}'}</Text>
        </TouchableOpacity>

        {isVideo && (
          <TouchableOpacity style={styles.controlBtn}>
            <Text style={styles.controlIcon}>{'\u{1F4F7}'}</Text>
            <Text style={styles.controlLabel}>Flip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A14' },
  callArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#12121F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholder: {
    color: colors.textMuted,
    fontSize: font.xs,
  },
  name: {
    fontSize: font.xl,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.lg,
  },
  mode: {
    fontSize: font.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  timer: {
    fontSize: 44,
    fontWeight: '200',
    color: colors.text,
    marginTop: spacing.xl,
    fontVariant: ['tabular-nums'],
  },
  rate: {
    fontSize: font.sm,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xxl + spacing.lg,
    paddingTop: spacing.lg,
  },
  controlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceLight,
    marginHorizontal: spacing.lg,
  },
  controlBtnActive: {
    backgroundColor: colors.primary + '33',
  },
  controlIcon: { fontSize: 24 },
  controlLabel: { fontSize: font.xs, color: colors.textSecondary, marginTop: 4 },
  endCallBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCallIcon: { fontSize: 32 },
});
