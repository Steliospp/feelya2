import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { Button, SafetyBanner } from '../../components/UI';
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

        <SafetyBanner />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Feelya IS</Text>
          <BulletItem text="Peer-to-peer guidance and coaching" />
          <BulletItem text="Real conversations with real people" />
          <BulletItem text="Supportive, non-judgmental space" />
          <BulletItem text="On-demand — connect in minutes" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Feelya is NOT</Text>
          <BulletItem text="Not therapy, counseling, or medical treatment" warn />
          <BulletItem text="Not a substitute for professional mental health care" warn />
          <BulletItem text="Not staffed by licensed clinicians" warn />
        </View>

        <View style={styles.crisisBox}>
          <Text style={styles.crisisTitle}>In Crisis?</Text>
          <Text style={styles.crisisText}>
            If you or someone you know is in immediate danger, please contact emergency services or:
          </Text>
          <Text style={styles.crisisNumber}>988 Suicide & Crisis Lifeline</Text>
          <Text style={styles.crisisSubtext}>Call or text 988 — available 24/7</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="I understand — continue"
          onPress={acknowledge}
        />
      </View>
    </View>
  );
}

function BulletItem({ text, warn }) {
  return (
    <View style={styles.bullet}>
      <Text style={[styles.bulletDot, warn && { color: colors.accent }]}>
        {warn ? '\u2716' : '\u2714'}
      </Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    padding: spacing.lg,
    paddingTop: 80,
    paddingBottom: 120,
  },
  title: {
    fontSize: font.xxl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bulletDot: {
    color: colors.success,
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
  crisisBox: {
    marginTop: spacing.xl,
    backgroundColor: colors.accent + '12',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent + '33',
  },
  crisisTitle: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  crisisText: {
    fontSize: font.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  crisisNumber: {
    fontSize: font.xl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  crisisSubtext: {
    fontSize: font.sm,
    color: colors.textSecondary,
  },
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
