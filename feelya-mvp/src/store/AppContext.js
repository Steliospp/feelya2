import React, { createContext, useContext, useReducer } from 'react';

/* ═══════════════════════  CONSTANTS  ═══════════════════════ */
export const ALL_TOPICS = [
  // Emotional wellbeing
  'Anxiety', 'Depression', 'Stress', 'Overwhelm', 'Panic Attacks',
  'Emotional Regulation', 'Anger Management', 'Grief', 'Sadness', 'Fear',
  // Confidence & identity
  'Confidence', 'Self-esteem', 'Self-worth', 'Body Image', 'Identity',
  'Imposter Syndrome', 'Perfectionism', 'Self-compassion', 'Assertiveness', 'Vulnerability',
  // Relationships
  'Dating', 'Breakups', 'Friendships', 'Family', 'Boundaries',
  'Conflict Resolution', 'Trust Issues', 'Attachment', 'Codependency', 'Communication',
  // Social
  'Loneliness', 'Social Anxiety', 'Social Skills', 'Making Friends', 'Fitting In',
  'People Pleasing', 'Rejection', 'Public Speaking', 'Networking', 'Small Talk',
  // Career & purpose
  'Career', 'Job Search', 'Career Change', 'Work-Life Balance', 'Workplace Stress',
  'Leadership', 'Entrepreneurship', 'Side Hustle', 'Purpose', 'Meaning',
  // Mindset & growth
  'Mindset', 'Motivation', 'Goal Setting', 'Discipline', 'Procrastination',
  'Decision Making', 'Overthinking', 'Rumination', 'Growth Mindset', 'Resilience',
  // Lifestyle & habits
  'Habits', 'Productivity', 'Time Management', 'Sleep', 'Fitness',
  'Nutrition', 'Morning Routine', 'Digital Detox', 'Minimalism', 'Journaling',
  // Life transitions
  'College Stress', 'Graduation', 'Moving', 'Starting Over', 'Adulting',
  'Quarter-life Crisis', 'Midlife Transition', 'Retirement', 'Empty Nest', 'New Parent',
  // Mental health
  'Burnout', 'Compassion Fatigue', 'Trauma', 'PTSD', 'OCD',
  'ADHD', 'Neurodivergence', 'Addiction', 'Recovery', 'Coping Skills',
  // Spirituality & meaning
  'Spirituality', 'Mindfulness', 'Meditation', 'Gratitude', 'Self-discovery',
  'Values', 'Authenticity', 'Forgiveness', 'Letting Go', 'Inner Peace',
  // Sports & performance
  'Sports', 'Athletic Performance', 'Competition Anxiety', 'Team Dynamics', 'Coaching',
];

export const SENSITIVE_TOPICS = [
  'Anxiety', 'Depression', 'Loneliness', 'Self-esteem', 'Breakups',
  'Grief', 'Trauma', 'PTSD', 'Addiction', 'Recovery',
  'Panic Attacks', 'Sadness', 'Self-worth', 'Burnout',
];

