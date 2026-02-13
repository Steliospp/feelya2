import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../components/UI';
import { colors, spacing, font } from '../../theme';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('RoleSelect');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Screen style={styles.screen}>
      <View style={styles.center}>
        <Text style={styles.logo}>feelya</Text>
        <Text style={styles.tagline}>human guidance, on demand</Text>
      </View>

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
  logo: {
    fontSize: 48,
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
