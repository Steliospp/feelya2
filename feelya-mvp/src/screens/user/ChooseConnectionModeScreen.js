import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import { Screen, Header } from '../../components/UI';
import { MOCK_PROVIDERS, SESSION_MODES, useApp } from '../../store/AppContext';

export default function ChooseConnectionModeScreen({ navigation, route }) {
  const { dispatch } = useApp();
  const { selectedTopics = [], supportType = 'guide' } = route.params || {};
  const [sessionMode, setSessionMode] = useState('chat');

  const onlineCount = MOCK_PROVIDERS.filter(
    (p) => p.type === supportType && p.online,
  ).length;

  const handleStartNow = () => {
    dispatch({ type: 'SET_SESSION_MODE', payload: sessionMode });
    const onlineProviders = MOCK_PROVIDERS.filter(
      (p) => p.type === supportType && p.online,
    );
    if (onlineProviders.length === 0) {
      navigation.navigate('BrowseOnline', {
        selectedTopics,
        supportType,
        sessionMode,
        fallbackMessage: 'No one is available right now. Browse who\'s online instead.',
      });
    } else {
      navigation.navigate('Matching', {
        selectedTopics,
        supportType,
        sessionMode,
        autoMatch: true,
      });
    }
  };

  return (
    <Screen>
      <Header title="" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.heading}>How would you like to connect?</Text>
        <Text style={s.sub}>Choose your session type, then pick how to get started.</Text>

        {/* Session mode selector */}
        <View style={s.modeRow}>
          {SESSION_MODES.map((m) => {
            const active = sessionMode === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[s.modeChip, active && s.modeChipActive]}
                onPress={() => setSessionMode(m.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={m.icon}
                  size={18}
                  color={active ? colors.white : colors.textSecondary}
                />
                <Text style={[s.modeLabel, active && s.modeLabelActive]}>{m.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Start Now - PRIMARY */}
        <TouchableOpacity style={s.primaryCard} onPress={handleStartNow} activeOpacity={0.85}>
          <View style={s.cardRow}>
            <View style={s.primaryIconCircle}>
              <Ionicons name="flash" size={24} color={colors.white} />
            </View>
            <View style={s.cardContent}>
              <Text style={s.primaryLabel}>Start now</Text>
              <Text style={s.primarySub}>Get matched instantly with someone available.</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={colors.white + 'AA'} />
          </View>
          {onlineCount > 0 && (
            <View style={s.onlineBadge}>
              <View style={s.onlineDot} />
              <Text style={s.onlineText}>{onlineCount} online now</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Browse Online - SECONDARY */}
        <TouchableOpacity
          style={s.secondaryCard}
          onPress={() =>
            navigation.navigate('BrowseOnline', { selectedTopics, supportType, sessionMode })
          }
          activeOpacity={0.85}
        >
          <View style={s.cardRow}>
            <View style={[s.secondaryIconCircle, { backgroundColor: colors.success + '18' }]}>
              <Ionicons name="people" size={22} color={colors.success} />
            </View>
            <View style={s.cardContent}>
              <Text style={s.secondaryLabel}>See who's available</Text>
              <Text style={s.secondarySub}>Choose someone currently online.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Schedule - TERTIARY */}
        <TouchableOpacity
          style={s.secondaryCard}
          onPress={() =>
            navigation.navigate('ScheduleSession', { selectedTopics, supportType, sessionMode })
          }
          activeOpacity={0.85}
        >
          <View style={s.cardRow}>
            <View style={[s.secondaryIconCircle, { backgroundColor: colors.accent + '18' }]}>
              <Ionicons name="calendar" size={22} color={colors.accent} />
            </View>
            <View style={s.cardContent}>
              <Text style={s.secondaryLabel}>Schedule a session</Text>
              <Text style={s.secondarySub}>Book time with someone you choose.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: 120,
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
  /* Mode selector */
  modeRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  modeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceLight,
    marginRight: spacing.sm,
  },
  modeChipActive: {
    backgroundColor: colors.primary,
  },
  modeLabel: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  modeLabelActive: {
    color: colors.white,
  },
  /* Primary card */
  primaryCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.fab,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  primaryLabel: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 2,
  },
  primarySub: {
    fontSize: font.caption,
    color: colors.white + 'CC',
    lineHeight: 19,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    backgroundColor: colors.white + '18',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  onlineText: {
    fontSize: font.xs,
    fontWeight: '600',
    color: colors.white,
  },
  /* Secondary cards */
  secondaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  secondaryIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    fontSize: font.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  secondarySub: {
    fontSize: font.caption,
    color: colors.textSecondary,
    lineHeight: 19,
  },
});
