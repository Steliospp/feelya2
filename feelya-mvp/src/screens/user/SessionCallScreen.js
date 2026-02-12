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
      <View style={styles.callArea}>
        {isVideo && (
          <View style={styles.videoBg}>
            <Text style={styles.videoPlaceholder}>Video feed (simulated)</Text>
          </View>
        )}
        <Avatar name={session?.guideName} size={96} />
        <Text style={styles.name}>{session?.guideName}</Text>
        <Text style={styles.mode}>
          {isVideo ? 'Video Call' : 'Voice Call'}
        </Text>
        <Text style={styles.timer}>{formatTime(session?.durationSec || 0)}</Text>
        <Text style={styles.rate}>${session?.ratePerMin?.toFixed(2)}/min</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlBtn, muted && styles.controlBtnActive]}
          onPress={() => setMuted((m) => !m)}
        >
          <Text style={styles.controlLabel}>{muted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCallBtn} onPress={endSession}>
          <Text style={styles.endCallLabel}>End</Text>
        </TouchableOpacity>

        {isVideo && (
          <TouchableOpacity style={styles.controlBtn}>
            <Text style={styles.controlLabel}>Flip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  callArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholder: { color: colors.textMuted, fontSize: font.xs },
  name: {
    fontSize: font.xl,
    fontWeight: '700',
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
    color: colors.textSecondary,
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
  controlBtnActive: { backgroundColor: colors.border },
  controlLabel: { fontSize: font.sm, color: colors.text, fontWeight: '500' },
  endCallBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCallLabel: { fontSize: font.lg, color: colors.white, fontWeight: '600' },
});
