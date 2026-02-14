import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import {
  Screen,
  Header,
  PrimaryButton,
  SecondaryButton,
  Pill,
  SafetyBanner,
} from '../../components/UI';
import { useApp, ALL_TOPICS, SENSITIVE_TOPICS } from '../../store/AppContext';

export default function TopicSelectScreen({ navigation }) {
  const { dispatch } = useApp();
  const [selected, setSelected] = useState([]);
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  const toggle = (topic) => {
    setSelected((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
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
    <Screen>
      <Header title="Topics" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>What's on your mind?</Text>
        <Text style={styles.subtitle}>
          Pick one or more topics and we'll match you with the right guide.
        </Text>

        <View style={styles.pills}>
          {ALL_TOPICS.map((t) => (
            <Pill
              key={t}
              label={t}
              selected={selected.includes(t)}
              onPress={() => toggle(t)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.count}>
          {selected.length} topic{selected.length !== 1 ? 's' : ''} selected
        </Text>
        <PrimaryButton
          title="Find a guide"
          onPress={proceed}
          disabled={selected.length === 0}
          icon="search-outline"
        />
      </View>

      {/* Sensitive-topic safety modal */}
      <Modal visible={showSafetyModal} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowSafetyModal(false)}>
          <Pressable style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                <Ionicons name="alert-circle-outline" size={22} color={colors.primary} />
              </View>
              <Text style={styles.modalTitle}>A quick note</Text>
            </View>

            <SafetyBanner />

            <Text style={styles.modalBody}>
              The topics you selected touch on sensitive areas. Feelya guides offer
              peer support and coaching -- they are not licensed therapists or
              counselors.{'\n\n'}If you need immediate help, call or text{' '}
              <Text style={{ fontWeight: '700' }}>988</Text> (Suicide & Crisis
              Lifeline).
            </Text>

            <PrimaryButton
              title="I understand, continue"
              onPress={confirmAndContinue}
              style={{ marginBottom: spacing.sm }}
            />
            <SecondaryButton
              title="Go back"
              variant="ghost"
              onPress={() => setShowSafetyModal(false)}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: 180,
  },
  title: {
    fontSize: font.title,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: font.body,
    color: colors.textSecondary,
    lineHeight: 22,
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
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow.card,
  },
  count: {
    fontSize: font.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.cardHover,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: font.xl,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing.sm,
  },
  modalBody: {
    fontSize: font.caption,
    color: colors.textSecondary,
    lineHeight: 22,
    marginVertical: spacing.md,
  },
});
