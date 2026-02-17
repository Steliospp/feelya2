import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, font, shadow } from '../../theme';
import {
  Screen, PrimaryButton, Pill, BottomSheet, Avatar,
} from '../../components/UI';
import { useApp, MOCK_GUIDES, MOCK_PROVIDERS, generateAvailability } from '../../store/AppContext';

const { width: SCREEN_W } = Dimensions.get('window');
const HEADER_H = 200;
const AVATAR_SIZE = 100;
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ── extra profile data keyed by guideId / providerId ── */
const EXTRA_PROFILE = {
  g1: {
    languages: ['English', 'Mandarin'],
    education: 'B.A. Psychology, UC Berkeley',
    certifications: ['Certified Mindset Coach', 'ICF Associate Certified Coach'],
    yearsExp: 6,
  },
  g2: {
    languages: ['English', 'Spanish'],
    education: 'B.S. Neuroscience, NYU',
    certifications: ['Peer Support Specialist', 'Mental Health First Aid'],
    yearsExp: 3,
  },
  g3: {
    languages: ['English', 'Hindi'],
    education: 'M.A. Counseling Psychology, Columbia',
    certifications: ['Certified Relationship Coach', 'Gottman Level 1'],
    yearsExp: 5,
  },
  g4: {
    languages: ['English'],
    education: 'B.S. Kinesiology, UCLA',
    certifications: ['NASM Certified Personal Trainer', 'Sports Psychology Certificate'],
    yearsExp: 4,
  },
  g5: {
    languages: ['English', 'Portuguese'],
    education: 'B.A. Social Work, Boston University',
    certifications: ['Lived Experience Mentor', 'Peer Recovery Support'],
    yearsExp: 5,
  },
  lp1: {
    languages: ['English', 'French'],
    education: 'Ph.D. Clinical Psychology, Stanford University',
    certifications: ['Licensed Clinical Psychologist', 'Certified Trauma Specialist'],
    yearsExp: 12,
  },
  lp2: {
    languages: ['English', 'Spanish'],
    education: 'Psy.D. Marriage & Family Therapy, Pepperdine',
    certifications: ['Licensed Marriage & Family Therapist', 'Gottman Level 3 Certified'],
    yearsExp: 9,
  },
  lp3: {
    languages: ['English'],
    education: 'M.S. Clinical Mental Health Counseling, Johns Hopkins',
    certifications: ['Licensed Professional Counselor', 'Certified Career Coach'],
    yearsExp: 7,
  },
  lp4: {
    languages: ['English', 'Cantonese'],
    education: 'M.S.W. Social Work, University of Michigan',
    certifications: ['Licensed Clinical Social Worker', 'Certified Grief Counselor'],
    yearsExp: 10,
  },
  cg1: {
    languages: ['English', 'Mandarin'],
    education: 'B.A. Psychology, UC Berkeley',
    certifications: ['Certified Mindset Coach', 'ICF Associate Certified Coach'],
    yearsExp: 6,
  },
  cg2: {
    languages: ['English', 'Spanish'],
    education: 'B.S. Neuroscience, NYU',
    certifications: ['Peer Support Specialist', 'Mental Health First Aid'],
    yearsExp: 3,
  },
  cg3: {
    languages: ['English', 'Hindi'],
    education: 'M.A. Counseling Psychology, Columbia',
    certifications: ['Certified Relationship Coach', 'Gottman Level 1'],
    yearsExp: 5,
  },
  cg4: {
    languages: ['English'],
    education: 'B.S. Kinesiology, UCLA',
    certifications: ['NASM Certified Personal Trainer', 'Sports Psychology Certificate'],
    yearsExp: 4,
  },
  cg5: {
    languages: ['English', 'Portuguese'],
    education: 'B.A. Social Work, Boston University',
    certifications: ['Lived Experience Mentor', 'Peer Recovery Support'],
    yearsExp: 5,
  },
  cg6: {
    languages: ['English', 'Yoruba'],
    education: 'M.A. Positive Psychology, UPenn',
    certifications: ['Certified Wellbeing Coach', 'Boundary Specialist'],
    yearsExp: 4,
  },
};

