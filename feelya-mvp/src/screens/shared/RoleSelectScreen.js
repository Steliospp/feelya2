import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { useApp } from '../../store/AppContext';

export default function RoleSelectScreen({ navigation }) {
  const { dispatch } = useApp();

  const select = (role) => {
    dispatch({ type: 'SET_ROLE', payload: role });
    navigation.navigate('SafetyDisclaimer');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How do you{'\n'}want to use feelya?</Text>
      <Text style={styles.subtitle}>
        Peer guidance & coaching — not therapy.
      </Text>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => select('user')}
      >
        <Text style={styles.cardEmoji}>{'\u{1F64B}'}</Text>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>I need guidance</Text>
          <Text style={styles.cardDesc}>
            Connect with a peer guide for coaching, support, and real talk.
          </Text>
        </View>
        <Text style={styles.arrow}>{'\u203A'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => select('guide')}
      >
        <Text style={styles.cardEmoji}>{'\u{1F9ED}'}</Text>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>I want to guide</Text>
          <Text style={styles.cardDesc}>
            Help others by sharing your experience. Earn on your schedule.
          </Text>
        </View>
        <Text style={styles.arrow}>{'\u203A'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingTop: 100,
  },
  title: {
    fontSize: font.hero,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 42,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: font.md,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: font.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  arrow: {
    fontSize: 28,
    color: colors.textMuted,
    marginLeft: spacing.sm,
  },
});
