import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors, spacing, radius, font, shadow } from '../../theme';
import { Screen, SecondaryButton, Pill } from '../../components/UI';
import { useApp, matchGuide } from '../../store/AppContext';

export default function MatchingScreen({ navigation, route }) {
  const { state, dispatch } = useApp();
  const [eta, setEta] = useState(null);
  const [dots, setDots] = useState('');
  const skipId = route.params?.skipGuideId ?? null;

  // Pulsing orb animation
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.35,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Dot animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Matching logic
  useEffect(() => {
    dispatch({ type: 'SET_MATCHING', payload: true });
    const guide = matchGuide(state.selectedTopics, skipId);
    if (!guide) {
      navigation.goBack();
      return;
    }
    setEta(guide.responseTime);

    const delay = Math.max(3000, guide.responseTime * 1000);
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_MATCHED_GUIDE', payload: guide });
      navigation.replace('GuideFound');
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  const cancel = () => {
    dispatch({ type: 'SET_MATCHING', payload: false });
    navigation.goBack();
  };

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [1, 1.35],
    outputRange: [0.25, 0],
  });

  return (
    <Screen>
      <View style={styles.center}>
        {/* Animated pulsing orb */}
        <View style={styles.orbContainer}>
          <Animated.View
            style={[
              styles.orbRing,
              {
                transform: [{ scale: pulseAnim }],
                opacity: pulseOpacity,
              },
            ]}
          />
          <View style={styles.orb}>
            <View style={styles.orbInner} />
          </View>
        </View>

        <Text style={styles.title}>Finding your guide{dots}</Text>
        <Text style={styles.subtitle}>Matching based on your topics</Text>

        {eta != null && (
          <View style={styles.etaBox}>
            <Text style={styles.etaLabel}>Estimated wait</Text>
            <Text style={styles.etaValue}>
              ~{eta} min{eta > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        <View style={styles.topicRow}>
          {state.selectedTopics.map((t) => (
            <Pill key={t} label={t} selected={false} />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <SecondaryButton
          title="Cancel"
          variant="outline"
          onPress={cancel}
          icon="close-outline"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  orbContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  orbRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
  },
  orb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  orbInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: font.xl,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: font.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  etaBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  etaLabel: {
    fontSize: font.xs,
    color: colors.textMuted,
  },
  etaValue: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.xs,
  },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
});
