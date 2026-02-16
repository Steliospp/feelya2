import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import {
  Screen,
  Header,
  SearchBar,
  PrimaryButton,
  SecondaryButton,
  Pill,
  SafetyBanner,
} from '../../components/UI';
import {
  useApp,
  ALL_TOPICS,
  SENSITIVE_TOPICS,
} from '../../store/AppContext';

export default function AllTopicsScreen({ navigation, route }) {
  const { dispatch } = useApp();
  const preselected = route.params?.preselect ? [route.params.preselect] : [];
  const fromHub = route.params?.fromHub || false;
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(preselected);
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

  const visibleTopics = useMemo(() => {
    if (!search.trim()) return ALL_TOPICS;
    const q = search.trim().toLowerCase();
    return ALL_TOPICS.filter((t) => t.toLowerCase().includes(q));
  }, [search]);

  return (
    <Screen>
      <Header
        title={fromHub ? 'Anything else to talk about?' : 'Browse all topics'}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.searchWrap}>
          <SearchBar
            placeholder="Search topics..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Pre-selected indicator */}
        {preselected.length > 0 && !search.trim() && (
          <View style={styles.preselectedWrap}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.preselectedText}>
              {preselected[0]} is already selected
            </Text>
          </View>
        )}

        <View style={styles.pills}>
          {visibleTopics.length === 0 ? (
            <Text style={styles.emptyText}>No topics found</Text>
          ) : (
            visibleTopics.map((t) => (
              <Pill
                key={t}
                label={t}
                selected={selected.includes(t)}
                onPress={() => toggle(t)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      {selected.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.count}>
            {selected.length} topic{selected.length !== 1 ? 's' : ''} selected
          </Text>
          <PrimaryButton
            title="Find a guide"
            onPress={proceed}
            icon="search-outline"
          />
        </View>
      )}

      {/* Safety modal */}
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
              peer support and conversation -- they are not licensed therapists or
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
    paddingTop: spacing.sm,
    paddingBottom: 180,
  },
  searchWrap: {
    marginBottom: spacing.md,
  },
  preselectedWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  preselectedText: {
    fontSize: font.caption,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 6,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyText: {
    fontSize: font.body,
    color: colors.textMuted,
    paddingVertical: spacing.md,
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
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    ...shadow.tab,
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
