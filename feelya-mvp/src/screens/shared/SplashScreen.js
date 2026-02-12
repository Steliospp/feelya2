import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, font } from '../../theme';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('RoleSelect');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoBlock}>
        <Text style={styles.logo}>feelya</Text>
        <Text style={styles.tagline}>human guidance, on demand</Text>
      </View>
      <Text style={styles.disclaimer}>Peer support — not therapy or medical advice</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBlock: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 52,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -2,
    textAlign: 'center',
  },
  tagline: {
    fontSize: font.md,
    color: colors.textSecondary,
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
