import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Screen } from '../../components/UI';
import { colors, spacing, font } from '../../theme';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('SafetyDisclaimer');
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Screen style={styles.screen}>
      <Animated.View style={[styles.center, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>f</Text>
        </View>
        <Text style={styles.logo}>feelya</Text>
        <Text style={styles.tagline}>human guidance, on demand</Text>
      </Animated.View>

      <Text style={styles.disclaimer}>
        Peer support and coaching -- not therapy or medical advice
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoIcon: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.white,
    marginTop: -2,
  },
  logo: {
    fontSize: 44,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -1.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: font.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  disclaimer: {
    position: 'absolute',
    bottom: 60,
    fontSize: font.xs,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
