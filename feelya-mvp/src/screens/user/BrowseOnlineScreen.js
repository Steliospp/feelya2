import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../../theme';
import { Screen, Header, SearchBar, Avatar } from '../../components/UI';
import { MOCK_PROVIDERS } from '../../store/AppContext';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'licensed', label: 'Licensed' },
  { id: 'guide', label: 'Guides' },
];

export default function BrowseOnlineScreen({ navigation, route }) {
  const {
    selectedTopics = [],
    supportType = 'all',
    fallbackMessage,
  } = route.params || {};

  const [filter, setFilter] = useState(supportType === 'all' ? 'all' : supportType);
  const [search, setSearch] = useState('');

  const providers = useMemo(() => {
    let list = MOCK_PROVIDERS.filter((p) => p.online);
    if (filter !== 'all') {
      list = list.filter((p) => p.type === filter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.topics.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [filter, search]);

  const handleRequest = (provider) => {
    Alert.alert(
      'Request sent',
      `Your request has been sent to ${provider.name}. They\'ll be notified and connect with you shortly.`,
      [{ text: 'OK', onPress: () => navigation.navigate('HomeMain') }],
    );
  };

  return (
    <Screen>
      <Header title="Who's available" onBack={() => navigation.goBack()} />

      <View style={s.searchWrap}>
        <SearchBar placeholder="Search by name or topic..." value={search} onChangeText={setSearch} />
      </View>

      {/* Filter chips */}
      <View style={s.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[s.filterChip, filter === f.id && s.filterChipActive]}
            onPress={() => setFilter(f.id)}
          >
            <Text style={[s.filterText, filter === f.id && s.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {fallbackMessage && (
        <View style={s.fallbackBanner}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          <Text style={s.fallbackText}>{fallbackMessage}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {providers.length === 0 ? (
          <View style={s.emptyWrap}>
            <Ionicons name="search-outline" size={40} color={colors.textMuted} />
            <Text style={s.emptyTitle}>No one available right now</Text>
            <Text style={s.emptySub}>Try adjusting your filters or check back soon.</Text>
          </View>
        ) : (
          providers.map((p) => (
            <View key={p.id} style={s.card}>
              <View style={s.cardTop}>
                <View style={s.avatarWrap}>
                  <Image source={{ uri: p.avatar }} style={s.avatarImg} />
                  <View style={s.onlineDot} />
                </View>
                <View style={s.cardInfo}>
                  <Text style={s.cardName}>{p.name}</Text>
                  <Text style={s.cardTitle}>{p.title}</Text>
                  <View style={s.ratingRow}>
                    <Ionicons name="star" size={12} color={colors.warning} />
                    <Text style={s.ratingText}>{p.rating}</Text>
                    <Text style={s.reviewCount}>({p.reviews})</Text>
                    <Text style={s.lastActive}>{p.lastActive}</Text>
                  </View>
                </View>
              </View>
              <Text style={s.cardBio} numberOfLines={2}>{p.bio}</Text>
              <View style={s.topicRow}>
                {p.topics.slice(0, 3).map((t) => (
                  <View
                    key={t}
                    style={[
                      s.topicPill,
                      selectedTopics.includes(t) && s.topicPillMatch,
                    ]}
                  >
                    <Text
                      style={[
                        s.topicText,
                        selectedTopics.includes(t) && s.topicTextMatch,
                      ]}
                    >
                      {t}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={s.cardFooter}>
                <Text style={s.priceText}>${p.pricePerSession} / session</Text>
                <TouchableOpacity
                  style={s.requestBtn}
                  onPress={() => handleRequest(p)}
                  activeOpacity={0.8}
                >
                  <Text style={s.requestText}>Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  searchWrap: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceLight,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
  },
  fallbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    marginHorizontal: spacing.screenPadding,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  fallbackText: {
    fontSize: font.caption,
    color: colors.primary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  list: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 100,
  },
  /* Card */
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  cardTop: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surfaceLight,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.success,
    borderWidth: 2.5,
    borderColor: colors.surface,
  },
  cardInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  cardName: {
    fontSize: font.body,
    fontWeight: '600',
    color: colors.text,
  },
  cardTitle: {
    fontSize: font.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  ratingText: {
    fontSize: font.xs,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 3,
  },
  reviewCount: {
    fontSize: font.xs,
    color: colors.textMuted,
    marginLeft: 2,
  },
  lastActive: {
    fontSize: font.xs,
    color: colors.success,
    marginLeft: 'auto',
    fontWeight: '500',
  },
  cardBio: {
    fontSize: font.caption,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: spacing.sm,
  },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  topicPill: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
  },
  topicPillMatch: {
    backgroundColor: colors.primaryLight,
  },
  topicText: {
    fontSize: font.xs,
    color: colors.textSecondary,
  },
  topicTextMatch: {
    color: colors.primary,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.textMuted,
  },
  requestBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  requestText: {
    fontSize: font.caption,
    fontWeight: '600',
    color: colors.white,
  },
  /* Empty */
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
  },
  emptySub: {
    fontSize: font.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
