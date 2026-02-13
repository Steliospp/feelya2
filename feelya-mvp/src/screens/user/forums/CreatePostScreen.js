import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors, spacing, font } from '../../../theme';
import {
  Screen, Header, PrimaryButton, Input, Pill,
} from '../../../components/UI';
import { useApp, FORUM_CATEGORIES, ALL_TOPICS } from '../../../store/AppContext';

const CATEGORIES = FORUM_CATEGORIES.filter((c) => c.id !== 'all');
const TAG_OPTIONS = ALL_TOPICS.slice(0, 10);

export default function CreatePostScreen({ navigation }) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const submit = () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Missing info', 'Please add a title and body.');
      return;
    }
    dispatch({
      type: 'ADD_THREAD',
      payload: {
        title: title.trim(),
        body: body.trim(),
        author: 'You',
        category: category || 'wellness',
        tags,
      },
    });
    navigation.goBack();
  };

  return (
    <Screen>
      <Header title="New Post" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Input
          label="Title"
          placeholder="What's on your mind?"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
          autoFocus
          style={{ marginBottom: spacing.md }}
        />

        <Input
          label="Body"
          placeholder="Share your thoughts..."
          value={body}
          onChangeText={setBody}
          multiline
          maxLength={1000}
          style={{ marginBottom: spacing.lg }}
        />

        <Text style={s.label}>Category</Text>
        <View style={s.pills}>
          {CATEGORIES.map((c) => (
            <Pill
              key={c.id}
              label={c.label}
              selected={category === c.id}
              onPress={() => setCategory(c.id)}
            />
          ))}
        </View>

        <Text style={s.label}>Tags (optional)</Text>
        <View style={s.pills}>
          {TAG_OPTIONS.map((t) => (
            <Pill
              key={t}
              label={t}
              selected={tags.includes(t)}
              onPress={() => toggleTag(t)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={s.footer}>
        <PrimaryButton
          title="Post"
          onPress={submit}
          disabled={!title.trim() || !body.trim()}
          icon="send-outline"
        />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: { padding: spacing.screenPadding, paddingBottom: 120 },
  label: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  pills: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.lg },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