export const TOPIC_CATEGORIES = [
  { id: 'emotional', label: 'Emotional', icon: 'heart-outline', color: '#EF4444', topics: ['Anxiety', 'Depression', 'Stress', 'Overwhelm', 'Panic Attacks', 'Emotional Regulation', 'Anger Management', 'Grief', 'Sadness', 'Fear'] },
  { id: 'confidence', label: 'Confidence', icon: 'trending-up-outline', color: '#F59E0B', topics: ['Confidence', 'Self-esteem', 'Self-worth', 'Body Image', 'Identity', 'Imposter Syndrome', 'Perfectionism', 'Self-compassion', 'Assertiveness', 'Vulnerability'] },
  { id: 'relationships', label: 'Relationships', icon: 'people-outline', color: '#8B5CF6', topics: ['Dating', 'Breakups', 'Friendships', 'Family', 'Boundaries', 'Conflict Resolution', 'Trust Issues', 'Attachment', 'Codependency', 'Communication'] },
  { id: 'social', label: 'Social', icon: 'chatbubbles-outline', color: '#06B6D4', topics: ['Loneliness', 'Social Anxiety', 'Social Skills', 'Making Friends', 'Fitting In', 'People Pleasing', 'Rejection', 'Public Speaking', 'Networking', 'Small Talk'] },
  { id: 'career', label: 'Career', icon: 'briefcase-outline', color: '#4B7BF5', topics: ['Career', 'Job Search', 'Career Change', 'Work-Life Balance', 'Workplace Stress', 'Leadership', 'Entrepreneurship', 'Side Hustle', 'Purpose', 'Meaning'] },
  { id: 'mindset', label: 'Mindset', icon: 'bulb-outline', color: '#10B981', topics: ['Mindset', 'Motivation', 'Goal Setting', 'Discipline', 'Procrastination', 'Decision Making', 'Overthinking', 'Rumination', 'Growth Mindset', 'Resilience'] },
  { id: 'lifestyle', label: 'Lifestyle', icon: 'leaf-outline', color: '#14B8A6', topics: ['Habits', 'Productivity', 'Time Management', 'Sleep', 'Fitness', 'Nutrition', 'Morning Routine', 'Digital Detox', 'Minimalism', 'Journaling'] },
  { id: 'transitions', label: 'Life Changes', icon: 'swap-horizontal-outline', color: '#F97316', topics: ['College Stress', 'Graduation', 'Moving', 'Starting Over', 'Adulting', 'Quarter-life Crisis', 'Midlife Transition', 'Retirement', 'Empty Nest', 'New Parent'] },
  { id: 'mentalhealth', label: 'Mental Health', icon: 'medkit-outline', color: '#EC4899', topics: ['Burnout', 'Compassion Fatigue', 'Trauma', 'PTSD', 'OCD', 'ADHD', 'Neurodivergence', 'Addiction', 'Recovery', 'Coping Skills'] },
  { id: 'spirituality', label: 'Inner Growth', icon: 'sparkles-outline', color: '#A855F7', topics: ['Spirituality', 'Mindfulness', 'Meditation', 'Gratitude', 'Self-discovery', 'Values', 'Authenticity', 'Forgiveness', 'Letting Go', 'Inner Peace'] },
];

export const SESSION_MODES = [
  { id: 'chat', label: 'Chat', icon: 'chatbubble-outline', desc: 'Text-based conversation' },
  { id: 'voice', label: 'Voice', icon: 'mic-outline', desc: 'Audio call' },
  { id: 'video', label: 'Video', icon: 'videocam-outline', desc: 'Face-to-face' },
];

/* ═══════════════  MOCK COMPANIONS  ═══════════════ */
export const MOCK_COMPANIONS = [
  {
    id: 'g1',
    name: 'Maya Chen',
    bio: 'I help people find their confidence and build the mindset to go after what they want. Let\'s figure it out together.',
    topics: ['Confidence', 'Mindset', 'Career', 'Public Speaking', 'Motivation'],
    rating: 4.9,
    conversations: 342,
    badges: ['Top Rated', 'Fast Responder'],
    responseTime: 1,
    ratePerMin: 0.99,
    verified: true,
  },
  {
    id: 'g2',
    name: 'Jordan Ellis',
    bio: 'Real talk about anxiety, sleep, and figuring out college life. No judgment, just honest conversation.',
    topics: ['Anxiety', 'Sleep', 'College Stress', 'Habits', 'Productivity'],
    rating: 4.7,
    conversations: 189,
    badges: ['Empathetic'],
    responseTime: 2,
    ratePerMin: 0.79,
    verified: true,
  },
  {
    id: 'g3',
    name: 'Priya Sharma',
    bio: 'Relationships, friendships, dating -- I\'ve been through it all. Let\'s talk it through.',
    topics: ['Dating', 'Breakups', 'Friendships', 'Family', 'Loneliness', 'Self-esteem'],
    rating: 4.8,
    conversations: 256,
    badges: ['Relationship Pro', 'Top Rated'],
    responseTime: 3,
    ratePerMin: 1.29,
    verified: true,
  },
  {
    id: 'g4',
    name: 'Kai Williams',
    bio: 'Fitness, sports, and the mindset behind both. Let\'s push through together.',
    topics: ['Fitness', 'Sports', 'Motivation', 'Confidence', 'Habits'],
    rating: 4.5,
    conversations: 97,
    badges: ['Active Lifestyle'],
    responseTime: 4,
    ratePerMin: 0.69,
    verified: true,
  },
  {
    id: 'g5',
    name: 'Sam Rivera',
    bio: 'Been through depression, anxiety, career pivots. I get it. Here to listen and share what helped me.',
    topics: ['Depression', 'Anxiety', 'Career', 'Mindset', 'Self-esteem', 'Loneliness'],
    rating: 4.6,
    conversations: 214,
    badges: ['Lived Experience'],
    responseTime: 2,
    ratePerMin: 0.89,
    verified: true,
  },
];

