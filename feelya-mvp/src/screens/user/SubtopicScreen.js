import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import {
  Screen, Header, Card, PrimaryButton, SecondaryButton,
} from '../../components/UI';
import { TOPIC_CATEGORIES, getSubtopicContent } from '../../store/AppContext';

export default function SubtopicScreen({ navigation, route }) {
  const { topic, categoryId } = route.params || {};
  const category = TOPIC_CATEGORIES.find((c) => c.id === categoryId);
  const content = getSubtopicContent(topic);

  return (
    <Screen>
      <Header title={topic} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Topic header */}
        <View style={s.header}>
          <View style={[s.iconCircle, { backgroundColor: (category?.color || colors.primary) + '18' }]}>
            <Ionicons
              name={category?.icon || 'help-circle-outline'}
              size={28}
              color={category?.color || colors.primary}
            />
          </View>
          <Text style={s.topicTitle}>{topic}</Text>
        </View>

        {/* Reflective questions */}
        <Text style={s.sectionLabel}>Questions to reflect on</Text>
        {content.questions.map((q, i) => (
          <Card key={i} style={s.questionCard}>
            <View style={s.questionRow}>
              <View style={s.questionNumber}>
                <Text style={s.questionNumText}>{i + 1}</Text>
              </View>
              <Text style={s.questionText}>{q}</Text>
            </View>
          </Card>
        ))}

        {/* Resource */}
        <Text style={s.sectionLabel}>Understanding {topic.toLowerCase()}</Text>
        <Card style={s.resourceCard}>
          <View style={s.resourceIconRow}>
            <Ionicons name="book-outline" size={18} color={colors.primary} />
            <Text style={s.resourceLabel}>Quick read</Text>
          </View>
          <Text style={s.resourceText}>{content.resource}</Text>
        </Card>

        {/* Grounding exercise */}
        {content.exercise && (
          <>
            <Text style={s.sectionLabel}>Try this</Text>
            <Card style={s.exerciseCard}>
              <View style={s.exerciseIconRow}>
                <Ionicons name="leaf-outline" size={18} color={colors.success} />
                <Text style={s.exerciseLabel}>60-second exercise</Text>
              </View>
              <Text style={s.exerciseText}>{content.exercise}</Text>
            </Card>
          </>
        )}

        {/* Spacer for footer */}
        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Footer CTA */}
      <View style={s.footer}>
        <PrimaryButton
          title={`Talk about ${topic}`}
          onPress={() => navigation.navigate('TopicRefine', { selectedTopics: [topic] })}
          icon="chatbubble-outline"
          style={{ marginBottom: spacing.sm }}
        />
        <SecondaryButton
          title="Save for later"
          variant="ghost"
          icon="bookmark-outline"
          onPress={() => {
            Alert.alert('Saved', `${topic} has been saved to your interests.`);
          }}
        />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: {
    padding: spacing.screenPadding,
    paddingBottom: 200,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  topicTitle: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.text,
  },
  sectionLabel: {
    fontSize: font.section,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  questionCard: {
    marginBottom: spacing.sm,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  questionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  questionNumText: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.primary,
  },
  questionText: {
    flex: 1,
    fontSize: font.body,
    color: colors.text,
    lineHeight: 22,
    paddingTop: 3,
  },
  resourceCard: {
    marginBottom: spacing.sm,
  },
  resourceIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resourceLabel: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  resourceText: {
    fontSize: font.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  exerciseCard: {
    marginBottom: spacing.sm,
    backgroundColor: '#F0FFF4',
  },
  exerciseIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  exerciseLabel: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.success,
    marginLeft: spacing.sm,
  },
  exerciseText: {
    fontSize: font.body,
    color: colors.textSecondary,
    lineHeight: 24,
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