const MOCK_REVIEWS = [
  { id: 'rv1', author: 'Sarah K.', rating: 5, text: 'Incredibly warm and understanding. I felt heard from the very first minute. Highly recommend!', date: '2 days ago' },
  { id: 'rv2', author: 'James T.', rating: 5, text: 'Really helped me see things from a different perspective. The session flew by.', date: '1 week ago' },
  { id: 'rv3', author: 'Mia L.', rating: 4, text: 'Great listener and gave practical advice I could use right away.', date: '2 weeks ago' },
  { id: 'rv4', author: 'David R.', rating: 5, text: 'So easy to talk to. No judgment at all. I finally feel like someone gets it.', date: '3 weeks ago' },
  { id: 'rv5', author: 'Emma W.', rating: 5, text: 'This was exactly what I needed. Thoughtful, patient, and genuinely caring.', date: '1 month ago' },
];

export default function GuideProfileScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { dispatch } = useApp();
  const {
    guideId,
    bookingId,
    mode: initialMode,
    autoOpenAvailability,
    preselectedMode,
  } = route.params || {};

  // look up from both data sources
  const guide = MOCK_GUIDES.find((g) => g.id === guideId);
  const provider = MOCK_PROVIDERS.find((p) => p.id === guideId);
  const profile = provider || guide;
  const extra = EXTRA_PROFILE[guideId] || {
    languages: ['English'], education: 'Psychology', certifications: ['Certified Guide'], yearsExp: 3,
  };

  const slots = generateAvailability(guideId);
  const dates = [...new Set(slots.map((s) => s.date))];

  const scrollRef = useRef(null);
  const availabilityY = useRef(0);
  const [activeTab, setActiveTab] = useState('about');
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBooking, setShowBooking] = useState(!!initialMode);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMode, setSelectedMode] = useState(preselectedMode || 'chat');
  const [navigating, setNavigating] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  /* Auto-scroll to Availability when coming from Reschedule */
  useEffect(() => {
    if (autoOpenAvailability && scrollRef.current) {
      const timer = setTimeout(() => {
        scrollRef.current.scrollTo({ y: availabilityY.current, animated: true });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [autoOpenAvailability]);

  if (!profile) {
    return (
      <Screen>
        <View style={[s.emptyWrap, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.floatBack}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={s.emptyText}>Guide not found</Text>
        </View>
      </Screen>
    );
  }

  const name = profile.name;
  const bio = profile.bio;
  const topics = profile.topics || [];
  const rating = profile.rating || 4.5;
  const reviewCount = profile.reviews || profile.conversations || 0;
  const convCount = profile.conversations || profile.reviews || 0;
  const isLicensed = profile.type === 'licensed';
  const isOnline = profile.online !== undefined ? profile.online : true;
  const avatarUrl = profile.avatar;
  const title = profile.title || '';
  const responseTime = profile.responseTime || 5;
  const daySlots = slots.filter((sl) => sl.date === selectedDate);

  const handleBook = () => {
    if (!selectedSlot) return;
    setShowConfirm(true);
  };

  const confirmBooking = () => {
    const slot = slots.find((sl) => sl.id === selectedSlot);
    if (!slot) return;
    const ratePerMin = profile.ratePerMin || (profile.pricePerSession ? profile.pricePerSession / 30 : 0.99);
    const price = +(30 * ratePerMin).toFixed(2);

    if (bookingId) {
      dispatch({
        type: 'RESCHEDULE_BOOKING',
        payload: { bookingId, date: slot.date, hour: slot.hour, timeLabel: slot.label },
      });
    } else {
      dispatch({
        type: 'ADD_BOOKING',
        payload: {
          id: 'b_' + Date.now(),
          guideId: profile.id,
          guideName: name,
          date: slot.date,
          hour: slot.hour,
          timeLabel: slot.label,
          mode: selectedMode,
          duration: 30,
          price,
          status: 'upcoming',
          topics: topics.slice(0, 2),
        },
      });
    }

    // Force-unmount both BottomSheets (removes their Modals instantly)
    // then navigate once React has flushed the unmount
    setNavigating(true);
    setShowConfirm(false);
    setShowBooking(false);
    setTimeout(() => {
      navigation.navigate('Chats', { screen: 'ChatsMain' });
      setNavigating(false);
    }, 50);
  };

  /* ──────── RENDER ──────── */
  return (
    <View style={[s.root, { paddingBottom: insets.bottom }]}>
      <Animated.ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* ── Header background ── */}
        <View style={s.headerBg}>
          <View style={s.headerGradient} />
          <View style={s.headerDecor1} />
          <View style={s.headerDecor2} />
          <View style={s.headerDecor3} />

          {/* Top bar overlay */}
          <View style={[s.topBar, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={s.topBtn} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={22} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={s.topBtn} activeOpacity={0.7}>
              <Ionicons name="share-outline" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Avatar + core info ── */}
        <View style={s.profileSection}>
          <View style={s.avatarWrap}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={s.avatarImg} />
            ) : (
              <View style={s.avatarFallback}>
                <Text style={s.avatarInitials}>
                  {name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)}
                </Text>
              </View>
            )}
            {isOnline && <View style={s.onlineDot} />}
          </View>

          <Text style={s.name}>{name}</Text>
          {title ? <Text style={s.title}>{title}</Text> : null}

          {/* Badge row */}
          <View style={s.badgeRow}>
            {isLicensed && (
              <View style={s.licensedBadge}>
                <Ionicons name="shield-checkmark" size={13} color={colors.white} />
                <Text style={s.licensedText}>Licensed</Text>
              </View>
            )}
            {!isLicensed && profile.verified && (
              <View style={[s.licensedBadge, { backgroundColor: colors.primary }]}>
                <Ionicons name="checkmark-circle" size={13} color={colors.white} />
                <Text style={s.licensedText}>Verified</Text>
              </View>
            )}
            <View style={s.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFBE0B" />
              <Text style={s.ratingVal}>{rating}</Text>
              <Text style={s.ratingCount}>({reviewCount} reviews)</Text>
            </View>
          </View>

          {/* Stats row */}
          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statNum}>{convCount}</Text>
              <Text style={s.statLabel}>Conversations</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={s.statNum}>{extra.yearsExp}+</Text>
              <Text style={s.statLabel}>Years Exp.</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={s.statNum}>{reviewCount}</Text>
              <Text style={s.statLabel}>Reviews</Text>
            </View>
          </View>

          {/* Response time */}
          <View style={s.responseRow}>
            <Ionicons name="time-outline" size={14} color={colors.success} />
            <Text style={s.responseText}>Usually responds within {responseTime} min</Text>
          </View>
        </View>

        {/* ── Tabs ── */}
        <View style={s.tabBar}>
          <TouchableOpacity
            style={[s.tab, activeTab === 'about' && s.tabActive]}
            onPress={() => setActiveTab('about')}
            activeOpacity={0.7}
          >
            <Text style={[s.tabText, activeTab === 'about' && s.tabTextActive]}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tab, activeTab === 'reviews' && s.tabActive]}
            onPress={() => setActiveTab('reviews')}
            activeOpacity={0.7}
          >
            <Text style={[s.tabText, activeTab === 'reviews' && s.tabTextActive]}>Reviews</Text>
          </TouchableOpacity>
        </View>

        {/* ── Tab content ── */}
        <View style={s.content}>
          {activeTab === 'about' ? (
            <>
              {/* About me */}
              <Text style={s.sectionHeading}>About me</Text>
              <Text style={s.bioText}>{bio}</Text>

              {/* Expertise */}
              <Text style={s.sectionHeading}>Expertise</Text>
              <View style={s.pillWrap}>
                {topics.map((t) => (
                  <View key={t} style={s.expertPill}>
                    <Text style={s.expertPillText}>{t}</Text>
                  </View>
                ))}
              </View>

              {/* Languages */}
              <Text style={s.sectionHeading}>Languages</Text>
              <View style={s.infoRow}>
                <Ionicons name="globe-outline" size={18} color={colors.primary} />
                <Text style={s.infoText}>{extra.languages.join(', ')}</Text>
              </View>

              {/* Education */}
              <Text style={s.sectionHeading}>Education</Text>
              <View style={s.infoRow}>
                <Ionicons name="school-outline" size={18} color={colors.primary} />
                <Text style={s.infoText}>{extra.education}</Text>
              </View>

              {/* Certifications */}
              <Text style={s.sectionHeading}>Certifications</Text>
              {extra.certifications.map((cert) => (
                <View key={cert} style={s.certRow}>
                  <View style={s.certCheck}>
                    <Ionicons name="checkmark" size={14} color={colors.white} />
                  </View>
                  <Text style={s.certText}>{cert}</Text>
                </View>
              ))}

              {/* Availability */}
              <View onLayout={(e) => { availabilityY.current = e.nativeEvent.layout.y; }}>
                <Text style={[s.sectionHeading, { marginTop: spacing.lg }]}>
                  {bookingId ? 'Pick a new time' : 'Availability'}
                </Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.weekStrip}>
                {dates.map((d) => {
                  const dt = new Date(d + 'T12:00:00');
                  const isSel = d === selectedDate;
                  return (
                    <TouchableOpacity
                      key={d}
                      style={[s.dayChip, isSel && s.dayChipSel]}
                      onPress={() => { setSelectedDate(d); setSelectedSlot(null); }}
                      activeOpacity={0.7}
                    >
                      <Text style={[s.dayChipDay, isSel && s.dayChipTextSel]}>{DAYS[dt.getDay()]}</Text>
                      <Text style={[s.dayChipNum, isSel && s.dayChipTextSel]}>{dt.getDate()}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={s.slotGrid}>
                {daySlots.length === 0 ? (
                  <Text style={s.noSlots}>No available slots on this day</Text>
                ) : (
                  daySlots.map((sl) => {
                    const isSel = sl.id === selectedSlot;
                    return (
                      <TouchableOpacity
                        key={sl.id}
                        style={[s.slotPill, isSel && s.slotPillSel]}
                        onPress={() => setSelectedSlot(sl.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={[s.slotPillText, isSel && s.slotPillTextSel]}>{sl.label}</Text>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            </>
          ) : (
            /* ── Reviews tab ── */
            <>
              <View style={s.reviewSummary}>
                <Text style={s.reviewBigNum}>{rating}</Text>
                <View style={s.reviewStars}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Ionicons
                      key={n}
                      name={n <= Math.round(rating) ? 'star' : 'star-half'}
                      size={18}
                      color="#FFBE0B"
                      style={{ marginRight: 2 }}
                    />
                  ))}
                </View>
                <Text style={s.reviewTotal}>Based on {reviewCount} reviews</Text>
              </View>

              {MOCK_REVIEWS.map((rv) => (
                <View key={rv.id} style={s.reviewCard}>
                  <View style={s.reviewTop}>
                    <View style={s.reviewAvatar}>
                      <Text style={s.reviewAvatarText}>{rv.author[0]}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={s.reviewAuthor}>{rv.author}</Text>
                      <Text style={s.reviewDate}>{rv.date}</Text>
                    </View>
                    <View style={s.reviewStarsSmall}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Ionicons key={n} name={n <= rv.rating ? 'star' : 'star-outline'} size={12} color="#FFBE0B" />
                      ))}
                    </View>
                  </View>
                  <Text style={s.reviewBody}>{rv.text}</Text>
                </View>
              ))}
            </>
          )}

          {/* bottom spacer */}
          <View style={{ height: 110 }} />
        </View>
      </Animated.ScrollView>

      {/* ── Bottom action bar ── */}
      <View style={[s.bottomBar, { paddingBottom: 6 }]}>
        <TouchableOpacity
          style={s.btnPlan}
          onPress={() => setShowBooking(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={18} color={colors.white} style={{ marginRight: 6 }} />
          <Text style={s.btnPlanText}>Plan a chat</Text>
        </TouchableOpacity>
      </View>

      {/* ── Plan a Chat bottom sheet ── */}
      {!navigating && <BottomSheet visible={showBooking && !showConfirm} onClose={() => setShowBooking(false)} title="Plan a chat">
        {/* Mini profile in sheet */}
        <View style={s.sheetProfile}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={s.sheetAvatar} />
          ) : (
            <Avatar name={name} size={44} />
          )}
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={s.sheetName}>{name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
              {isLicensed && (
                <View style={[s.licensedBadge, { paddingHorizontal: 8, paddingVertical: 3, marginRight: 8 }]}>
                  <Ionicons name="shield-checkmark" size={11} color={colors.white} />
                  <Text style={[s.licensedText, { fontSize: 10 }]}>Licensed</Text>
                </View>
              )}
              <Ionicons name="star" size={12} color="#FFBE0B" />
              <Text style={{ fontSize: font.caption, color: colors.textSecondary, marginLeft: 3 }}>{rating}</Text>
            </View>
          </View>
        </View>

        <Text style={s.sheetLabel}>Select a date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
          {dates.map((d) => {
            const dt = new Date(d + 'T12:00:00');
            const isSel = d === selectedDate;
            return (
              <TouchableOpacity
                key={d}
                style={[s.dayChip, isSel && s.dayChipSel, { marginBottom: 0 }]}
                onPress={() => { setSelectedDate(d); setSelectedSlot(null); }}
                activeOpacity={0.7}
              >
                <Text style={[s.dayChipDay, isSel && s.dayChipTextSel]}>{DAYS[dt.getDay()]}</Text>
                <Text style={[s.dayChipNum, isSel && s.dayChipTextSel]}>{dt.getDate()}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={s.sheetLabel}>Select a time</Text>
        <View style={s.slotGrid}>
          {daySlots.length === 0 ? (
            <Text style={s.noSlots}>No available slots</Text>
          ) : (
            daySlots.map((sl) => {
              const isSel = sl.id === selectedSlot;
              return (
                <TouchableOpacity
                  key={sl.id}
                  style={[s.slotPill, isSel && s.slotPillSel]}
                  onPress={() => setSelectedSlot(sl.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.slotPillText, isSel && s.slotPillTextSel]}>{sl.label}</Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Mode selector */}
        <Text style={s.sheetLabel}>Session type</Text>
        <View style={s.modeRow}>
          {['chat', 'voice', 'video'].map((m) => {
            const isSel = selectedMode === m;
            const icon = m === 'chat' ? 'chatbubble-outline' : m === 'voice' ? 'mic-outline' : 'videocam-outline';
            return (
              <TouchableOpacity
                key={m}
                style={[s.modePill, isSel && s.modePillSel]}
                onPress={() => setSelectedMode(m)}
                activeOpacity={0.7}
              >
                <Ionicons name={icon} size={16} color={isSel ? colors.white : colors.textSecondary} style={{ marginRight: 5 }} />
                <Text style={[s.modePillText, isSel && s.modePillTextSel]}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[s.sheetBtn, !selectedSlot && { opacity: 0.4 }]}
          onPress={handleBook}
          disabled={!selectedSlot}
          activeOpacity={0.8}
        >
          <Text style={s.sheetBtnText}>
            {selectedSlot ? (bookingId ? 'Reschedule' : 'Confirm booking') : 'Select a time to continue'}
          </Text>
        </TouchableOpacity>
      </BottomSheet>}

      {/* ── Booking confirmed bottom sheet ── */}
      {!navigating && <BottomSheet visible={showConfirm} onClose={() => setShowConfirm(false)}>
        <View style={s.confirmWrap}>
          <View style={s.confirmCircle}>
            <Ionicons name="checkmark" size={36} color={colors.white} />
          </View>
          <Text style={s.confirmTitle}>Booking Confirmed!</Text>
          <Text style={s.confirmSub}>
            Your chat with {name} is set for{'\n'}
            {selectedSlot && fmtDate(slots.find((sl) => sl.id === selectedSlot)?.date)}{' '}
            at {slots.find((sl) => sl.id === selectedSlot)?.label}
          </Text>

          <View style={s.confirmDetails}>
            <View style={s.confirmDetailRow}>
              <Text style={s.confirmDetailLabel}>Guide</Text>
              <Text style={s.confirmDetailVal}>{name}</Text>
            </View>
            <View style={s.confirmDetailRow}>
              <Text style={s.confirmDetailLabel}>Mode</Text>
              <Text style={s.confirmDetailVal}>{selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}</Text>
            </View>
            <View style={s.confirmDetailRow}>
              <Text style={s.confirmDetailLabel}>Duration</Text>
              <Text style={s.confirmDetailVal}>30 min</Text>
            </View>
          </View>

          <TouchableOpacity style={s.sheetBtn} onPress={confirmBooking} activeOpacity={0.8}>
            <Text style={s.sheetBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>}
    </View>
  );
}

/* ── helpers ── */
function fmtDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/* ══════════════ STYLES ══════════════ */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },

  /* header background */
  headerBg: {
    height: HEADER_H,
    backgroundColor: '#7EB8A8',
    overflow: 'hidden',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#7EB8A8',
  },
  headerDecor1: {
    position: 'absolute', top: 30, left: -30,
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerDecor2: {
    position: 'absolute', top: -20, right: -20,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerDecor3: {
    position: 'absolute', bottom: 10, right: 40,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
  },
  topBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },

  /* profile section */
  profileSection: {
    alignItems: 'center',
    marginTop: -AVATAR_SIZE / 2,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  avatarWrap: {
    width: AVATAR_SIZE + 6, height: AVATAR_SIZE + 6,
    borderRadius: (AVATAR_SIZE + 6) / 2,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...shadow.cardHover,
  },
  avatarImg: {
    width: AVATAR_SIZE, height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarFallback: {
    width: AVATAR_SIZE, height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: AVATAR_SIZE * 0.36,
    fontWeight: '700',
    color: colors.primary,
  },
  onlineDot: {
    position: 'absolute', bottom: 6, right: 6,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.success,
    borderWidth: 3, borderColor: colors.white,
  },
  name: {
    fontSize: font.xl + 2, fontWeight: '700',
    color: colors.text, marginTop: spacing.md,
    textAlign: 'center',
  },
  title: {
    fontSize: font.caption, color: colors.textSecondary,
    marginTop: 4, textAlign: 'center',
  },

  /* badges */
  badgeRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: spacing.md,
    flexWrap: 'wrap', justifyContent: 'center',
  },
  licensedBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: radius.full, marginRight: spacing.sm,
  },
  licensedText: {
    fontSize: font.xs, fontWeight: '600',
    color: colors.white, marginLeft: 4,
  },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center',
  },
  ratingVal: {
    fontSize: font.body, fontWeight: '700',
    color: colors.text, marginLeft: 4,
  },
  ratingCount: {
    fontSize: font.caption, color: colors.textSecondary,
    marginLeft: 3,
  },

  /* stats */
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingVertical: 14, paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    ...shadow.card,
  },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: font.lg, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: font.xs, color: colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: colors.border },

  /* response time */
  responseRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: spacing.md,
    backgroundColor: colors.success + '12',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: radius.full,
  },
  responseText: {
    fontSize: font.caption, color: colors.success,
    fontWeight: '500', marginLeft: 6,
  },

  /* tabs */
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: spacing.screenPadding,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.full,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1, paddingVertical: 10,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  tabText: {
    fontSize: font.body, fontWeight: '500',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.text, fontWeight: '600',
  },

  /* content */
  content: { paddingHorizontal: spacing.screenPadding },
  sectionHeading: {
    fontSize: font.lg, fontWeight: '700',
    color: colors.text, marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  bioText: {
    fontSize: font.body, color: colors.textSecondary,
    lineHeight: 24,
  },

  /* expertise pills */
  pillWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  expertPill: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    marginRight: spacing.sm, marginBottom: spacing.sm,
  },
  expertPillText: {
    fontSize: font.caption, fontWeight: '500', color: colors.primary,
  },

  /* info rows */
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: font.body, color: colors.textSecondary,
    marginLeft: spacing.sm,
  },

  /* certifications */
  certRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: spacing.sm + 2,
  },
  certCheck: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  certText: {
    fontSize: font.body, color: colors.text,
    fontWeight: '500', flex: 1,
  },

  /* availability day chips */
  weekStrip: { marginBottom: spacing.md },
  dayChip: {
    width: 54, height: 68,
    borderRadius: radius.lg,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  dayChipSel: {
    backgroundColor: colors.primary,
    ...shadow.fab,
  },
  dayChipDay: {
    fontSize: font.xs, fontWeight: '500',
    color: colors.textSecondary,
  },
  dayChipNum: {
    fontSize: font.lg, fontWeight: '600',
    color: colors.text, marginTop: 2,
  },
  dayChipTextSel: { color: colors.white },

  /* time slot pills */
  slotGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  slotPill: {
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    marginRight: spacing.sm, marginBottom: spacing.sm,
    ...shadow.card,
  },
  slotPillSel: {
    backgroundColor: colors.primary,
    ...shadow.fab,
  },
  slotPillText: {
    fontSize: font.caption, fontWeight: '500',
    color: colors.text,
  },
  slotPillTextSel: { color: colors.white },
  noSlots: {
    fontSize: font.caption, color: colors.textMuted,
    paddingVertical: spacing.md,
  },

  /* reviews */
  reviewSummary: {
    alignItems: 'center', paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  reviewBigNum: {
    fontSize: 44, fontWeight: '700', color: colors.text,
  },
  reviewStars: {
    flexDirection: 'row', marginTop: spacing.sm,
  },
  reviewTotal: {
    fontSize: font.caption, color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.cardPadding,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  reviewTop: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reviewAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  reviewAvatarText: {
    fontSize: 14, fontWeight: '600', color: colors.primary,
  },
  reviewAuthor: {
    fontSize: font.body, fontWeight: '600', color: colors.text,
  },
  reviewDate: {
    fontSize: font.xs, color: colors.textMuted, marginTop: 1,
  },
  reviewStarsSmall: { flexDirection: 'row' },
  reviewBody: {
    fontSize: font.body, color: colors.textSecondary,
    lineHeight: 22,
  },

  /* bottom bar */
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 4,
    backgroundColor: colors.white,
  },
  btnPlan: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  btnPlanText: {
    fontSize: font.body, fontWeight: '600', color: colors.white,
  },

  /* bottom sheet extras */
  sheetProfile: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  sheetAvatar: {
    width: 44, height: 44, borderRadius: 22,
  },
  sheetName: {
    fontSize: font.body, fontWeight: '600', color: colors.text,
  },
  sheetLabel: {
    fontSize: font.caption, fontWeight: '600',
    color: colors.textSecondary, marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  modeRow: {
    flexDirection: 'row', marginBottom: spacing.lg,
  },
  modePill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceLight,
    marginRight: spacing.sm,
  },
  modePillSel: {
    backgroundColor: colors.primary,
  },
  modePillText: {
    fontSize: font.caption, fontWeight: '500',
    color: colors.textSecondary,
  },
  modePillTextSel: { color: colors.white },
  sheetBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
    marginTop: spacing.md,
  },
  sheetBtnText: {
    fontSize: font.body, fontWeight: '600', color: colors.white,
  },

  /* confirmation */
  confirmWrap: { alignItems: 'center', paddingTop: spacing.md },
  confirmCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  confirmTitle: {
    fontSize: font.xl, fontWeight: '700',
    color: colors.text, marginBottom: spacing.sm,
  },
  confirmSub: {
    fontSize: font.body, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 22,
    marginBottom: spacing.lg,
  },
  confirmDetails: {
    width: '100%',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.cardPadding,
  },
  confirmDetailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8,
  },
  confirmDetailLabel: {
    fontSize: font.caption, color: colors.textSecondary,
  },
  confirmDetailVal: {
    fontSize: font.caption, fontWeight: '600', color: colors.text,
  },

  /* empty */
  emptyWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.white,
  },
  floatBack: {
    position: 'absolute', top: 60, left: 20,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
    ...shadow.card,
  },
  emptyText: {
    fontSize: font.body, color: colors.textMuted,
  },
});