// Keep backward-compat alias
export const MOCK_GUIDES = MOCK_COMPANIONS;

/* ═══════════════  MOCK BLOG RESOURCES  ═══════════════ */
export const BLOG_RESOURCES = [
  {
    id: 'blog1',
    title: '5 ways to calm your mind before bed',
    description: 'Simple techniques that actually work for quieting racing thoughts at night.',
    topics: ['Sleep', 'Anxiety', 'Habits'],
    readTime: '4 min read',
  },
  {
    id: 'blog2',
    title: 'Setting boundaries without guilt',
    description: 'How to protect your energy while keeping relationships healthy.',
    topics: ['Boundaries', 'Family', 'Self-esteem'],
    readTime: '5 min read',
  },
  {
    id: 'blog3',
    title: 'The overthinking trap and how to escape it',
    description: 'Why your brain loops on the same thoughts and what to do about it.',
    topics: ['Overthinking', 'Anxiety', 'Mindset'],
    readTime: '3 min read',
  },
  {
    id: 'blog4',
    title: 'Starting over after a breakup',
    description: 'Practical steps for rebuilding when everything feels uncertain.',
    topics: ['Breakups', 'Self-esteem', 'Starting Over'],
    readTime: '6 min read',
  },
  {
    id: 'blog5',
    title: 'Finding motivation when nothing excites you',
    description: 'What to do when passion and drive feel completely absent.',
    topics: ['Motivation', 'Burnout', 'Purpose'],
    readTime: '4 min read',
  },
];

/* ═══════════════  MOCK AVAILABILITY  ═══════════════ */
export function generateAvailability(guideId) {
  const slots = [];
  const now = new Date();
  for (let d = 0; d < 7; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    const hours = [9, 10, 11, 13, 14, 15, 16, 17];
    const seed = (guideId || 'g1').charCodeAt(1) + d;
    const available = hours.filter((_, i) => (seed + i) % 3 !== 0);
    available.forEach((h) => {
      slots.push({
        id: `${guideId}_${dateStr}_${h}`,
        date: dateStr,
        hour: h,
        label: `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? 'PM' : 'AM'}`,
      });
    });
  }
  return slots;
}

/* ═══════════════  COMMUNITY DATA  ═══════════════ */
export const COMMUNITY_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'anxiety', label: 'Anxiety' },
  { id: 'confidence', label: 'Confidence' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'career', label: 'Career' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'mindset', label: 'Mindset' },
  { id: 'lifestyle', label: 'Lifestyle' },
];

// Keep backward-compat alias
export const FORUM_CATEGORIES = COMMUNITY_CATEGORIES;

const INITIAL_THREADS = [
  {
    id: 't1',
    title: 'How do you deal with Sunday anxiety?',
    body: 'Every Sunday evening I get this wave of dread about the week ahead. Anyone else feel this? What helps you get through it?',
    author: 'Anonymous',
    category: 'anxiety',
    tags: ['Anxiety', 'Habits'],
    createdAt: Date.now() - 86400000 * 2,
    upvotes: 24,
    replyCount: 5,
    bookmarked: false,
  },
  {
    id: 't2',
    title: 'First time speaking up in a meeting',
    body: 'After months of staying quiet, I finally shared my idea in a team meeting today. My voice was shaking but I did it. Just wanted to share this small win.',
    author: 'GrowthMindset',
    category: 'confidence',
    tags: ['Confidence', 'Career'],
    createdAt: Date.now() - 86400000,
    upvotes: 47,
    replyCount: 12,
    bookmarked: false,
  },
  {
    id: 't3',
    title: 'Setting boundaries with family',
    body: 'I love my parents but they have no concept of boundaries. How do you handle family members who constantly overstep without ruining the relationship?',
    author: 'BoundaryBuilder',
    category: 'relationships',
    tags: ['Family', 'Self-esteem'],
    createdAt: Date.now() - 3600000 * 5,
    upvotes: 31,
    replyCount: 8,
    bookmarked: false,
  },
  {
    id: 't4',
    title: 'Career pivot at 28 -- anyone done it?',
    body: 'Thinking about leaving my stable corporate job to pursue something more meaningful. Has anyone made a big career change in their late 20s? How did it go?',
    author: 'CrossroadsCarl',
    category: 'career',
    tags: ['Career', 'Motivation'],
    createdAt: Date.now() - 3600000 * 12,
    upvotes: 19,
    replyCount: 6,
    bookmarked: false,
  },
  {
    id: 't5',
    title: 'Morning routine that actually sticks',
    body: 'After trying dozens of morning routines, I finally found one that works for me: 10 min walk, cold water on face, 5 min journaling. Simple but it changed my mornings.',
    author: 'HabitHacker',
    category: 'wellness',
    tags: ['Habits', 'Productivity'],
    createdAt: Date.now() - 86400000 * 3,
    upvotes: 56,
    replyCount: 15,
    bookmarked: false,
  },
];

