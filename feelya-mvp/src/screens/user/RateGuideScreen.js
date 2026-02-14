import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, radius, font, shadow } from '../../theme';
import { Screen, Header, PrimaryButton, SecondaryButton, Avatar, StarRating } from '../../components/UI';
import { useApp } from '../../store/AppContext';

export default function RateGuideScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const session = state.userSessions[0];
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState('');

  if (!session) {
    navigation.replace('UserHome');
    return null;
  }

  const submit = () => {
    if (rating > 0) {
      dispatch({
        type: 'RATE_SESSION',
        payload: { sessionId: session.id, rating, note: note.trim() },
      });
    }
    navigation.popToTop();
  };

  return (
    <Screen>
      <Header title="Rate Session" />

      <View style={styles.center}>
        <Avatar name={session.guideName} size={72} />
        <Text style={styles.title}>How was your session{'\n'}with {session.guideName}?</Text>

        <StarRating rating={rating} setRating={setRating} size={36} />

        <Text style={styles.hint}>
          {rating === 0
            ? 'Tap a star to rate'
            : rating <= 2
            ? "We'll work on that"
            : rating <= 4
            ? 'Thanks for the feedback'
            : 'Great to hear'}
        </Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Add a note (optional)"
            placeholderTextColor={colors.textMuted}
            value={note}
            onChangeText={setNote}
            multiline
            maxLength={200}
          />
        </View>
      </View>

      <View style={styles.footer}>
        {rating > 0 ? (
          <PrimaryButton title="Submit" onPress={submit} icon="checkmark-circle-outline" />
        ) : (
          <SecondaryButton title="Skip" onPress={submit} variant="outline" />
        )}
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
  title: {
    fontSize: font.xl,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginVertical: spacing.lg,
    lineHeight: 30,
  },
  hint: {
    fontSize: font.caption,
    color: colors.primary,
    fontWeight: '500',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    ...shadow.card,
  },
  input: {
    width: '100%',
    padding: spacing.md,
    color: colors.text,
    fontSize: font.body,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
});
