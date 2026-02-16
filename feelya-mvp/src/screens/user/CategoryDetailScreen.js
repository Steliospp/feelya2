import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import { Screen, Header } from '../../components/UI';
import { TOPIC_CATEGORIES, CATEGORY_DETAILS } from '../../store/AppContext';

export default function CategoryDetailScreen({ navigation, route }) {
  const { categoryId } = route.params || {};
  const category = TOPIC_CATEGORIES.find((c) => c.id === categoryId);

  if (!category) return null;

  const details = CATEGORY_DETAILS[categoryId] || {};

  return (
    <Screen>
      <Header title={category.label} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Category header */}
        <View style={s.header}>
          <View style={[s.iconCircle, { backgroundColor: category.color + '18' }]}>
            <Ionicons name={category.icon} size={32} color={category.color} />
          </View>
          <Text style={s.title}>{category.label}</Text>
          <Text style={s.intro}>{details.intro}</Text>
        </View>

        {/* Subtopics list */}
        <Text style={s.sectionLabel}>Explore topics</Text>
        {category.topics.map((topic) => (
          <TouchableOpacity
            key={topic}
            style={s.subtopicRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Subtopic', { topic, categoryId })}
          >
            <View style={[s.subtopicDot, { backgroundColor: category.color }]} />
            <Text style={s.subtopicText}>{topic}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: {
    padding: spacing.screenPadding,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  intro: {
    fontSize: font.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  sectionLabel: {
    fontSize: font.section,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  subtopicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  subtopicDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.md,
  },
  subtopicText: {
    flex: 1,
    fontSize: font.body,
    fontWeight: '500',
    color: colors.text,
  },
});
