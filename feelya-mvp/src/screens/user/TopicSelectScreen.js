import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import {
  Screen,
  Header,
  SearchBar,
  PrimaryButton,
  SecondaryButton,
  Pill,
  CategoryTile,
  SafetyBanner,
} from '../../components/UI';
import {
  useApp,
  ALL_TOPICS,
  SENSITIVE_TOPICS,
  QUICK_PICK_TOPICS,
  TOPIC_CATEGORIES,
} from '../../store/AppContext';

export default function TopicSelectScreen({ navigation, route }) {
  const { dispatch } = useApp();
  const preselect = route.params?.preselect;
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(preselect ? [preselect] : []);
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

  // Filter topics by search
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return ALL_TOPICS.filter((t) => t.toLowerCase().includes(q));
  }, [search]);

  const isSearching = search.trim().length > 0;

  return (
    <Screen>
      <Header title="What's on your mind?" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.searchWrap}>
          <SearchBar
            placeholder="Search topics..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {isSearching ? (
          /* Search results */
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Results</Text>
            <View style={styles.pills}>
              {searchResults.length === 0 ? (
                <Text style={styles.emptyText}>No topics found</Text>
              ) : (
                searchResults.map((t) => (
                  <Pill
                    key={t}
                    label={t}
                    selected={selected.includes(t)}
                    onPress={() => toggle(t)}
                  />
                ))
              )}
            </View>
          </View>
        ) : (
          <>
            {/* Quick Picks */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Quick picks</Text>
              <View style={styles.pills}>
                {QUICK_PICK_TOPICS.map((t) => (
                  <Pill
                    key={t}
                    label={t}
                    selected={selected.includes(t)}
                    onPress={() => toggle(t)}
                  />
                ))}
              </View>
              <TouchableOpacity
                style={styles.viewMoreBtn}
                onPress={() => navigation.navigate('AllTopics')}
                activeOpacity={0.7}
              >
                <Text style={styles.viewMoreText}>View more topics</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Category Tiles */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Explore by category</Text>
              <View style={styles.tilesGrid}>
                {TOPIC_CATEGORIES.map((cat) => (
                  <CategoryTile
                    key={cat.id}
                    label={cat.label}
                    icon={cat.icon}
                    color={cat.color}
                    onPress={() => navigation.navigate('TopicHub', { topic: cat.topics[0], categoryId: cat.id })}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer with selection count + button */}
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
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: font.section,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  viewMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  viewMoreText: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 4,
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
