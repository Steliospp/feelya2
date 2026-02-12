import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { Button } from '../../components/UI';
import { useApp } from '../../store/AppContext';

export default function SafetyDisclaimerScreen({ navigation }) {
  const { state, dispatch } = useApp();

  const acknowledge = () => {
    dispatch({ type: 'SET_SAFETY_ACK' });
    if (state.role === 'user') {
      navigation.replace('UserOnboarding');
    } else {
      navigation.replace('GuideOnboarding');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Before you begin</Text>
        <Text style={styles.intro}>
          A few things to know about Feelya before you get started.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Feelya is</Text>
          <BulletItem text="Peer-to-peer guidance and coaching" />
          <BulletItem text="Real conversations with real people" />
          <BulletItem text="Supportive, non-judgmental space" />
          <BulletItem text="On-demand — connect in minutes" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Feelya is not</Text>
          <BulletItem text="Not therapy, counseling, or medical treatment" muted />
          <BulletItem text="Not a substitute for professional mental health care" muted />
          <BulletItem text="Not staffed by licensed clinicians" muted />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Need immediate support?</Text>
          <Text style={styles.infoText}>
            If you or someone you know needs immediate help, please contact:
          </Text>
          <Text style={styles.infoNumber}>988 Suicide & Crisis Lifeline</Text>
          <Text style={styles.infoSubtext}>Call or text 988 — available 24/7</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="I understand, continue" onPress={acknowledge} />
      </View>
    </View>
  );
}

function BulletItem({ text, muted }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletDot}>{'\u2022'}</Text>
      <Text style={[styles.bulletText, muted && { color: colors.textMuted }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    padding: spacing.lg,
    paddingTop: 80,
    paddingBottom: 120,
  },
  title: {
    fontSize: font.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  intro: {
    fontSize: font.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: font.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bulletDot: {
    color: colors.textMuted,
    fontSize: font.md,
    marginRight: spacing.sm,
    marginTop: 1,
  },
  bulletText: {
    color: colors.textSecondary,
    fontSize: font.md,
    flex: 1,
    lineHeight: 22,
  },
  infoBox: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  infoTitle: {
    fontSize: font.md,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: font.sm,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  infoNumber: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  infoSubtext: { fontSize: font.sm, color: colors.textMuted },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
