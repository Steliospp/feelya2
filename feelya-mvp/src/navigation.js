import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, font } from './theme';

// Shared
import SplashScreen from './screens/shared/SplashScreen';
import RoleSelectScreen from './screens/shared/RoleSelectScreen';
import SafetyDisclaimerScreen from './screens/shared/SafetyDisclaimerScreen';
import SettingsScreen from './screens/shared/SettingsScreen';

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

// Guide
import GuideOnboardingScreen from './screens/guide/GuideOnboardingScreen';
import GuideTopicsAndRateScreen from './screens/guide/GuideTopicsAndRateScreen';
import GuideVerificationScreen from './screens/guide/GuideVerificationScreen';
import GuideHomeScreen from './screens/guide/GuideHomeScreen';
import IncomingRequestScreen from './screens/guide/IncomingRequestScreen';
import GuideSessionScreen from './screens/guide/GuideSessionScreen';
import GuideEarningsScreen from './screens/guide/GuideEarningsScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.bg },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '700', fontSize: font.md },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.bg },
  animation: 'slide_from_right',
};

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {/* Shared onboarding */}
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RoleSelect"
        component={RoleSelectScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SafetyDisclaimer"
        component={SafetyDisclaimerScreen}
        options={{ headerShown: false }}
      />

      {/* User flow */}
      <Stack.Screen
        name="UserOnboarding"
        component={UserOnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserHome"
        component={UserHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TopicSelect"
        component={TopicSelectScreen}
        options={{ title: 'Topics', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="SessionModeSelect"
        component={SessionModeSelectScreen}
        options={{ title: 'Session Mode', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="Matching"
        component={MatchingScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="GuideFound"
        component={GuideFoundScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="SessionChat"
        component={SessionChatScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="SessionCall"
        component={SessionCallScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="SessionSummary"
        component={SessionSummaryScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="RateGuide"
        component={RateGuideScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      {/* Guide flow */}
      <Stack.Screen
        name="GuideOnboarding"
        component={GuideOnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GuideTopicsAndRate"
        component={GuideTopicsAndRateScreen}
        options={{ title: 'Topics & Rate', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="GuideVerification"
        component={GuideVerificationScreen}
        options={{ title: 'Verification', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="GuideHome"
        component={GuideHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IncomingRequest"
        component={IncomingRequestScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="GuideSession"
        component={GuideSessionScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="GuideEarnings"
        component={GuideEarningsScreen}
        options={{ title: 'Earnings', headerBackTitle: 'Back' }}
      />

      {/* Shared */}
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings', headerBackTitle: 'Back' }}
      />
    </Stack.Navigator>
  );
}
