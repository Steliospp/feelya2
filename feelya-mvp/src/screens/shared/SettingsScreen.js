import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors, spacing, font } from '../../theme';
import { Button, SafetyBanner, Card, Divider } from '../../components/UI';
import { useApp } from '../../store/AppContext';
import { CommonActions } from '@react-navigation/native';

export default function SettingsScreen({ navigation }) {
  const { state, dispatch } = useApp();

  const resetApp = () => {
    Alert.alert(
      'Reset App',
      'This will clear all data and return to the start screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'RESET' });
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: 'Splash' }] })
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>
          {state.role === 'user' ? 'Seeker' : 'Guide'}
        </Text>
        {state.role === 'user' && state.userName ? (
          <>
            <Text style={[styles.label, { marginTop: spacing.md }]}>Name</Text>
            <Text style={styles.value}>{state.userName}</Text>
          </>
        ) : null}
        {state.role === 'guide' && state.guideName ? (
          <>
            <Text style={[styles.label, { marginTop: spacing.md }]}>Name</Text>
            <Text style={styles.value}>{state.guideName}</Text>
          </>
        ) : null}
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.sectionHead}>Safety & Info</Text>
        <SafetyBanner />
        <View style={styles.crisisBox}>
          <Text style={styles.crisisLabel}>Resources</Text>
          <Text style={styles.crisisText}>
            988 Suicide & Crisis Lifeline{'\n'}
            Call or text 988 — 24/7{'\n\n'}
            Crisis Text Line{'\n'}
            Text HOME to 741741
          </Text>
        </View>
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.sectionHead}>About Feelya</Text>
        <Text style={styles.aboutText}>
          Feelya connects you with peer guides for on-demand coaching and support.
          This is not therapy, counseling, or medical advice. Guides are not
          licensed clinicians.
        </Text>
        <Divider />
        <Text style={styles.version}>v0.1.0 (MVP)</Text>
      </Card>

      <Button
        title="Reset App"
        variant="outline"
        onPress={resetApp}
        style={{ marginBottom: spacing.xxl }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingTop: spacing.lg },
  label: { fontSize: font.sm, color: colors.textMuted, marginBottom: 4 },
  value: { fontSize: font.lg, fontWeight: '600', color: colors.text },
  sectionHead: {
    fontSize: font.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  crisisBox: { marginTop: spacing.md },
  crisisLabel: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  crisisText: {
    fontSize: font.sm,
    color: colors.textMuted,
    lineHeight: 22,
  },
  aboutText: {
    fontSize: font.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  version: { fontSize: font.xs, color: colors.textMuted },
});
