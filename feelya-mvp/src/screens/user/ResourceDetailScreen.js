import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font } from '../../theme';
import { Screen, Header, Pill } from '../../components/UI';
import { BLOG_RESOURCES } from '../../store/AppContext';

export default function ResourceDetailScreen({ navigation, route }) {
  const { resourceId } = route.params || {};
  const resource = BLOG_RESOURCES.find((r) => r.id === resourceId);

  if (!resource) {
    return (
      <Screen>
        <Header title="Article" onBack={() => navigation.goBack()} />
        <View style={s.empty}>
          <Text style={s.emptyText}>Article not found</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Topic pills */}
        <View style={s.topics}>
          {resource.topics.map((t) => (
            <Pill key={t} label={t} />
          ))}
        </View>

        <Text style={s.title}>{resource.title}</Text>

        <View style={s.metaRow}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={s.readTime}>{resource.readTime}</Text>
        </View>

        {/* Body content */}
        {resource.body?.map((block, i) => {
          if (block.type === 'heading') {
            return <Text key={i} style={s.heading}>{block.text}</Text>;
          }
          return <Text key={i} style={s.paragraph}>{block.text}</Text>;
        })}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: {
    padding: spacing.screenPadding,
    paddingBottom: 100,
  },
  topics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 32,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  readTime: {
    fontSize: font.caption,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  heading: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  paragraph: {
    fontSize: font.body,
    color: colors.textSecondary,
    lineHeight: 26,
    marginBottom: spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: font.body,
    color: colors.textMuted,
  },
});
