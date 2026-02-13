import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font } from '../../theme';
import { Screen, Header, Pill, PrimaryButton } from '../../components/UI';
import { useApp, ALL_TOPICS } from '../../store/AppContext';

export default function GuideTopicsAndRateScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [topics, setTopics] = useState(state.guideTopics);
  const [rate, setRate] = useState(String(state.guideRate));

  const toggle = (topic) => {
    setTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const proceed = () => {
    if (topics.length === 0) return;
    const parsedRate = parseFloat(rate) || 0.99;
    dispatch({ type: 'SET_GUIDE_TOPICS', payload: topics });
    dispatch({ type: 'SET_GUIDE_RATE', payload: Math.max(0.01, parsedRate) });
    navigation.navigate('GuideVerification');
  };

  return (
    <Screen>
      <Header title="Your Expertise" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your expertise</Text>
        <Text style={styles.subtitle}>
          Select topics you can guide on, and set your rate.
        </Text>

        <Text style={styles.label}>Topics (select at least 1)</Text>
        <View style={styles.pills}>
          {ALL_TOPICS.map((t) => (
            <Pill
              key={t}
              label={t}
              selected={topics.includes(t)}
              onPress={() => toggle(t)}
            />
          ))}
        </View>

        <Text style={[styles.label, { marginTop: spacing.xl }]}>
          Rate per minute ($)
        </Text>
        <View style={styles.rateRow}>
          <Ionicons name="cash-outline" size={20} color={colors.textMuted} style={{ marginRight: spacing.sm }} />
          <Text style={styles.dollar}>$</Text>
          <TextInput
            style={styles.rateInput}
            value={rate}
            onChangeText={setRate}
            keyboardType="decimal-pad"
            maxLength={5}
          />
          <Text style={styles.perMin}>/min</Text>
        </View>
        <Text style={styles.hint}>
          Average guide rate: $0.79--$1.29/min
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.count}>
          {topics.length} topic{topics.length !== 1 ? 's' : ''} selected
        </Text>
        <PrimaryButton
          title="Continue"
          onPress={proceed}
          disabled={topics.length === 0}
          icon="arrow-forward"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: 140,
  },
  title: {
    fontSize: font.title,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: font.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: font.caption,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  pills: { flexDirection: 'row', flexWrap: 'wrap' },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dollar: { fontSize: font.xl, color: colors.textMuted, fontWeight: '700' },
  rateInput: {
    flex: 1,
    fontSize: font.title,
    color: colors.text,
    fontWeight: '800',
    paddingVertical: spacing.md,
    marginLeft: spacing.xs,
  },
  perMin: { fontSize: font.body, color: colors.textMuted },
  hint: {
    fontSize: font.xs,
    color: colors.textMuted,
    marginTop: spacing.sm,
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
  count: {
    fontSize: font.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
