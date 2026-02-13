import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font } from '../../theme';
import {
  Screen,
  Card,
  Avatar,
  Badge,
  Divider,
  SafetyBanner,
  SecondaryButton,
} from '../../components/UI';
import { useApp } from '../../store/AppContext';

const MOCK_USER_NAMES = ['Alex', 'Casey', 'Jamie', 'Riley', 'Taylor'];
const MOCK_MODES = ['chat', 'voice', 'video'];

export default function GuideHomeScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const requestTimeoutRef = React.useRef(null);

  // Simulate incoming request when online
  useEffect(() => {
    if (state.guideOnline && !state.guideIncomingRequest && !state.guideActiveSession) {
      requestTimeoutRef.current = setTimeout(() => {
        const userName = MOCK_USER_NAMES[Math.floor(Math.random() * MOCK_USER_NAMES.length)];
        const mode = MOCK_MODES[Math.floor(Math.random() * MOCK_MODES.length)];
        // Pick 1-3 topics from guide's topics
        const shuffled = [...state.guideTopics].sort(() => Math.random() - 0.5);
        const topics = shuffled.slice(0, Math.min(3, Math.max(1, shuffled.length)));
        const estimatedMins = 5 + Math.floor(Math.random() * 25);
        dispatch({
          type: 'SET_GUIDE_INCOMING',
          payload: {
            userName,
            topics,
            mode,
            estimatedEarnings: +(estimatedMins * state.guideRate).toFixed(2),
            estimatedMins,
          },
        });
      }, 4000 + Math.random() * 4000);
      return () => clearTimeout(requestTimeoutRef.current);
    }
  }, [state.guideOnline, state.guideIncomingRequest, state.guideActiveSession]);

  // Navigate to incoming request
  useEffect(() => {
    if (state.guideIncomingRequest) {
      navigation.navigate('IncomingRequest');
    }
  }, [state.guideIncomingRequest]);

  const toggleOnline = (val) => {
    dispatch({ type: 'SET_GUIDE_ONLINE', payload: val });
    if (!val) {
      clearTimeout(requestTimeoutRef.current);
      dispatch({ type: 'SET_GUIDE_INCOMING', payload: null });
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Hey, {state.guideName || 'Guide'}</Text>
        <Text style={styles.tagline}>Ready to help someone today?</Text>

        {/* Online toggle */}
        <Card style={styles.onlineCard}>
          <View style={styles.onlineRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.onlineLabel}>
                {state.guideOnline ? 'You\u2019re Online' : 'You\u2019re Offline'}
              </Text>
              <Text style={styles.onlineDesc}>
                {state.guideOnline
                  ? 'Waiting for incoming requests...'
                  : 'Go online to start receiving requests'}
              </Text>
            </View>
            <Switch
              value={state.guideOnline}
              onValueChange={toggleOnline}
              trackColor={{ false: colors.border, true: colors.success + '88' }}
              thumbColor={state.guideOnline ? colors.success : colors.textMuted}
            />
          </View>
          {state.guideOnline && (
            <View style={styles.onlinePulse}>
              <View style={styles.onlineDot} />
            </View>
          )}
        </Card>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Ionicons name="wallet-outline" size={18} color={colors.accent} style={{ marginBottom: spacing.xs }} />
            <Text style={styles.statValue}>${state.guideEarnings.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="chatbubbles-outline" size={18} color={colors.accent} style={{ marginBottom: spacing.xs }} />
            <Text style={styles.statValue}>{state.guideSessions.length}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="pricetag-outline" size={18} color={colors.accent} style={{ marginBottom: spacing.xs }} />
            <Text style={styles.statValue}>${state.guideRate.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Rate/min</Text>
          </Card>
        </View>

        {/* Profile summary */}
        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.profileRow}>
            <Avatar name={state.guideName} size={48} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{state.guideName}</Text>
              <Text style={styles.profileBio} numberOfLines={2}>
                {state.guideBio || 'No bio set'}
              </Text>
            </View>
          </View>
          <Divider />
          <View style={styles.topicRow}>
            {state.guideTopics.map((t) => (
              <Badge key={t} label={t} />
            ))}
          </View>
          {state.guideVerified && <Badge label="Verified" color={colors.success} icon="shield-checkmark" />}
        </Card>

        <SafetyBanner compact />
      </ScrollView>

      {/* Bottom bar with SecondaryButtons */}
      <View style={styles.bottomBar}>
        <SecondaryButton
          title="Earnings"
          icon="wallet-outline"
          variant="soft"
          onPress={() => navigation.navigate('GuideEarnings')}
          style={styles.bottomBtn}
        />
        <SecondaryButton
          title="Settings"
          icon="settings-outline"
          variant="ghost"
          onPress={() => navigation.navigate('Settings')}
          style={styles.bottomBtn}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.screenPadding,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: 100,
  },
  greeting: {
    fontSize: font.title,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  tagline: {
    fontSize: font.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  onlineCard: {
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  onlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  onlineLabel: { fontSize: font.lg, fontWeight: '700', color: colors.text },
  onlineDesc: { fontSize: font.caption, color: colors.textSecondary, marginTop: 4 },
  onlinePulse: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  statValue: { fontSize: font.xl, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: font.xs, color: colors.textMuted, marginTop: 4 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  profileInfo: { flex: 1, marginLeft: spacing.md },
  profileName: { fontSize: font.lg, fontWeight: '700', color: colors.text },
  profileBio: { fontSize: font.caption, color: colors.textSecondary, marginTop: 4 },
  topicRow: { flexDirection: 'row', flexWrap: 'wrap' },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bottomBtn: {
    flex: 1,
    height: 48,
  },
});
