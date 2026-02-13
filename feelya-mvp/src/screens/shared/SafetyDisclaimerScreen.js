import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, PrimaryButton } from '../../components/UI';
import { colors, spacing, radius, font } from '../../theme';
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
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Before you begin</Text>
        <Text style={styles.intro}>
          A few things to know about Feelya before you get started.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Feelya is</Text>
          <BulletItem
            icon="checkmark-circle-outline"
            iconColor={colors.success}
            text="Peer-to-peer guidance and coaching"
          />
          <BulletItem
            icon="checkmark-circle-outline"
            iconColor={colors.success}
            text="Real conversations with real people"
          />
          <BulletItem
            icon="checkmark-circle-outline"
            iconColor={colors.success}
            text="Supportive, non-judgmental space"
          />
          <BulletItem
            icon="checkmark-circle-outline"
            iconColor={colors.success}
            text="On-demand -- connect in minutes"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Feelya is not</Text>
          <BulletItem
            icon="close-circle-outline"
            iconColor={colors.danger}
            text="Not therapy, counseling, or medical treatment"
            muted
          />
          <BulletItem
            icon="close-circle-outline"
            iconColor={colors.danger}
            text="Not a substitute for professional mental health care"
            muted
          />
          <BulletItem
            icon="close-circle-outline"
            iconColor={colors.danger}
            text="Not staffed by licensed clinicians"
            muted
          />
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoHeader}>
            <Ionicons
              name="call-outline"
              size={18}
              color={colors.textSecondary}
              style={{ marginRight: spacing.sm }}
            />
            <Text style={styles.infoTitle}>Need immediate support?</Text>
          </View>
          <Text style={styles.infoText}>
            If you or someone you know needs immediate help, please contact:
          </Text>
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

function BulletItem({ icon, iconColor, text, muted }) {
  return (
    <View style={styles.bullet}>
      <Ionicons
        name={icon}
        size={20}
        color={iconColor}
        style={styles.bulletIcon}
      />
      <Text style={[styles.bulletText, muted && { color: colors.textMuted }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.screenPadding,
    paddingTop: 80,
    paddingBottom: 120,
  },
  title: {
    fontSize: font.title,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  intro: {
    fontSize: font.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: font.section,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm + 2,
  },
  bulletIcon: {
    marginRight: spacing.sm + 2,
    marginTop: 1,
  },
  bulletText: {
    color: colors.textSecondary,
    fontSize: font.body,
    flex: 1,
    lineHeight: 22,
  },
  infoBox: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoTitle: {
    fontSize: font.section,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  infoText: {
    fontSize: font.caption,
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
  infoSubtext: {
    fontSize: font.caption,
    color: colors.textMuted,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
