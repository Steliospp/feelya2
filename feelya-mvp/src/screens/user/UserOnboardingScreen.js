import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { Button } from '../../components/UI';
import { useApp } from '../../store/AppContext';

export default function UserOnboardingScreen({ navigation }) {
  const { dispatch } = useApp();
  const [name, setName] = useState('');

  const proceed = () => {
    if (!name.trim()) return;
    dispatch({ type: 'SET_USER_NAME', payload: name.trim() });
    dispatch({ type: 'SET_ONBOARDED' });
    navigation.replace('UserHome');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>What should we call you?</Text>
        <Text style={styles.subtitle}>
          Just a first name or nickname — nothing formal.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
          autoFocus
          maxLength={30}
          returnKeyType="done"
          onSubmitEditing={proceed}
        />
      </View>
      <View style={styles.footer}>
        <Button title="Continue" onPress={proceed} disabled={!name.trim()} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 120,
  },
  title: {
    fontSize: font.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: font.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: font.xl,
    color: colors.text,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: colors.border,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
