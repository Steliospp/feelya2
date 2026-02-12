import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { Button, Card, Divider } from '../../components/UI';
import { useApp } from '../../store/AppContext';

export default function SessionSummaryScreen({ navigation }) {
  const { state } = useApp();
  const session = state.userSessions[0]; // most recent session
  const [paid, setPaid] = useState(false);

  if (!session) {
    navigation.replace('UserHome');
    return null;
  }

  const handlePay = () => {
    setPaid(true);
    Alert.alert(
      'Payment Successful',
      `$${session.total.toFixed(2)} charged (simulated). Thanks for using Feelya!`,
      [{ text: 'OK' }]
    );
  };

  const proceed = () => {
    navigation.replace('RateGuide');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session{'\n'}Summary</Text>

      <Card style={{ marginBottom: spacing.md }}>
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
            {session.mode === 'chat'
              ? '\u{1F4AC} Chat'
              : session.mode === 'voice'
              ? '\u{1F3A4} Voice'
              : '\u{1F4F9} Video'}
          </Text>
        </View>
        <Divider />
        <View style={styles.row}>
          <Text style={styles.label}>Duration</Text>
          <Text style={styles.value}>
            {session.minutes} min{session.minutes > 1 ? 's' : ''}
          </Text>
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

      <View style={styles.footer}>
        {!paid ? (
          <Button title={`Pay $${session.total.toFixed(2)}`} onPress={handlePay} />
        ) : (
          <Button title="Rate your guide" onPress={proceed} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.lg,
  },
  title: {
    fontSize: font.hero,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 42,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { fontSize: font.sm, color: colors.textMuted },
  value: {
    fontSize: font.md,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary + '33',
  },
  totalLabel: { fontSize: font.lg, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: font.xxl, fontWeight: '800', color: colors.primary },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
