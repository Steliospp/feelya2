import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Screen, Input, PrimaryButton } from '../../components/UI';
import { colors, spacing, font } from '../../theme';
import { useApp } from '../../store/AppContext';

export default function UserOnboardingScreen({ navigation }) {
  const { dispatch } = useApp();
  const [name, setName] = useState('');

  const proceed = () => {
    if (!name.trim()) return;
    dispatch({ type: 'SET_USER_NAME', payload: name.trim() });
    dispatch({ type: 'SET_ONBOARDED' });
    navigation.replace('UserTabs');
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.title}>What should we call you?</Text>
          <Text style={styles.subtitle}>
            Just a first name or nickname -- nothing formal.
          </Text>
          <Input
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoFocus
            maxLength={30}
            returnKeyType="done"
            onSubmitEditing={proceed}
            icon="person-outline"
            inputStyle={styles.inputText}
          />
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title="Continue"
            onPress={proceed}
            disabled={!name.trim()}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 120,
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
  inputText: {
    fontSize: font.xl,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
});
