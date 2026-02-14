import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, shadow } from './theme';

// Shared
import SplashScreen from './screens/shared/SplashScreen';
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

/* ───── Center FAB Button ───── */
function CenterTabButton({ onPress }) {
  return (
    <TouchableOpacity
      style={tabStyles.fabContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={tabStyles.fab}>
        <Ionicons name="add" size={28} color={colors.white} />
      </View>
    </TouchableOpacity>
  );
}

/* ───── Placeholder screen for center tab ───── */
function DummyScreen() {
  return null;
}

const TAB_ICONS = {
  Home: { active: 'home', inactive: 'home-outline' },
  Community: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  StartSession: { active: 'add', inactive: 'add' },
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
          if (!icons) return null;
          return <Ionicons name={focused ? icons.active : icons.inactive} size={22} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          paddingTop: 8,
          height: 88,
          ...shadow.tab,
        },
        tabBarLabelStyle: {
          fontSize: font.xs,
          fontWeight: '500',
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Community" component={ForumsStack} />
      <Tab.Screen
        name="StartSession"
        component={DummyScreen}
        options={{
          tabBarLabel: () => null,
          tabBarButton: (props) => (
            <CenterTabButton {...props} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Home', { screen: 'TopicSelect' });
          },
        })}
      />
      <Tab.Screen name="Bookings" component={BookingsStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={stackDefaults}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="SafetyDisclaimer" component={SafetyDisclaimerScreen} />
      <Stack.Screen name="UserOnboarding" component={UserOnboardingScreen} />
      <Stack.Screen name="UserTabs" component={UserTabs} />
    </Stack.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  fabContainer: {
    top: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.fab,
  },
});
