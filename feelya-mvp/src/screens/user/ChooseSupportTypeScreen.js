import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import { Screen, Header, PrimaryButton } from '../../components/UI';

const SUPPORT_TYPES = [
  {
    id: 'licensed',
    icon: 'shield-checkmark',
    label: 'Licensed Professional',
    badge: 'Therapist / Certified counselor',
    subtitle: 'Clinical support for deeper concerns',
    price: 'From $70 / session',
    color: '#6C5CE7',
  },
  {
    id: 'guide',
    icon: 'people',
    label: 'Certified Guide',
    badge: 'Structured conversation partner',
    subtitle: 'Support, clarity, accountability',
    price: 'From $15 / session',
    color: colors.primary,
  },
];

export default function ChooseSupportTypeScreen({ navigation, route }) {
  const { selectedTopics = [] } = route.params || {};
  const [chosen, setChosen] = useState(null);

  return (
    <Screen>
      <Header title="" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.heading}>Who would you like to talk to?</Text>
        <Text style={s.sub}>Choose the type of support that feels right for you.</Text>

        {/* Topic pills */}
        <View style={s.topicRow}>
          {selectedTopics.map((t) => (
            <View key={t} style={s.topicPill}>
              <Text style={s.topicPillText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* Cards */}
        {SUPPORT_TYPES.map((type) => {
          const active = chosen === type.id;
          return (
            <TouchableOpacity
              key={type.id}
              style={[s.card, active && { borderColor: type.color, borderWidth: 2 }]}
              onPress={() => setChosen(type.id)}
              activeOpacity={0.85}
            >
              <View style={s.cardHeader}>
                <View style={[s.iconCircle, { backgroundColor: type.color + '18' }]}>
                  <Ionicons name={type.icon} size={24} color={type.color} />
                </View>
                {active && (
                  <View style={[s.checkCircle, { backgroundColor: type.color }]}>
                    <Ionicons name="checkmark" size={16} color={colors.white} />
                  </View>
                )}
              </View>
              <Text style={s.cardLabel}>{type.label}</Text>
              <View style={s.badgeWrap}>
                <Text style={[s.badgeText, { color: type.color }]}>{type.badge}</Text>
              </View>
              <Text style={s.cardSub}>{type.subtitle}</Text>
              <Text style={s.price}>{type.price}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      {chosen && (
        <View style={s.footer}>
          <PrimaryButton
            title="Continue"
            onPress={() =>
              navigation.navigate('ChooseConnectionMode', {
                selectedTopics,
                supportType: chosen,
              })
            }
          />
        </View>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: 160,
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
    marginBottom: spacing.md,
  },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  topicPill: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
  },
  topicPillText: {
    fontSize: font.xs,
    fontWeight: '500',
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  badgeWrap: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  badgeText: {
    fontSize: font.caption,
    fontWeight: '600',
  },
  cardSub: {
    fontSize: font.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.textMuted,
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
