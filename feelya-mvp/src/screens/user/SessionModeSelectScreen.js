import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import { Screen, Header, PrimaryButton, Card } from '../../components/UI';
import { useApp, SESSION_MODES } from '../../store/AppContext';

export default function SessionModeSelectScreen({ navigation }) {
  const { dispatch } = useApp();
  const [mode, setMode] = useState(null);

  const proceed = () => {
    if (!mode) return;
    dispatch({ type: 'SET_SESSION_MODE', payload: mode });
    navigation.navigate('Matching');
  };

  return (
    <Screen>
      <Header title="Session Mode" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>How do you want to connect?</Text>
        <Text style={styles.subtitle}>Choose a session format.</Text>

        {SESSION_MODES.map((m) => {
          const isSelected = mode === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              activeOpacity={0.8}
              onPress={() => setMode(m.id)}
            >
              <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
                <Ionicons
                  name={m.icon}
                  size={24}
                  color={isSelected ? colors.white : colors.primary}
                />
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{m.label}</Text>
                <Text style={styles.cardDesc}>{m.desc}</Text>
              </View>

              <View style={[styles.radio, isSelected && styles.radioOn]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Next"
          onPress={proceed}
          disabled={!mode}
          icon="arrow-forward-outline"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: 140,
  },
  title: {
    fontSize: font.title,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: font.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  cardSelected: {
    backgroundColor: colors.primaryLight,
    ...shadow.cardHover,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconWrapSelected: {
    backgroundColor: colors.primary,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.text,
  },
  cardDesc: {
    fontSize: font.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
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
    borderRadius: radius.lg,
    ...shadow.card,
  },
});
