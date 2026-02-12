import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { Card, Avatar, Badge, Divider, SafetyBanner } from '../../components/UI';
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Hey, {state.guideName || 'Guide'}</Text>
        <Text style={styles.tagline}>Ready to help someone today?</Text>

        {/* Online toggle */}
        <Card style={styles.onlineCard}>
          <View style={styles.onlineRow}>
            <View>
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
            <Text style={styles.statValue}>${state.guideEarnings.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{state.guideSessions.length}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </Card>
          <Card style={styles.statCard}>
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
          {state.guideVerified && <Badge label="Verified" color={colors.success} />}
        </Card>

        <SafetyBanner compact />
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.tabBtn, styles.tabActive]}>
          <Text style={styles.tabIcon}>{'\u{1F3E0}'}</Text>
          <Text style={[styles.tabLabel, { color: colors.primary }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => navigation.navigate('GuideEarnings')}
        >
          <Text style={styles.tabIcon}>{'\u{1F4B0}'}</Text>
          <Text style={styles.tabLabel}>Earnings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.tabIcon}>{'\u2699\uFE0F'}</Text>
          <Text style={styles.tabLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    padding: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: 100,
  },
  greeting: {
    fontSize: font.xxl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  tagline: {
    fontSize: font.md,
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
  onlineDesc: { fontSize: font.sm, color: colors.textSecondary, marginTop: 4 },
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
  profileBio: { fontSize: font.sm, color: colors.textSecondary, marginTop: 4 },
  topicRow: { flexDirection: 'row', flexWrap: 'wrap' },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  tabActive: {},
  tabIcon: { fontSize: 20 },
  tabLabel: { fontSize: font.xs, color: colors.textMuted, marginTop: 4 },
});
