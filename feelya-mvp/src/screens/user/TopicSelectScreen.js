import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { Button, Pill, SafetyBanner } from '../../components/UI';
import { useApp, ALL_TOPICS, SENSITIVE_TOPICS } from '../../store/AppContext';

export default function TopicSelectScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [selected, setSelected] = useState([]);
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  const toggle = (topic) => {
    setSelected((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const proceed = () => {
    if (selected.length === 0) return;
    const hasSensitive = selected.some((t) => SENSITIVE_TOPICS.includes(t));
    if (hasSensitive) {
      setShowSafetyModal(true);
    } else {
      confirmAndContinue();
    }
  };

  const confirmAndContinue = () => {
    setShowSafetyModal(false);
    dispatch({ type: 'SET_SELECTED_TOPICS', payload: selected });
    navigation.navigate('SessionModeSelect');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What's on{'\n'}your mind?</Text>
        <Text style={styles.subtitle}>
          Pick one or more topics — we'll match you with the right guide.
        </Text>

        <View style={styles.pills}>
          {ALL_TOPICS.map((t) => (
            <Pill
              key={t}
              label={t}
              selected={selected.includes(t)}
              onPress={() => toggle(t)}
              color={SENSITIVE_TOPICS.includes(t) ? colors.accent : undefined}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.count}>
          {selected.length} topic{selected.length !== 1 ? 's' : ''} selected
        </Text>
        <Button
          title="Find a Guide"
          onPress={proceed}
          disabled={selected.length === 0}
        />
      </View>

      {/* Sensitive-topic safety modal */}
      <Modal visible={showSafetyModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>A quick note</Text>
            <SafetyBanner />
            <Text style={styles.modalBody}>
              The topics you selected touch on sensitive areas. Feelya guides
              offer peer support and coaching — they are not licensed therapists
              or counselors.{'\n\n'}If you're in crisis, please reach out to the{' '}
              <Text style={{ fontWeight: '700', color: colors.accent }}>
                988 Suicide & Crisis Lifeline
              </Text>{' '}
              (call or text 988).
            </Text>
            <Button
              title="I understand — continue"
              onPress={confirmAndContinue}
              style={{ marginBottom: spacing.sm }}
            />
            <Button
              title="Go back"
              variant="ghost"
              onPress={() => setShowSafetyModal(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: 160,
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
    marginBottom: spacing.xl,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  count: {
    fontSize: font.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  modalBody: {
    fontSize: font.sm,
    color: colors.textSecondary,
    lineHeight: 22,
    marginVertical: spacing.md,
  },
});