const INITIAL_REPLIES = {
  t1: [
    { id: 'r1_1', author: 'CalmCoach', body: 'I do a brain dump on Sunday afternoon. Writing everything down takes the weight off.', createdAt: Date.now() - 86400000, upvotes: 8 },
    { id: 'r1_2', author: 'WeekendWarrior', body: 'Sunday meal prep helps me feel in control of at least one thing going into Monday.', createdAt: Date.now() - 43200000, upvotes: 5 },
  ],
  t2: [
    { id: 'r2_1', author: 'TeamLead', body: 'That takes real courage. The shaking goes away with practice, I promise.', createdAt: Date.now() - 43200000, upvotes: 12 },
    { id: 'r2_2', author: 'QuietStrength', body: 'So proud of you. I need to do the same.', createdAt: Date.now() - 21600000, upvotes: 6 },
  ],
  t3: [
    { id: 'r3_1', author: 'TherapistInTraining', body: 'Start small. "I love you and I need some space right now" is a complete sentence.', createdAt: Date.now() - 3600000, upvotes: 15 },
  ],
  t4: [
    { id: 'r4_1', author: 'PivotPro', body: 'Did it at 29. Best decision ever, but give yourself a financial runway first.', createdAt: Date.now() - 7200000, upvotes: 9 },
  ],
  t5: [
    { id: 'r5_1', author: 'EarlyRiser', body: 'The cold water trick is underrated. Way better than checking your phone first thing.', createdAt: Date.now() - 86400000 * 2, upvotes: 7 },
  ],
};

/* ═══════════════  MATCHING LOGIC  ═══════════════ */
export function matchGuide(userTopics, skipId) {
  const pool = skipId ? MOCK_COMPANIONS.filter((g) => g.id !== skipId) : MOCK_COMPANIONS;
  const scored = pool.map((g) => {
    const overlap = g.topics.filter((t) => userTopics.includes(t)).length;
    return { guide: g, overlap, rating: g.rating };
  });
  scored.sort((a, b) => b.overlap - a.overlap || b.rating - a.rating);
  return scored[0]?.guide ?? null;
}

// Alias
export const matchCompanion = matchGuide;

/* ═══════════════  MOCK CHAT REPLIES  ═══════════════ */
const COMPANION_REPLIES = [
  "Hey, thanks for reaching out. What's on your mind today?",
  "I hear you. That sounds really tough -- want to walk me through it?",
  "You're not alone in feeling that way. A lot of people I talk to go through something similar.",
  "Let's break that down together. What feels most urgent right now?",
  "That's a great insight. How does it feel to say that out loud?",
  "I appreciate you sharing that. It takes courage.",
  "Here's what's worked for some people I've chatted with -- want to try it?",
  "Take your time. There's no rush here.",
];

export function getGuideReply(index) {
  return COMPANION_REPLIES[index % COMPANION_REPLIES.length];
}

export const QUICK_REPLIES = [
  "I'd like to talk about that",
  "Can you tell me more?",
  "That resonates with me",
  "I'm not sure honestly",
  "Let's try something different",
];

