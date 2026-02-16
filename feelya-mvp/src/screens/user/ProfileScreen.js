import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import {
  Screen, Card, Avatar, ListRow, Divider, SafetyBanner,
  SecondaryButton, BottomSheet, SectionTitle, Input,
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

  // Compute stats
  const conversationsStarted = state.userSessions.length + state.bookings.length;
  const conversationsCompleted = state.userSessions.length + state.bookings.filter((b) => b.status === 'completed').length;
  const totalMinutes = state.userSessions.reduce((sum, s) => sum + (s.minutes || 0), 0);
  const hoursSpent = (totalMinutes / 60).toFixed(1);
  const communityPosts = state.threads.filter((t) => t.author === state.userName).length;

  // Get unique guides user has chatted with
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
        <Text style={s.title}>Profile</Text>

        {/* Profile card */}
        <Card style={s.userCard}>
          <View style={s.userRow}>
            <Avatar name={state.userName} size={64} />
            <View style={s.userInfo}>
              <Text style={s.userName}>{state.userName || 'User'}</Text>
              {state.userBio ? (
                <Text style={s.userBio} numberOfLines={2}>{state.userBio}</Text>
              ) : (
                <TouchableOpacity onPress={() => setEditingBio(true)}>
                  <Text style={s.addBio}>Add a bio</Text>
                </TouchableOpacity>
              )}
              <Text style={s.joinedDate}>Joined {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</Text>
            </View>
          </View>
          {state.userBio ? (
            <TouchableOpacity onPress={() => setEditingBio(true)} style={s.editBioBtn}>
              <Ionicons name="create-outline" size={16} color={colors.primary} />
              <Text style={s.editBioText}>Edit bio</Text>
            </TouchableOpacity>
          ) : null}
        </Card>

        {/* Stats */}
        <Card style={s.statsCard}>
          <View style={s.statsGrid}>
            <StatItem label="Conversations" value={conversationsStarted} />
            <StatItem label="Completed" value={conversationsCompleted} />
            <StatItem label="Hours" value={hoursSpent} />
            <StatItem label="Posts" value={communityPosts} />
          </View>
        </Card>

        {/* My Guides */}
        {myGuides.length > 0 && (
          <>
            <SectionTitle>My Guides</SectionTitle>
            {myGuides.map((guide) => (
              <Card
                key={guide.id}
                style={s.guideCard}
                onPress={() => navigation.navigate('Home', { screen: 'GuideProfile', params: { guideId: guide.id } })}
              >
                <View style={s.guideRow}>
                  <Avatar name={guide.name} size={44} />
                  <View style={s.guideInfo}>
                    <Text style={s.guideName}>{guide.name}</Text>
                    <Text style={s.guideBio} numberOfLines={1}>{guide.bio}</Text>
                    <View style={s.guideRating}>
                      <Ionicons name="star" size={12} color={colors.warning} />
                      <Text style={s.guideRatingText}>{guide.rating}</Text>
                      <Text style={s.guideConvos}> -- {guide.conversations} conversations</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </View>
              </Card>
            ))}
          </>
        )}

        {/* Settings */}
        <SectionTitle style={{ marginTop: spacing.sm }}>Settings</SectionTitle>
        <Card style={s.menuCard}>
          <ListRow
            icon="shield-checkmark-outline"
            title="Safety & Resources"
            subtitle="Crisis lines and support info"
            onPress={() => setShowSafety(true)}
          />
          <Divider style={{ marginVertical: 0 }} />
          <ListRow
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your notification preferences"
            onPress={() => {}}
          />
          <Divider style={{ marginVertical: 0 }} />
          <ListRow
            icon="information-circle-outline"
            title="About Feelya"
            subtitle="What we do and how it works"
            onPress={() => setShowAbout(true)}
          />
        </Card>

        <SecondaryButton
          title="Reset App"
          onPress={resetApp}
          style={{ marginTop: spacing.lg }}
        />

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
      <BottomSheet visible={editingBio} onClose={() => setEditingBio(false)} title="Edit Bio">
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

function StatItem({ label, value }) {
  return (
    <View style={s.statItem}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { padding: spacing.screenPadding, paddingTop: spacing.xxl, paddingBottom: 100 },
  title: { fontSize: font.title, fontWeight: '600', color: colors.text, marginBottom: spacing.lg },

  /* User card */
  userCard: { marginBottom: spacing.md },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  userInfo: { flex: 1, marginLeft: spacing.md },
  userName: { fontSize: font.lg, fontWeight: '600', color: colors.text },
  userBio: { fontSize: font.caption, color: colors.textSecondary, marginTop: 2, lineHeight: 18 },
  addBio: { fontSize: font.caption, color: colors.primary, fontWeight: '500', marginTop: 2 },
  joinedDate: { fontSize: font.xs, color: colors.textMuted, marginTop: 4 },
  editBioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  editBioText: { fontSize: font.caption, color: colors.primary, fontWeight: '500', marginLeft: 4 },

  /* Stats */
  statsCard: { marginBottom: spacing.lg },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: font.xl, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: font.xs, color: colors.textMuted, marginTop: 2 },

  /* Guides */
  guideCard: { marginBottom: spacing.sm },
  guideRow: { flexDirection: 'row', alignItems: 'center' },
  guideInfo: { flex: 1, marginLeft: 12 },
  guideName: { fontSize: font.body, fontWeight: '600', color: colors.text },
  guideBio: { fontSize: font.caption, color: colors.textSecondary, marginTop: 1 },
  guideRating: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  guideRatingText: { fontSize: font.xs, fontWeight: '600', color: colors.text, marginLeft: 3 },
  guideConvos: { fontSize: font.xs, color: colors.textMuted },

  /* Settings */
  menuCard: { marginBottom: spacing.sm, paddingHorizontal: 0, paddingVertical: 0 },
  version: { fontSize: font.xs, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg },

  /* Bottom sheets */
  resourceSection: { marginTop: spacing.md },
  resourceTitle: { fontSize: font.section, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  resourceText: { fontSize: font.caption, color: colors.textSecondary, lineHeight: 22 },
  aboutText: { fontSize: font.body, color: colors.textSecondary, lineHeight: 22 },
  aboutVersion: { fontSize: font.caption, color: colors.textMuted },
  charCount: { fontSize: font.xs, color: colors.textMuted, textAlign: 'right', marginTop: spacing.xs },
});
