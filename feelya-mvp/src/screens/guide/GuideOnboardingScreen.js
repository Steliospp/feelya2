import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { Button } from '../../components/UI';
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Set up your{'\n'}guide profile</Text>
        <Text style={styles.subtitle}>
          People will see this when you're matched.
        </Text>

        <Text style={styles.label}>Your name</Text>
        <TextInput
          style={styles.input}
          placeholder="First name or nickname"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
          autoFocus
          maxLength={30}
        />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Short bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="A sentence or two about what you can help with..."
          placeholderTextColor={colors.textMuted}
          value={bio}
          onChangeText={setBio}
          multiline
          maxLength={150}
        />
        <Text style={styles.charCount}>{bio.length}/150</Text>
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
    paddingTop: spacing.xxl + spacing.lg,
  },
  title: {
    fontSize: font.hero,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 42,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: font.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: font.sm,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: font.lg,
    color: colors.text,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: font.md,
    fontWeight: '400',
  },
  charCount: {
    fontSize: font.xs,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
