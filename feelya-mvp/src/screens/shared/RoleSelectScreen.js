import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card } from '../../components/UI';
import { colors, spacing, radius, font } from '../../theme';
import { useApp } from '../../store/AppContext';

export default function RoleSelectScreen({ navigation }) {
  const { dispatch } = useApp();

  const select = (role) => {
    dispatch({ type: 'SET_ROLE', payload: role });
    navigation.navigate('SafetyDisclaimer');
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to feelya</Text>
        <Text style={styles.subtitle}>
          On-demand peer guidance and coaching.
        </Text>

        <Card onPress={() => select('user')} style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.iconWrap}>
              <Ionicons name="people-outline" size={28} color={colors.accent} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>I need guidance</Text>
              <Text style={styles.cardDesc}>
                Connect with a peer guide for coaching, support, and real talk.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </View>
        </Card>

        <Card onPress={() => select('guide')} style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.iconWrap}>
              <Ionicons name="hand-right-outline" size={28} color={colors.accent} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>I want to guide</Text>
              <Text style={styles.cardDesc}>
                Help others by sharing your experience. Earn on your schedule.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing.screenPadding,
  },
  content: {
    flex: 1,
    paddingTop: 140,
  },
  title: {
    fontSize: font.title,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: font.body,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardDesc: {
    fontSize: font.caption,
    color: colors.textSecondary,
    lineHeight: 19,
  },
});
