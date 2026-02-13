import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font } from '../../theme';
import { Screen, Input, PrimaryButton } from '../../components/UI';
import { useApp } from '../../store/AppContext';

export default function GuideOnboardingScreen({ navigation }) {
  const { dispatch } = useApp();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  const proceed = () => {
    if (!name.trim()) return;
    dispatch({ type: 'SET_GUIDE_NAME', payload: name.trim() });
    dispatch({ type: 'SET_GUIDE_BIO', payload: bio.trim() });
    dispatch({ type: 'SET_ONBOARDED' });
    navigation.replace('GuideTopicsAndRate');
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.iconRow}>
            <Ionicons name="person-circle-outline" size={40} color={colors.accent} />
          </View>
          <Text style={styles.title}>Set up your{'\n'}guide profile</Text>
          <Text style={styles.subtitle}>
            People will see this when you're matched.
          </Text>

          <Input
            label="Your name"
            placeholder="First name or nickname"
            value={name}
            onChangeText={setName}
            autoFocus
            maxLength={30}
            icon="person-outline"
          />

          <Input
            label="Short bio"
            placeholder="A sentence or two about what you can help with..."
            value={bio}
            onChangeText={setBio}
            multiline
            maxLength={150}
            style={{ marginTop: spacing.lg }}
          />
          <Text style={styles.charCount}>{bio.length}/150</Text>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title="Continue"
            onPress={proceed}
            disabled={!name.trim()}
            icon="arrow-forward"
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xxl + spacing.lg,
  },
  iconRow: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: font.hero,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 42,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: font.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  charCount: {
    fontSize: font.xs,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
});
