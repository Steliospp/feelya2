import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius, font } from '../../theme';
import { Screen, Card, Avatar, Pill, PrimaryButton, SecondaryButton } from '../../components/UI';
import { useApp } from '../../store/AppContext';

export default function IncomingRequestScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const req = state.guideIncomingRequest;

  useEffect(() => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (_) {}
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

  const modeIcon =
    req.mode === 'chat'
      ? 'chatbubble-outline'
      : req.mode === 'voice'
      ? 'mic-outline'
      : 'videocam-outline';

  const modeLabel =
    req.mode === 'chat'
      ? 'Chat'
      : req.mode === 'voice'
      ? 'Voice'
      : 'Video';

  return (
    <Screen>
      <View style={styles.center}>
        <View style={styles.cardWrap}>
          <Card style={styles.card}>
            <View style={styles.incomingRow}>
              <Ionicons name="notifications-outline" size={16} color={colors.primary} style={{ marginRight: spacing.xs }} />
              <Text style={styles.incoming}>Incoming Request</Text>
            </View>

            <View style={styles.userRow}>
              <Avatar name={req.userName} size={56} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{req.userName}</Text>
                <View style={styles.modeRow}>
                  <Ionicons name={modeIcon} size={14} color={colors.textSecondary} style={{ marginRight: spacing.xs }} />
                  <Text style={styles.userMode}>{modeLabel}</Text>
                </View>
              </View>
            </View>

            <View style={styles.topicRow}>
              {req.topics.map((t) => (
                <Pill key={t} label={t} selected={false} />
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
          <PrimaryButton
            title="Accept"
            onPress={accept}
            icon="checkmark-circle-outline"
            style={{ marginBottom: spacing.sm }}
          />
          <SecondaryButton
            title="Decline"
            variant="outline"
            onPress={decline}
            icon="close-circle-outline"
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  cardWrap: { marginBottom: spacing.lg },
  card: {
    borderColor: colors.border,
    borderWidth: 1,
  },
  incomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  incoming: {
    fontSize: font.caption,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  userInfo: { marginLeft: spacing.md },
  userName: { fontSize: font.xl, fontWeight: '800', color: colors.text },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  userMode: { fontSize: font.caption, color: colors.textSecondary },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
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
