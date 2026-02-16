import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import {
  Screen, Header, Card, Avatar, EmptyState,
} from '../../components/UI';
import { useApp, MOCK_GUIDES } from '../../store/AppContext';

export default function MyGuidesScreen({ navigation }) {
  const { state } = useApp();

  // All unique guides user has interacted with
  const chattedGuideIds = [
    ...new Set([
      ...state.userSessions.map((s) => s.guideId),
      ...state.bookings.map((b) => b.guideId),
    ]),
  ];
  const myGuides = MOCK_GUIDES.filter((g) => chattedGuideIds.includes(g.id));

  return (
    <Screen>
      <Header title="My Guides" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {myGuides.length === 0 ? (
          <EmptyState
            icon="people-outline"
            title="No guides yet"
            subtitle="Start a conversation to connect with a guide"
          />
        ) : (
          myGuides.map((guide) => (
            <Card
              key={guide.id}
              style={s.card}
              onPress={() => navigation.navigate('Home', { screen: 'GuideProfile', params: { guideId: guide.id } })}
            >
              <View style={s.row}>
                <Avatar name={guide.name} size={52} />
                <View style={s.info}>
                  <Text style={s.name}>{guide.name}</Text>
                  <Text style={s.bio} numberOfLines={2}>{guide.bio}</Text>
                  <View style={s.metaRow}>
                    <View style={s.ratingRow}>
                      <Ionicons name="star" size={12} color={colors.warning} />
                      <Text style={s.ratingText}>{guide.rating}</Text>
                    </View>
                    <Text style={s.convos}>{guide.conversations} conversations</Text>
                  </View>
                  <View style={s.topicsRow}>
                    {guide.topics.slice(0, 3).map((t) => (
                      <View key={t} style={s.topicPill}>
                        <Text style={s.topicText}>{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: {
    padding: spacing.screenPadding,
    paddingBottom: 100,
  },
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: font.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  bio: {
    fontSize: font.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  ratingText: {
    fontSize: font.xs,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 3,
  },
  convos: {
    fontSize: font.xs,
    color: colors.textMuted,
  },
  topicsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topicPill: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 2,
  },
  topicText: {
    fontSize: font.xs,
    color: colors.primary,
    fontWeight: '500',
  },
});
