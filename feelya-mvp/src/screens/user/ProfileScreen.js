import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { colors, spacing, radius, font, shadow } from '../../theme';
import {
  Screen, Card, Avatar, ListRow, Divider, SafetyBanner,
  SecondaryButton, BottomSheet, SectionTitle,
} from '../../components/UI';
import { useApp } from '../../store/AppContext';

export default function ProfileScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [showSafety, setShowSafety] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const resetApp = () => {
    Alert.alert('Reset App', 'This will clear all data and return to the start screen.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          dispatch({ type: 'RESET' });
          navigation.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: 'Splash' }] })
          );
        },
      },
    ]);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Profile</Text>

        <Card style={s.userCard}>
          <View style={s.userRow}>
            <Avatar name={state.userName} size={56} />
            <View style={s.userInfo}>
              <Text style={s.userName}>{state.userName || 'User'}</Text>
              <Text style={s.userRole}>Seeker</Text>
            </View>
          </View>
        </Card>

        <Card style={s.menuCard}>
          <ListRow
            icon="shield-checkmark-outline"
            title="Safety & Resources"
            subtitle="Crisis lines and support info"
            onPress={() => setShowSafety(true)}
          />
          <Divider style={{ marginVertical: 0 }} />
          <ListRow
            icon="information-circle-outline"
            title="About Feelya"
            subtitle="What we do and how it works"
            onPress={() => setShowAbout(true)}
          />
        </Card>

        <SafetyBanner />

        <SecondaryButton
          title="Reset App"
          onPress={resetApp}
          style={{ marginTop: spacing.lg }}
        />

        <Text style={s.version}>v1.0.0</Text>
      </ScrollView>

      <BottomSheet visible={showSafety} onClose={() => setShowSafety(false)} title="Safety & Resources">
        <SafetyBanner />
        <View style={s.resourceSection}>
          <Text style={s.resourceTitle}>Crisis Resources</Text>
          <Text style={s.resourceText}>
            988 Suicide & Crisis Lifeline{'\n'}
            Call or text 988 -- available 24/7
          </Text>
          <Text style={[s.resourceText, { marginTop: spacing.md }]}>
            Crisis Text Line{'\n'}
            Text HOME to 741741
          </Text>
        </View>
      </BottomSheet>

      <BottomSheet visible={showAbout} onClose={() => setShowAbout(false)} title="About Feelya">
        <Text style={s.aboutText}>
          Feelya connects you with peer support for on-demand coaching and encouragement.
          This is not therapy, counseling, or medical advice.
        </Text>
        <Divider />
        <Text style={s.aboutVersion}>Version 1.0.0 (MVP)</Text>
      </BottomSheet>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: { padding: spacing.screenPadding, paddingTop: spacing.xxl },
  title: { fontSize: font.title, fontWeight: '600', color: colors.text, marginBottom: spacing.lg },
  userCard: { marginBottom: spacing.md },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  userInfo: { marginLeft: spacing.md },
  userName: { fontSize: font.lg, fontWeight: '600', color: colors.text },
  userRole: { fontSize: font.caption, color: colors.primary, fontWeight: '500', marginTop: 2 },
  menuCard: { marginBottom: spacing.lg, paddingHorizontal: 0, paddingVertical: 0 },
  version: { fontSize: font.xs, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg },
  resourceSection: { marginTop: spacing.md },
  resourceTitle: { fontSize: font.section, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  resourceText: { fontSize: font.caption, color: colors.textSecondary, lineHeight: 22 },
  aboutText: { fontSize: font.body, color: colors.textSecondary, lineHeight: 22 },
  aboutVersion: { fontSize: font.caption, color: colors.textMuted },
});
