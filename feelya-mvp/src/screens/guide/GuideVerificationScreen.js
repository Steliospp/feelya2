import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { Button, Card, Divider } from '../../components/UI';
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
    <View style={styles.container}>
      <Text style={styles.title}>Verification</Text>
      <Text style={styles.subtitle}>
        Build trust with seekers by verifying your identity.
      </Text>

      <Card style={{ marginBottom: spacing.md }}>
        <View style={styles.row}>
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
          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>Upload Credential</Text>
            <Text style={styles.rowDesc}>
              Certifications, coaching credentials, etc. (optional)
            </Text>
          </View>
        </View>
        <Divider />
        <TouchableOpacity style={styles.uploadBtn} onPress={fakeUpload}>
          <Text style={styles.uploadText}>+ Upload file</Text>
        </TouchableOpacity>
      </Card>

      <Text style={styles.note}>
        Verification is optional for the MVP. In production, verified guides
        get a badge and higher visibility.
      </Text>

      <View style={styles.footer}>
        <Button title="Finish Setup" onPress={proceed} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.lg,
  },
  title: {
    fontSize: font.xxl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: font.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowContent: { flex: 1 },
  rowTitle: { fontSize: font.md, fontWeight: '700', color: colors.text },
  rowDesc: {
    fontSize: font.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  uploadBtn: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  uploadText: { color: colors.primary, fontWeight: '700', fontSize: font.md },
  note: {
    fontSize: font.xs,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: spacing.md,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
