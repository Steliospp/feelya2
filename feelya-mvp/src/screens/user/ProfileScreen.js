import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import {
  Screen, Card, Avatar, ListRow, Divider, SafetyBanner,
  SecondaryButton, BottomSheet, Input,
} from '../../components/UI';
import { useApp, MOCK_GUIDES } from '../../store/AppContext';

export default function ProfileScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [showSafety, setShowSafety] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState(state.userBio || '');

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

  const saveBio = () => {
    dispatch({ type: 'SET_USER_BIO', payload: bioText });
    setEditingBio(false);
  };

  // Guides count
  const chattedGuideIds = [
    ...new Set([
      ...state.userSessions.map((s) => s.guideId),
      ...state.bookings.map((b) => b.guideId),
    ]),
  ];
  const myGuides = MOCK_GUIDES.filter((g) => chattedGuideIds.includes(g.id));

  return (
    <Screen>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={s.header}>
          <Avatar name={state.userName} size={72} />
          <Text style={s.userName}>{state.userName || 'User'}</Text>
          {state.userBio ? (
            <Text style={s.userBio}>{state.userBio}</Text>
          ) : null}
          <Text style={s.joinedDate}>
            Member since {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity
            style={s.editProfileBtn}
            onPress={() => setEditingBio(true)}
          >
            <Ionicons name="create-outline" size={16} color={colors.primary} />
            <Text style={s.editProfileText}>{state.userBio ? 'Edit profile' : 'Add bio'}</Text>
          </TouchableOpacity>
        </View>

        {/* Activity group */}
        <Text style={s.groupLabel}>Activity</Text>
        <Card style={s.menuCard}>
          <ListRow
            icon="people-outline"
            title="My Guides"
            subtitle={`${myGuides.length} guide${myGuides.length !== 1 ? 's' : ''}`}
            onPress={() => navigation.navigate('MyGuides')}
          />
          <Divider style={s.rowDivider} />
          <ListRow
            icon="bookmark-outline"
            title="Saved Discussions"
            subtitle={`${state.bookmarkedThreads.length} saved`}
            onPress={() => navigation.navigate('SavedDiscussions')}
          />
        </Card>

        {/* General group */}
        <Text style={s.groupLabel}>General</Text>
        <Card style={s.menuCard}>
          <ListRow
            icon="card-outline"
            title="Payment"
            subtitle="Manage payment methods"
            onPress={() => {}}
          />
          <Divider style={s.rowDivider} />
          <ListRow
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage alerts and reminders"
            onPress={() => {}}
          />
        </Card>

        {/* Privacy & Security group */}
        <Text style={s.groupLabel}>Privacy & Security</Text>
        <Card style={s.menuCard}>
          <ListRow
            icon="lock-closed-outline"
            title="Security"
            subtitle="Password, login settings"
            onPress={() => {}}
          />
          <Divider style={s.rowDivider} />
          <ListRow
            icon="eye-off-outline"
            title="Privacy"
            subtitle="Data and visibility preferences"
            onPress={() => {}}
          />
        </Card>

        {/* Support group */}
        <Text style={s.groupLabel}>Support</Text>
        <Card style={s.menuCard}>
          <ListRow
            icon="help-circle-outline"
            title="Help"
            subtitle="FAQs and contact support"
            onPress={() => {}}
          />
          <Divider style={s.rowDivider} />
          <ListRow
            icon="shield-checkmark-outline"
            title="Safety & Resources"
            subtitle="Crisis lines and support info"
            onPress={() => setShowSafety(true)}
          />
          <Divider style={s.rowDivider} />
          <ListRow
            icon="information-circle-outline"
            title="About Feelya"
            subtitle="What we do and how it works"
            onPress={() => setShowAbout(true)}
          />
        </Card>

        {/* Danger zone */}
        <Card style={s.menuCard}>
          <ListRow
            icon="log-out-outline"
            title="Log Out"
            onPress={() => {}}
          />
          <Divider style={s.rowDivider} />
          <ListRow
            icon="refresh-outline"
            title="Reset App"
            subtitle="Clear all data"
            onPress={resetApp}
          />
        </Card>

        <Text style={s.version}>v2.0.0</Text>
      </ScrollView>

      {/* Safety Bottom Sheet */}
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

      {/* About Bottom Sheet */}
      <BottomSheet visible={showAbout} onClose={() => setShowAbout(false)} title="About Feelya">
        <Text style={s.aboutText}>
          Feelya is a place to talk things through with real people.
          This is not therapy, counseling, or medical advice.
        </Text>
        <Divider />
        <Text style={s.aboutVersion}>Version 2.0.0</Text>
      </BottomSheet>

      {/* Edit Bio Bottom Sheet */}
      <BottomSheet visible={editingBio} onClose={() => setEditingBio(false)} title="Edit Profile">
        <Input
          placeholder="Tell others a bit about yourself..."
          value={bioText}
          onChangeText={setBioText}
          multiline
          maxLength={160}
          autoFocus
        />
        <Text style={s.charCount}>{bioText.length}/160</Text>
        <SecondaryButton
          title="Save"
          variant="soft"
          onPress={saveBio}
          style={{ marginTop: spacing.md }}
        />
      </BottomSheet>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: {
    padding: spacing.screenPadding,
    paddingTop: spacing.xxl,
    paddingBottom: 140,
  },

  /* Header */
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  userName: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  userBio: {
    fontSize: font.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 19,
    paddingHorizontal: spacing.xl,
  },
  joinedDate: {
    fontSize: font.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  editProfileText: {
    fontSize: font.caption,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },

  /* Group labels */
  groupLabel: {
    fontSize: font.xs,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    marginLeft: spacing.xs,
  },

  /* Menu cards */
  menuCard: {
    marginBottom: spacing.sm,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  rowDivider: {
    marginVertical: 0,
    marginLeft: spacing.screenPadding + 36 + 12,
  },

  version: {
    fontSize: font.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  /* Bottom sheets */
  resourceSection: { marginTop: spacing.md },
  resourceTitle: { fontSize: font.section, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  resourceText: { fontSize: font.caption, color: colors.textSecondary, lineHeight: 22 },
  aboutText: { fontSize: font.body, color: colors.textSecondary, lineHeight: 22 },
  aboutVersion: { fontSize: font.caption, color: colors.textMuted },
  charCount: { fontSize: font.xs, color: colors.textMuted, textAlign: 'right', marginTop: spacing.xs },
});
