import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { Button } from '../../components/UI';
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
    <View style={styles.container}>
      <Text style={styles.title}>How do you want{'\n'}to connect?</Text>
      <Text style={styles.subtitle}>Choose a session format.</Text>

      {SESSION_MODES.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={[styles.card, mode === m.id && styles.cardSelected]}
          activeOpacity={0.8}
          onPress={() => setMode(m.id)}
        >
          <Text style={styles.icon}>{m.icon}</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{m.label}</Text>
            <Text style={styles.cardDesc}>{m.desc}</Text>
          </View>
          <View style={[styles.radio, mode === m.id && styles.radioOn]}>
            {mode === m.id && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.footer}>
        <Button title="Next" onPress={proceed} disabled={!mode} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  title: {
    fontSize: font.xxl,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 34,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: font.md,
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
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  icon: { fontSize: 28, marginRight: spacing.md },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: font.lg, fontWeight: '700', color: colors.text },
  cardDesc: { fontSize: font.sm, color: colors.textSecondary, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: colors.primary },
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
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
