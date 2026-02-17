import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../theme';

const MOODS = [
  { key: 'calm', label: 'I feel calm' },
  { key: 'okay', label: 'I feel okay' },
  { key: 'overwhelmed', label: 'I feel overwhelmed' },
  { key: 'anxious', label: 'I feel anxious' },
  { key: 'low', label: 'I feel low' },
  { key: 'frustrated', label: 'I feel frustrated' },
  { key: 'drained', label: 'I feel drained' },
];

const SUPPORTIVE_LINES = {
  calm: "Let's keep it steady.",
  okay: 'A simple check-in is still progress.',
  overwhelmed: 'One step at a time. Want to lighten the load?',
  anxious: 'We can slow this down together.',
  low: "You don't have to carry this alone.",
  frustrated: 'It makes sense to feel this way.',
  drained: "Let's reset gently.",
};

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `mood_${y}-${m}-${day}`;
}

export default function MoodCheckInCard({ onMoodChange, style }) {
  const [index, setIndex] = useState(1); // default to "okay"

  useEffect(() => {
    AsyncStorage.getItem(todayKey()).then((val) => {
      if (val) {
        const found = MOODS.findIndex((m) => m.key === val);
        if (found >= 0) {
          setIndex(found);
          onMoodChange?.(val);
        }
      } else {
        onMoodChange?.(MOODS[1].key);
      }
    });
  }, []);

  const persist = (newIndex) => {
    const mood = MOODS[newIndex].key;
    AsyncStorage.setItem(todayKey(), mood);
    onMoodChange?.(mood);
  };

  const goLeft = () => {
    const next = index === 0 ? MOODS.length - 1 : index - 1;
    setIndex(next);
    persist(next);
  };

  const goRight = () => {
    const next = index === MOODS.length - 1 ? 0 : index + 1;
    setIndex(next);
    persist(next);
  };

  const mood = MOODS[index];

  return (
    <View style={[s.wrapper, style]}>
      <View style={s.card}>
        <TouchableOpacity
          onPress={goLeft}
          style={s.arrow}
          activeOpacity={0.6}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={s.labelWrap}>
          <Text style={s.label}>{mood.label}</Text>
        </View>

        <TouchableOpacity
          onPress={goRight}
          style={s.arrow}
          activeOpacity={0.6}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <Text style={s.supportive}>{SUPPORTIVE_LINES[mood.key]}</Text>
    </View>
  );
}

export { MOODS, SUPPORTIVE_LINES };

const s = StyleSheet.create({
  wrapper: {},
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    ...shadow.card,
  },
  arrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: font.xl,
    fontWeight: '600',
    color: colors.text,
  },
  supportive: {
    fontSize: font.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm + 2,
    lineHeight: 18,
  },
});
