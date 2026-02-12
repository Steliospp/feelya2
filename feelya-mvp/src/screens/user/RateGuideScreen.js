import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../../theme';
import { Button, Avatar, StarRating } from '../../components/UI';
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
    navigation.replace('UserHome');
  };

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Avatar name={session.guideName} size={72} />
        <Text style={styles.title}>How was your{'\n'}session with {session.guideName}?</Text>

        <StarRating rating={rating} setRating={setRating} size={40} />

        <Text style={styles.hint}>
          {rating === 0
            ? 'Tap a star to rate'
            : rating <= 2
            ? "We're sorry it wasn't great"
            : rating <= 4
            ? 'Thanks for the feedback!'
            : 'Awesome!'}
        </Text>

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

      <View style={styles.footer}>
        <Button
          title={rating > 0 ? 'Submit Rating' : 'Skip'}
          variant={rating > 0 ? 'primary' : 'outline'}
          onPress={submit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginVertical: spacing.lg,
    lineHeight: 30,
  },
  hint: {
    fontSize: font.sm,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  input: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: font.md,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