/* ═══════════════  INITIAL STATE  ═══════════════ */
const initialState = {
  role: null,
  onboarded: false,
  safetyAcknowledged: false,

  userName: '',
  userBio: '',
  selectedTopics: [],
  sessionMode: null,

  matchedGuide: null,
  matchingInProgress: false,

  activeSession: null,
  userSessions: [],

  guideName: '',
  guideBio: '',
  guideTopics: [],
  guideRate: 0.99,
  guideVerified: false,
  guideOnline: false,
  guideIncomingRequest: null,
  guideActiveSession: null,
  guideEarnings: 0,
  guideSessions: [],

  // Bookings / Chats
  bookings: [
    {
      id: 'b1',
      guideId: 'g1',
      guideName: 'Maya Chen',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      hour: 14,
      timeLabel: '2:00 PM',
      mode: 'chat',
      duration: 30,
      price: 29.70,
      status: 'upcoming',
      topics: ['Confidence', 'Career'],
    },
    {
      id: 'b2',
      guideId: 'g3',
      guideName: 'Priya Sharma',
      date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      hour: 10,
      timeLabel: '10:00 AM',
      mode: 'voice',
      duration: 30,
      price: 38.70,
      status: 'upcoming',
      topics: ['Dating', 'Friendships'],
    },
    {
      id: 'b3',
      guideId: 'g2',
      guideName: 'Jordan Ellis',
      date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
      hour: 15,
      timeLabel: '3:00 PM',
      mode: 'chat',
      duration: 20,
      price: 15.80,
      status: 'completed',
      topics: ['Anxiety', 'Sleep'],
    },
  ],

  // Community
  threads: INITIAL_THREADS,
  replies: INITIAL_REPLIES,
  upvotedThreads: [],
  upvotedReplies: [],
  bookmarkedThreads: [],

  lastGuideId: 'g1',
};

