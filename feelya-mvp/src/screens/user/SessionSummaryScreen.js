import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { colors, spacing, radius, font, shadow } from '../../theme';
import { Screen, Header, PrimaryButton, Card, Divider } from '../../components/UI';
import { useApp } from '../../store/AppContext';

export default function SessionSummaryScreen({ navigation }) {
  const { state } = useApp();
  const session = state.userSessions[0];
  const [paid, setPaid] = useState(false);

  if (!session) {
    navigation.replace('UserHome');
    return null;
  }

  const handlePay = () => {
    setPaid(true);
    Alert.alert(
      'Payment successful',
      `$${session.total.toFixed(2)} charged (simulated).`,
      [{ text: 'OK' }]
    );
  };

  const proceed = () => {
    navigation.replace('RateGuide');
  };

  return (
    <Screen>
      <Header title="Session summary" />

      <View style={styles.content}>
        <Card style={styles.summaryCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Guide</Text>
            <Text style={styles.value}>{session.guideName}</Text>
          </View>
          <Divider />
          <View style={styles.row}>
            <Text style={styles.label}>Topics</Text>
            <Text style={styles.value}>{session.topics.join(', ')}</Text>
          </View>
          <Divider />
          <View style={styles.row}>
            <Text style={styles.label}>Mode</Text>
            <Text style={styles.value}>
              {session.mode === 'chat' ? 'Chat' : session.mode === 'voice' ? 'Voice' : 'Video'}
            </Text>
          </View>
          <Divider />
          <View style={styles.row}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{session.minutes} min{session.minutes > 1 ? 's' : ''}</Text>
          </View>
          <Divider />
          <View style={styles.row}>
            <Text style={styles.label}>Rate</Text>
            <Text style={styles.value}>${session.ratePerMin.toFixed(2)}/min</Text>
          </View>
        </Card>

        <Card style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${session.total.toFixed(2)}</Text>
        </Card>
      </View>

      <View style={styles.footer}>
        {!paid ? (
          <PrimaryButton
            title={`Pay $${session.total.toFixed(2)}`}
            onPress={handlePay}
            icon="card-outline"
          />
        ) : (
          <PrimaryButton
            title="Rate your guide"
            onPress={proceed}
            icon="star-outline"
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  summaryCard: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { fontSize: font.caption, color: colors.textMuted },
  value: {
    fontSize: font.body,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.primaryLight,
  },
  totalLabel: { fontSize: font.lg, fontWeight: '600', color: colors.primary },
  totalValue: { fontSize: font.title, fontWeight: '700', color: colors.primary },
  footer: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
});
