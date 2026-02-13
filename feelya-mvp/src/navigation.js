import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, font } from './theme';

// Shared
import SplashScreen from './screens/shared/SplashScreen';
import RoleSelectScreen from './screens/shared/RoleSelectScreen';
import SafetyDisclaimerScreen from './screens/shared/SafetyDisclaimerScreen';

// User
import UserOnboardingScreen from './screens/user/UserOnboardingScreen';
import UserHomeScreen from './screens/user/UserHomeScreen';
import TopicSelectScreen from './screens/user/TopicSelectScreen';
import SessionModeSelectScreen from './screens/user/SessionModeSelectScreen';
import MatchingScreen from './screens/user/MatchingScreen';
import GuideFoundScreen from './screens/user/GuideFoundScreen';
import SessionChatScreen from './screens/user/SessionChatScreen';
import SessionCallScreen from './screens/user/SessionCallScreen';
import SessionSummaryScreen from './screens/user/SessionSummaryScreen';
import RateGuideScreen from './screens/user/RateGuideScreen';
import GuideProfileScreen from './screens/user/GuideProfileScreen';
import ProfileScreen from './screens/user/ProfileScreen';

// Forums
import ForumsHomeScreen from './screens/user/forums/ForumsHomeScreen';
import ThreadScreen from './screens/user/forums/ThreadScreen';
import CreatePostScreen from './screens/user/forums/CreatePostScreen';

// Bookings
import BookingsScreen from './screens/user/bookings/BookingsScreen';
import BookingDetailScreen from './screens/user/bookings/BookingDetailScreen';

// Guide
import GuideOnboardingScreen from './screens/guide/GuideOnboardingScreen';
import GuideTopicsAndRateScreen from './screens/guide/GuideTopicsAndRateScreen';
import GuideVerificationScreen from './screens/guide/GuideVerificationScreen';
import GuideHomeScreen from './screens/guide/GuideHomeScreen';
import IncomingRequestScreen from './screens/guide/IncomingRequestScreen';
import GuideSessionScreen from './screens/guide/GuideSessionScreen';
import GuideEarningsScreen from './screens/guide/GuideEarningsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStackNav = createNativeStackNavigator();
const ForumsStackNav = createNativeStackNavigator();
const BookingsStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();

const stackDefaults = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.bg },
  animation: 'none',
};

function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={stackDefaults}>
      <HomeStackNav.Screen name="HomeMain" component={UserHomeScreen} />
      <HomeStackNav.Screen name="TopicSelect" component={TopicSelectScreen} />
      <HomeStackNav.Screen name="SessionModeSelect" component={SessionModeSelectScreen} />
      <HomeStackNav.Screen name="Matching" component={MatchingScreen} options={{ gestureEnabled: false }} />
      <HomeStackNav.Screen name="GuideFound" component={GuideFoundScreen} options={{ gestureEnabled: false }} />
      <HomeStackNav.Screen name="SessionChat" component={SessionChatScreen} options={{ gestureEnabled: false }} />
      <HomeStackNav.Screen name="SessionCall" component={SessionCallScreen} options={{ gestureEnabled: false }} />
      <HomeStackNav.Screen name="SessionSummary" component={SessionSummaryScreen} options={{ gestureEnabled: false }} />
      <HomeStackNav.Screen name="RateGuide" component={RateGuideScreen} options={{ gestureEnabled: false }} />
      <HomeStackNav.Screen name="GuideProfile" component={GuideProfileScreen} />
    </HomeStackNav.Navigator>
  );
}

function ForumsStack() {
  return (
    <ForumsStackNav.Navigator screenOptions={stackDefaults}>
      <ForumsStackNav.Screen name="ForumsMain" component={ForumsHomeScreen} />
      <ForumsStackNav.Screen name="Thread" component={ThreadScreen} />
      <ForumsStackNav.Screen name="CreatePost" component={CreatePostScreen} />
    </ForumsStackNav.Navigator>
  );
}

function BookingsStackNavigator() {
  return (
    <BookingsStackNav.Navigator screenOptions={stackDefaults}>
      <BookingsStackNav.Screen name="BookingsMain" component={BookingsScreen} />
      <BookingsStackNav.Screen name="BookingDetail" component={BookingDetailScreen} />
      <BookingsStackNav.Screen name="GuideProfileBooking" component={GuideProfileScreen} />
    </BookingsStackNav.Navigator>
  );
}

function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={stackDefaults}>
      <ProfileStackNav.Screen name="ProfileMain" component={ProfileScreen} />
    </ProfileStackNav.Navigator>
  );
}

const TAB_ICONS = {
  Home: { active: 'home', inactive: 'home-outline' },
  Forums: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  Bookings: { active: 'calendar', inactive: 'calendar-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const icons = TAB_ICONS[route.name];
          return <Ionicons name={focused ? icons.active : icons.inactive} size={22} color={color} />;
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 6,
          height: 84,
        },
        tabBarLabelStyle: {
          fontSize: font.xs,
          fontWeight: '500',
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Forums" component={ForumsStack} />
      <Tab.Screen name="Bookings" component={BookingsStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={stackDefaults}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
      <Stack.Screen name="SafetyDisclaimer" component={SafetyDisclaimerScreen} />
      <Stack.Screen name="UserOnboarding" component={UserOnboardingScreen} />
      <Stack.Screen name="UserTabs" component={UserTabs} />
      <Stack.Screen name="GuideOnboarding" component={GuideOnboardingScreen} />
      <Stack.Screen name="GuideTopicsAndRate" component={GuideTopicsAndRateScreen} />
      <Stack.Screen name="GuideVerification" component={GuideVerificationScreen} />
      <Stack.Screen name="GuideHome" component={GuideHomeScreen} />
      <Stack.Screen name="IncomingRequest" component={IncomingRequestScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="GuideSession" component={GuideSessionScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="GuideEarnings" component={GuideEarningsScreen} />
    </Stack.Navigator>
  );
}
