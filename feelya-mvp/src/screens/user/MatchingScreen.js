import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, font, radius } from '../../theme';
import { Button } from '../../components/UI';
import { useApp, matchGuide } from '../../store/AppContext';

export default function MatchingScreen({ navigation, route }) {
  const { state, dispatch } = useApp();
  const [eta, setEta] = useState(null);
  const [dots, setDots] = useState('');
  const skipId = route.params?.skipGuideId ?? null;

  // Dot animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch({ type: 'SET_MATCHING', payload: true });
    const guide = matchGuide(state.selectedTopics, skipId);
    if (!guide) {
      navigation.goBack();
      return;
    }
    setEta(guide.responseTime);

    const delay = Math.max(3000, guide.responseTime * 1000);
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_MATCHED_GUIDE', payload: guide });
      navigation.replace('GuideFound');
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  const cancel = () => {
    dispatch({ type: 'SET_MATCHING', payload: false });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <View style={styles.orb}>
          <View style={styles.orbInner} />
        </View>

        <Text style={styles.title}>Finding your guide{dots}</Text>
        <Text style={styles.subtitle}>
          Matching based on your topics
        </Text>

        {eta != null && (
          <View style={styles.etaBox}>
            <Text style={styles.etaLabel}>Estimated wait</Text>
            <Text style={styles.etaValue}>~{eta} min{eta > 1 ? 's' : ''}</Text>
          </View>
        )}

        <View style={styles.topicRow}>
          {state.selectedTopics.map((t) => (
            <View key={t} style={styles.topicChip}>
              <Text style={styles.topicText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Cancel" variant="outline" onPress={cancel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  orb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  orbInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: font.xl,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: font.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  etaBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  etaLabel: { fontSize: font.xs, color: colors.textMuted },
  etaValue: { fontSize: font.lg, fontWeight: '600', color: colors.text, marginTop: 4 },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  topicChip: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 3,
  },
  topicText: { fontSize: font.xs, color: colors.textSecondary },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
