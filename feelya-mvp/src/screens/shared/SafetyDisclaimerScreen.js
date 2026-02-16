import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, PrimaryButton, Card } from '../../components/UI';
import { colors, spacing, radius, font } from '../../theme';
import { useApp } from '../../store/AppContext';

export default function SafetyDisclaimerScreen({ navigation }) {
  const { dispatch } = useApp();

  const acknowledge = () => {
    dispatch({ type: 'SET_ROLE', payload: 'user' });
    dispatch({ type: 'SET_SAFETY_ACK' });
    navigation.replace('UserOnboarding');
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
        </View>
        <Text style={styles.title}>Before you begin</Text>
        <Text style={styles.intro}>A few things to know about Feelya.</Text>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>What Feelya is</Text>
          <BulletItem icon="checkmark-circle" iconColor={colors.success} text="A place to talk things through with real people" />
          <BulletItem icon="checkmark-circle" iconColor={colors.success} text="Supportive, non-judgmental conversations" />
          <BulletItem icon="checkmark-circle" iconColor={colors.success} text="Real guides who get it" />
          <BulletItem icon="checkmark-circle" iconColor={colors.success} text="On-demand -- connect in minutes" />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>What Feelya is not</Text>
          <BulletItem icon="close-circle" iconColor={colors.danger} text="Not therapy, counseling, or medical treatment" />
          <BulletItem icon="close-circle" iconColor={colors.danger} text="Not a substitute for professional care" />
          <BulletItem icon="close-circle" iconColor={colors.danger} text="Not staffed by licensed clinicians" />
        </Card>

        <View style={styles.infoBox}>
          <View style={styles.infoHeader}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="call" size={16} color={colors.primary} />
            </View>
            <Text style={styles.infoTitle}>Need immediate support?</Text>
          </View>
          <Text style={styles.infoNumber}>988 Suicide & Crisis Lifeline</Text>
          <Text style={styles.infoSubtext}>Call or text 988 -- available 24/7</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="I understand, continue" onPress={acknowledge} />
      </View>
    </Screen>
  );
}

function BulletItem({ icon, iconColor, text }) {
  return (
    <View style={styles.bullet}>
      <Ionicons name={icon} size={18} color={iconColor} style={styles.bulletIcon} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.screenPadding, paddingTop: 60, paddingBottom: 120 },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  title: { fontSize: font.title, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  intro: { fontSize: font.body, color: colors.textSecondary, marginBottom: spacing.xl, lineHeight: 22 },
  card: { marginBottom: spacing.md },
  sectionTitle: { fontSize: font.section, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm + 2 },
  bulletIcon: { marginRight: spacing.sm + 2, marginTop: 1 },
  bulletText: { color: colors.textSecondary, fontSize: font.body, flex: 1, lineHeight: 22 },
  infoBox: { backgroundColor: colors.primaryLight, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.sm },
  infoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  infoIconCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm,
  },
  infoTitle: { fontSize: font.section, fontWeight: '600', color: colors.text },
  infoNumber: { fontSize: font.lg, fontWeight: '600', color: colors.primary, marginBottom: 2 },
  infoSubtext: { fontSize: font.caption, color: colors.textMuted },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.screenPadding, paddingBottom: spacing.xxl, backgroundColor: colors.bg,
  },
});
