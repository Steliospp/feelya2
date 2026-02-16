import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import {
  Screen, Header, SearchBar, PrimaryButton, SecondaryButton, Pill,
} from '../../components/UI';
import { QUICK_PICK_TOPICS, ALL_TOPICS } from '../../store/AppContext';

export default function TopicRefineScreen({ navigation, route }) {
  const { selectedTopics: initial = [] } = route.params || {};
  const [selected, setSelected] = useState(initial);
  const [search, setSearch] = useState('');

  const toggle = (topic) => {
    setSelected((prev) => {
      if (prev.includes(topic)) return prev.filter((t) => t !== topic);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, topic];
    });
  };

  const suggestions = useMemo(() => {
    if (!search.trim()) {
      return QUICK_PICK_TOPICS.filter((t) => !initial.includes(t));
    }
    const q = search.trim().toLowerCase();
    return ALL_TOPICS.filter(
      (t) => t.toLowerCase().includes(q) && !initial.includes(t),
    );
  }, [search, initial]);

  const goNext = (topics) => {
    navigation.navigate('ChooseSupportType', { selectedTopics: topics });
  };

  return (
    <Screen>
      <Header title="" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.heading}>Would you like to talk about anything else?</Text>
        <Text style={s.sub}>Pick up to 3 topics to guide the match.</Text>

        {/* Selected chips */}
        <View style={s.selectedRow}>
          {selected.map((t) => (
            <TouchableOpacity key={t} style={s.selectedChip} onPress={() => toggle(t)} activeOpacity={0.7}>
              <Text style={s.selectedChipText}>{t}</Text>
              <Ionicons name="close" size={14} color={colors.white} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          ))}
          {selected.length < 3 && (
            <View style={s.countBadge}>
              <Text style={s.countText}>{selected.length}/3</Text>
            </View>
          )}
        </View>

        {/* Search */}
        <View style={s.searchWrap}>
          <SearchBar placeholder="Search topics..." value={search} onChangeText={setSearch} />
        </View>

        {/* Suggestions */}
        <View style={s.pills}>
          {suggestions.length === 0 ? (
            <Text style={s.emptyText}>No topics found</Text>
          ) : (
            suggestions.map((t) => (
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
      <View style={s.footer}>
        <PrimaryButton
          title="Continue"
          onPress={() => goNext(selected)}
          style={{ marginBottom: spacing.sm }}
        />
        <SecondaryButton
          title="Skip -- just use my original topic"
          variant="ghost"
          onPress={() => goNext(initial)}
        />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: 200,
  },
  heading: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sub: {
    fontSize: font.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  selectedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  selectedChipText: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.white,
  },
  countBadge: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: spacing.sm,
  },
  countText: {
    fontSize: font.xs,
    fontWeight: '600',
    color: colors.textMuted,
  },
  searchWrap: {
    marginBottom: spacing.md,
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
});