/* ═══════════════  REDUCER  ═══════════════ */
function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_ONBOARDED':
      return { ...state, onboarded: true };
    case 'SET_SAFETY_ACK':
      return { ...state, safetyAcknowledged: true };
    case 'SET_USER_NAME':
      return { ...state, userName: action.payload };
    case 'SET_USER_BIO':
      return { ...state, userBio: action.payload };
    case 'SET_SELECTED_TOPICS':
      return { ...state, selectedTopics: action.payload };
    case 'SET_SESSION_MODE':
      return { ...state, sessionMode: action.payload };
    case 'SET_MATCHING':
      return { ...state, matchingInProgress: action.payload };
    case 'SET_MATCHED_GUIDE':
      return { ...state, matchedGuide: action.payload, matchingInProgress: false };
    case 'START_SESSION':
      return {
        ...state,
        activeSession: {
          guideId: state.matchedGuide.id,
          guideName: state.matchedGuide.name,
          guideRating: state.matchedGuide.rating,
          ratePerMin: state.matchedGuide.ratePerMin,
          mode: state.sessionMode,
          topics: [...state.selectedTopics],
          startedAt: Date.now(),
          messages: [],
          durationSec: 0,
        },
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        activeSession: {
          ...state.activeSession,
          messages: [...(state.activeSession?.messages || []), action.payload],
        },
      };
    case 'UPDATE_DURATION':
      return { ...state, activeSession: { ...state.activeSession, durationSec: action.payload } };
    case 'END_SESSION': {
      const s = state.activeSession;
      if (!s) return state;
      const mins = Math.max(1, Math.ceil(s.durationSec / 60));
      const total = +(mins * s.ratePerMin).toFixed(2);
      const record = {
        id: 'us_' + Date.now(),
        guideId: s.guideId,
        guideName: s.guideName,
        guideRating: s.guideRating,
        topics: s.topics,
        mode: s.mode,
        durationSec: s.durationSec,
        minutes: mins,
        ratePerMin: s.ratePerMin,
        total,
        date: new Date().toISOString(),
        rating: null,
        note: '',
      };
      return {
        ...state,
        activeSession: null,
        matchedGuide: null,
        selectedTopics: [],
        sessionMode: null,
        lastGuideId: s.guideId,
        userSessions: [record, ...state.userSessions],
      };
    }
    case 'RATE_SESSION': {
      const { sessionId, rating, note } = action.payload;
      return {
        ...state,
        userSessions: state.userSessions.map((s) =>
          s.id === sessionId ? { ...s, rating, note } : s
        ),
      };
    }

    // Guide
    case 'SET_GUIDE_NAME':
      return { ...state, guideName: action.payload };
    case 'SET_GUIDE_BIO':
      return { ...state, guideBio: action.payload };
    case 'SET_GUIDE_TOPICS':
      return { ...state, guideTopics: action.payload };
    case 'SET_GUIDE_RATE':
      return { ...state, guideRate: action.payload };
    case 'SET_GUIDE_VERIFIED':
      return { ...state, guideVerified: action.payload };
    case 'SET_GUIDE_ONLINE':
      return { ...state, guideOnline: action.payload };
    case 'SET_GUIDE_INCOMING':
      return { ...state, guideIncomingRequest: action.payload };
    case 'GUIDE_ACCEPT_REQUEST':
      return {
        ...state,
        guideIncomingRequest: null,
        guideActiveSession: {
          userName: state.guideIncomingRequest?.userName || 'Alex',
          mode: state.guideIncomingRequest?.mode || 'chat',
          topics: state.guideIncomingRequest?.topics || [],
          startedAt: Date.now(),
          durationSec: 0,
        },
      };
    case 'GUIDE_DECLINE_REQUEST':
      return { ...state, guideIncomingRequest: null };
    case 'GUIDE_UPDATE_DURATION':
      return { ...state, guideActiveSession: { ...state.guideActiveSession, durationSec: action.payload } };
    case 'GUIDE_END_SESSION': {
      const gs = state.guideActiveSession;
      if (!gs) return state;
      const gMins = Math.max(1, Math.ceil(gs.durationSec / 60));
      const earned = +(gMins * state.guideRate).toFixed(2);
      const rec = {
        id: 'gs_' + Date.now(),
        userName: gs.userName,
        topics: gs.topics,
        mode: gs.mode,
        durationSec: gs.durationSec,
        minutes: gMins,
        ratePerMin: state.guideRate,
        earned,
        date: new Date().toISOString(),
      };
      return {
        ...state,
        guideActiveSession: null,
        guideEarnings: +(state.guideEarnings + earned).toFixed(2),
        guideSessions: [rec, ...state.guideSessions],
      };
    }

    // Bookings
    case 'ADD_BOOKING':
      return { ...state, bookings: [action.payload, ...state.bookings] };
    case 'CANCEL_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.payload ? { ...b, status: 'cancelled' } : b
        ),
      };
    case 'RESCHEDULE_BOOKING': {
      const { bookingId, date, hour, timeLabel } = action.payload;
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === bookingId ? { ...b, date, hour, timeLabel } : b
        ),
      };
    }

    // Community
    case 'ADD_THREAD': {
      const thread = { id: 't_' + Date.now(), ...action.payload, createdAt: Date.now(), upvotes: 0, replyCount: 0, bookmarked: false };
      return { ...state, threads: [thread, ...state.threads] };
    }
    case 'ADD_REPLY': {
      const { threadId, reply } = action.payload;
      const newReply = { id: 'r_' + Date.now(), ...reply, createdAt: Date.now(), upvotes: 0 };
      const existing = state.replies[threadId] || [];
      return {
        ...state,
        replies: { ...state.replies, [threadId]: [...existing, newReply] },
        threads: state.threads.map((t) => t.id === threadId ? { ...t, replyCount: t.replyCount + 1 } : t),
      };
    }
    case 'TOGGLE_THREAD_UPVOTE': {
      const tid = action.payload;
      const up = state.upvotedThreads.includes(tid);
      return {
        ...state,
        upvotedThreads: up ? state.upvotedThreads.filter((id) => id !== tid) : [...state.upvotedThreads, tid],
        threads: state.threads.map((t) => t.id === tid ? { ...t, upvotes: t.upvotes + (up ? -1 : 1) } : t),
      };
    }
    case 'TOGGLE_REPLY_UPVOTE': {
      const { threadId: tId, replyId } = action.payload;
      const rup = state.upvotedReplies.includes(replyId);
      const reps = state.replies[tId] || [];
      return {
        ...state,
        upvotedReplies: rup ? state.upvotedReplies.filter((id) => id !== replyId) : [...state.upvotedReplies, replyId],
        replies: { ...state.replies, [tId]: reps.map((r) => r.id === replyId ? { ...r, upvotes: r.upvotes + (rup ? -1 : 1) } : r) },
      };
    }
    case 'TOGGLE_BOOKMARK': {
      const bmId = action.payload;
      const bm = state.bookmarkedThreads.includes(bmId);
      return {
        ...state,
        bookmarkedThreads: bm ? state.bookmarkedThreads.filter((id) => id !== bmId) : [...state.bookmarkedThreads, bmId],
      };
    }

    case 'RESET':
      return { ...initialState, threads: INITIAL_THREADS, replies: { ...INITIAL_REPLIES } };
    default:
      return state;
  }
}

/* ═══════════════  CONTEXT  ═══════════════ */
const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
