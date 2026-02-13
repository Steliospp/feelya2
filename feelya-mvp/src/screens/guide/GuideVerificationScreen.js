import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font } from '../../theme';
import { Screen, Card, Divider, PrimaryButton } from '../../components/UI';
import { useApp } from '../../store/AppContext';

export default function GuideVerificationScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [idVerified, setIdVerified] = useState(state.guideVerified);

  const proceed = () => {
    dispatch({ type: 'SET_GUIDE_VERIFIED', payload: idVerified });
    navigation.replace('GuideHome');
  };

  const fakeUpload = () => {
    Alert.alert(
      'Upload Credential',
      'This is a placeholder. In production, you would upload an ID or credential here.',
      [{ text: 'OK' }]
    );
  };

  return (
    <Screen>
      <View style={styles.content}>
        <Ionicons name="shield-checkmark-outline" size={36} color={colors.accent} style={{ marginBottom: spacing.md }} />
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          Build trust with seekers by verifying your identity.
        </Text>

        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.row}>
            <View style={styles.rowIconWrap}>
              <Ionicons name="id-card-outline" size={22} color={colors.textSecondary} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>ID Verified</Text>
              <Text style={styles.rowDesc}>
                Toggle to simulate identity verification
              </Text>
            </View>
            <Switch
              value={idVerified}
              onValueChange={setIdVerified}
              trackColor={{ false: colors.border, true: colors.success + '88' }}
              thumbColor={idVerified ? colors.success : colors.textMuted}
            />
          </View>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.row}>
            <View style={styles.rowIconWrap}>
              <Ionicons name="document-attach-outline" size={22} color={colors.textSecondary} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Upload Credential</Text>
              <Text style={styles.rowDesc}>
                Certifications, coaching credentials, etc. (optional)
              </Text>
            </View>
          </View>
          <Divider />
          <TouchableOpacity style={styles.uploadBtn} onPress={fakeUpload}>
            <Ionicons name="cloud-upload-outline" size={18} color={colors.primary} style={{ marginRight: spacing.sm }} />
            <Text style={styles.uploadText}>Upload file</Text>
          </TouchableOpacity>
        </Card>

        <Text style={styles.note}>
          Verification is optional for the MVP. In production, verified guides
          get a badge and higher visibility.
        </Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton title="Finish Setup" onPress={proceed} icon="checkmark-circle-outline" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xxl + spacing.lg,
  },
  title: {
    fontSize: font.title,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: font.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowContent: { flex: 1 },
  rowTitle: { fontSize: font.body, fontWeight: '700', color: colors.text },
  rowDesc: {
    fontSize: font.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  uploadBtn: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: { color: colors.primary, fontWeight: '700', fontSize: font.body },
  note: {
    fontSize: font.xs,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: spacing.md,
  },
  footer: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
});
