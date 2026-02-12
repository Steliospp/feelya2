import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Vibration } from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { Button, Card, Avatar } from '../../components/UI';
import { useApp } from '../../store/AppContext';

export default function IncomingRequestScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const req = state.guideIncomingRequest;

  useEffect(() => {
    try { Vibration.vibrate([0, 300, 200, 300]); } catch (_) {}
  }, []);

  if (!req) {
    navigation.goBack();
    return null;
  }

  const accept = () => {
    dispatch({ type: 'GUIDE_ACCEPT_REQUEST' });
    navigation.replace('GuideSession');
  };

  const decline = () => {
    dispatch({ type: 'GUIDE_DECLINE_REQUEST' });
    navigation.goBack();
  };

  const modeLabel =
    req.mode === 'chat'
      ? 'Chat'
      : req.mode === 'voice'
      ? 'Voice'
      : 'Video';

  return (
    <View style={styles.container}>
      <View style={styles.cardWrap}>
        <Card style={styles.card}>
          <Text style={styles.incoming}>Incoming Request</Text>

          <View style={styles.userRow}>
            <Avatar name={req.userName} size={56} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{req.userName}</Text>
              <Text style={styles.userMode}>{modeLabel}</Text>
            </View>
          </View>

          <View style={styles.topicRow}>
            {req.topics.map((t) => (
              <View key={t} style={styles.topicChip}>
                <Text style={styles.topicText}>{t}</Text>
              </View>
            ))}
          </View>

          <View style={styles.earningsRow}>
            <View>
              <Text style={styles.earningsLabel}>Est. Duration</Text>
              <Text style={styles.earningsValue}>~{req.estimatedMins} min</Text>
            </View>
            <View style={styles.earningsRight}>
              <Text style={styles.earningsLabel}>Est. Earnings</Text>
              <Text style={[styles.earningsValue, { color: colors.success }]}>
                ${req.estimatedEarnings.toFixed(2)}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <Button title="Accept" onPress={accept} style={{ marginBottom: spacing.sm }} />
        <Button title="Decline" variant="outline" onPress={decline} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  cardWrap: { marginBottom: spacing.lg },
  card: {
    borderColor: colors.border,
    borderWidth: 1,
  },
  incoming: {
    fontSize: font.sm,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  userInfo: { marginLeft: spacing.md },
  userName: { fontSize: font.xl, fontWeight: '800', color: colors.text },
  userMode: { fontSize: font.sm, color: colors.textSecondary, marginTop: 4 },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  topicChip: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  topicText: { color: colors.textSecondary, fontSize: font.xs, fontWeight: '600' },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earningsLabel: { fontSize: font.xs, color: colors.textMuted },
  earningsValue: {
    fontSize: font.xl,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  earningsRight: { alignItems: 'flex-end' },
  footer: {
    paddingHorizontal: spacing.lg,
  },
});
