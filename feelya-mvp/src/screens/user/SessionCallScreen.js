import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import { Screen, Avatar } from '../../components/UI';
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
    <Screen style={styles.container}>
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
          <Ionicons
            name={muted ? 'mic-off-outline' : 'mic-outline'}
            size={28}
            color={muted ? colors.white : colors.primary}
          />
          <Text style={[styles.controlLabel, muted && styles.controlLabelActive]}>
            {muted ? 'Unmute' : 'Mute'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCallBtn} onPress={endSession}>
          <Ionicons name="call" size={28} color={colors.white} style={{ transform: [{ rotate: '135deg' }] }} />
        </TouchableOpacity>

        {isVideo && (
          <TouchableOpacity style={styles.controlBtn}>
            <Ionicons name="camera-reverse-outline" size={28} color={colors.primary} />
            <Text style={styles.controlLabel}>Flip</Text>
          </TouchableOpacity>
        )}
      </View>
    </Screen>
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
    backgroundColor: colors.primaryLight,
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
    fontSize: font.caption,
    color: colors.primary,
    fontWeight: '500',
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
    fontSize: font.caption,
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
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    ...shadow.card,
  },
  controlBtnActive: { backgroundColor: colors.primary },
  controlLabel: { fontSize: font.xs, color: colors.text, fontWeight: '500', marginTop: 2 },
  controlLabelActive: { color: colors.white },
  endCallBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.fab,
    shadowColor: colors.danger,
  },
});
