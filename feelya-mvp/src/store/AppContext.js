import React, { createContext, useContext, useReducer, useCallback } from 'react';

/* ═══════════════════════  CONSTANTS  ═══════════════════════ */
export const ALL_TOPICS = [
  'Anxiety', 'Depression', 'Confidence', 'Mindset', 'Loneliness',
  'Public Speaking', 'Dating', 'Friendships', 'Family', 'Fitness',
  'Sports', 'Career', 'College Stress', 'Motivation', 'Habits',
  'Breakups', 'Sleep', 'Productivity', 'Self-esteem',
];

export const SENSITIVE_TOPICS = ['Anxiety', 'Depression', 'Loneliness', 'Self-esteem', 'Breakups'];

export const SESSION_MODES = [
  { id: 'chat', label: 'Chat', icon: '\u{1F4AC}', desc: 'Text-based guidance' },
  { id: 'voice', label: 'Voice', icon: '\u{1F3A4}', desc: 'Audio call' },
  { id: 'video', label: 'Video', icon: '\u{1F4F9}', desc: 'Face-to-face' },
];

/* ═══════════════  MOCK GUIDES (static pool)  ═══════════════ */
export const MOCK_GUIDES = [
  {
    id: 'g1',
    name: 'Maya Chen',
    bio: 'Life coach specialising in mindset shifts & confidence building.',
    topics: ['Confidence', 'Mindset', 'Career', 'Public Speaking', 'Motivation'],
    rating: 4.9,
    sessions: 342,
    badges: ['Top Rated', 'Fast Responder'],
    responseTime: 1,
    ratePerMin: 0.99,
    verified: true,
  },
  {
    id: 'g2',
    name: 'Jordan Ellis',
    bio: 'Peer wellness guide — real talk about anxiety, sleep & college life.',
    topics: ['Anxiety', 'Sleep', 'College Stress', 'Habits', 'Productivity'],
    rating: 4.7,
    sessions: 189,
    badges: ['Empathetic'],
    responseTime: 2,
    ratePerMin: 0.79,
    verified: true,
  },
  {
    id: 'g3',
    name: 'Priya Sharma',
    bio: 'Relationship & social dynamics coach. No judgement, just vibes.',
    topics: ['Dating', 'Breakups', 'Friendships', 'Family', 'Loneliness', 'Self-esteem'],
    rating: 4.8,
    sessions: 256,
    badges: ['Relationship Pro', 'Top Rated'],
    responseTime: 3,
    ratePerMin: 1.29,
    verified: true,
  },
  {
    id: 'g4',
    name: 'Kai Williams',
    bio: 'Fitness mindset + sports performance peer guide.',
    topics: ['Fitness', 'Sports', 'Motivation', 'Confidence', 'Habits'],
    rating: 4.5,
    sessions: 97,
    badges: ['Active Lifestyle'],
    responseTime: 4,
    ratePerMin: 0.69,
    verified: true,
  },
  {
    id: 'g5',
    name: 'Sam Rivera',
    bio: 'Been through it all — depression, anxiety, career pivots. Here to listen.',
    topics: ['Depression', 'Anxiety', 'Career', 'Mindset', 'Self-esteem', 'Loneliness'],
    rating: 4.6,
    sessions: 214,
    badges: ['Lived Experience'],
    responseTime: 2,
    ratePerMin: 0.89,
    verified: true,
  },
];

/* ═══════════════  MATCHING LOGIC  ═══════════════ */
export function matchGuide(userTopics) {
  const scored = MOCK_GUIDES.map((g) => {
    const overlap = g.topics.filter((t) => userTopics.includes(t)).length;
    return { guide: g, overlap, rating: g.rating };
  });
  scored.sort((a, b) => b.overlap - a.overlap || b.rating - a.rating);
  return scored[0]?.guide ?? null;
}

/* ═══════════════  MOCK CHAT REPLIES  ═══════════════ */
const GUIDE_REPLIES = [
  "Hey, thanks for reaching out. What's on your mind today?",
  "I hear you. That sounds really tough — want to walk me through it?",
  "You're not alone in feeling that way. A lot of people I talk to go through something similar.",
  "Let's break that down together. What feels most urgent right now?",
  "That's a great insight. How does it feel to say that out loud?",
  "I appreciate you sharing that. It takes courage.",
  "Here's what's worked for some people I've guided — want to try it?",
  "Take your time. There's no rush here.",
];

export function getGuideReply(index) {
  return GUIDE_REPLIES[index % GUIDE_REPLIES.length];
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
  // Role: null | 'user' | 'guide'
  role: null,
  onboarded: false,
  safetyAcknowledged: false,

  // User profile
  userName: '',
  selectedTopics: [],
  sessionMode: null,

  // Matching
  matchedGuide: null,
  matchingInProgress: false,

  // Active session
  activeSession: null, // { guideId, guideName, mode, startedAt, messages[], durationSec }

  // History (user)
  userSessions: [],

  // Guide profile
  guideName: '',
  guideBio: '',
  guideTopics: [],
  guideRate: 0.99,
  guideVerified: false,
  guideOnline: false,

  // Guide: incoming request simulation
  guideIncomingRequest: null, // { userName, topics, mode, estimatedEarnings }

  // Guide: active session
  guideActiveSession: null, // { userName, mode, startedAt, durationSec }

  // Guide: earnings & history
  guideEarnings: 0,
  guideSessions: [],
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
      return {
        ...state,
        activeSession: {
          ...state.activeSession,
          durationSec: action.payload,
        },
      };
    case 'END_SESSION': {
      const s = state.activeSession;
      if (!s) return state;
      const mins = Math.max(1, Math.ceil(s.durationSec / 60));
      const total = +(mins * s.ratePerMin).toFixed(2);
      const record = {
        id: 'us_' + Date.now(),
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

    // Guide actions
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
      return {
        ...state,
        guideActiveSession: {
          ...state.guideActiveSession,
          durationSec: action.payload,
        },
      };
    case 'GUIDE_END_SESSION': {
      const gs = state.guideActiveSession;
      if (!gs) return state;
      const mins = Math.max(1, Math.ceil(gs.durationSec / 60));
      const earned = +(mins * state.guideRate).toFixed(2);
      const record = {
        id: 'gs_' + Date.now(),
        userName: gs.userName,
        topics: gs.topics,
        mode: gs.mode,
        durationSec: gs.durationSec,
        minutes: mins,
        ratePerMin: state.guideRate,
        earned,
        date: new Date().toISOString(),
      };
      return {
        ...state,
        guideActiveSession: null,
        guideEarnings: +(state.guideEarnings + earned).toFixed(2),
        guideSessions: [record, ...state.guideSessions],
      };
    }

    case 'RESET':
      return { ...initialState };
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
