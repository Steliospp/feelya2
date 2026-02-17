import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, font, radius, shadow } from './theme';

/* ═══════════════  SCREEN IMPORTS  ═══════════════ */
// Shared
import SplashScreen from './screens/shared/SplashScreen';
import SafetyDisclaimerScreen from './screens/shared/SafetyDisclaimerScreen';

// User
import UserOnboardingScreen from './screens/user/UserOnboardingScreen';
import UserHomeScreen from './screens/user/UserHomeScreen';
import TopicSelectScreen from './screens/user/TopicSelectScreen';
import TopicHubScreen from './screens/user/TopicHubScreen';
import SessionModeSelectScreen from './screens/user/SessionModeSelectScreen';
import MatchingScreen from './screens/user/MatchingScreen';
import GuideFoundScreen from './screens/user/GuideFoundScreen';
import SessionChatScreen from './screens/user/SessionChatScreen';
import SessionCallScreen from './screens/user/SessionCallScreen';
import SessionSummaryScreen from './screens/user/SessionSummaryScreen';
import RateGuideScreen from './screens/user/RateGuideScreen';
import GuideProfileScreen from './screens/user/GuideProfileScreen';
import ProfileScreen from './screens/user/ProfileScreen';
import MyGuidesScreen from './screens/user/MyGuidesScreen';
import SavedDiscussionsScreen from './screens/user/SavedDiscussionsScreen';
import AllTopicsScreen from './screens/user/AllTopicsScreen';
import TopicRefineScreen from './screens/user/TopicRefineScreen';
import ChooseSupportTypeScreen from './screens/user/ChooseSupportTypeScreen';
import ChooseConnectionModeScreen from './screens/user/ChooseConnectionModeScreen';
import BrowseOnlineScreen from './screens/user/BrowseOnlineScreen';
import ScheduleSessionScreen from './screens/user/ScheduleSessionScreen';
import CategoryDetailScreen from './screens/user/CategoryDetailScreen';
import SubtopicScreen from './screens/user/SubtopicScreen';
import ChatsScreen from './screens/user/ChatsScreen';
import ResourceDetailScreen from './screens/user/ResourceDetailScreen';

// Bookings
import BookingDetailScreen from './screens/user/bookings/BookingDetailScreen';

// Community (Forums)
import ForumsHomeScreen from './screens/user/forums/ForumsHomeScreen';
import ThreadScreen from './screens/user/forums/ThreadScreen';
import CreatePostScreen from './screens/user/forums/CreatePostScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ═══════════════  STACK NAVIGATORS  ═══════════════ */
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={UserHomeScreen} />
      <Stack.Screen name="TopicSelect" component={TopicSelectScreen} />
      <Stack.Screen name="TopicHub" component={TopicHubScreen} />
      <Stack.Screen name="AllTopics" component={AllTopicsScreen} />
      <Stack.Screen name="TopicRefine" component={TopicRefineScreen} />
      <Stack.Screen name="ChooseSupportType" component={ChooseSupportTypeScreen} />
      <Stack.Screen name="ChooseConnectionMode" component={ChooseConnectionModeScreen} />
      <Stack.Screen name="BrowseOnline" component={BrowseOnlineScreen} />
      <Stack.Screen name="ScheduleSession" component={ScheduleSessionScreen} />
      <Stack.Screen name="SessionModeSelect" component={SessionModeSelectScreen} />
      <Stack.Screen name="Matching" component={MatchingScreen} />
      <Stack.Screen name="GuideFound" component={GuideFoundScreen} />
      <Stack.Screen name="SessionChat" component={SessionChatScreen} />
      <Stack.Screen name="SessionCall" component={SessionCallScreen} />
      <Stack.Screen name="SessionSummary" component={SessionSummaryScreen} />
      <Stack.Screen name="RateGuide" component={RateGuideScreen} />
      <Stack.Screen name="GuideProfile" component={GuideProfileScreen} />
      <Stack.Screen name="HomeChatDetail" component={BookingDetailScreen} />
      <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
      <Stack.Screen name="Subtopic" component={SubtopicScreen} />
      <Stack.Screen name="HomeThread" component={ThreadScreen} />
      <Stack.Screen name="HomeResourceDetail" component={ResourceDetailScreen} />
    </Stack.Navigator>
  );
}

function CommunityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommunityMain" component={ForumsHomeScreen} />
      <Stack.Screen name="Thread" component={ThreadScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="CommunityResourceDetail" component={ResourceDetailScreen} />
    </Stack.Navigator>
  );
}

function ChatsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatsMain" component={ChatsScreen} />
      <Stack.Screen name="ChatDetail" component={BookingDetailScreen} />
      <Stack.Screen name="GuideProfileChats" component={GuideProfileScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="MyGuides" component={MyGuidesScreen} />
      <Stack.Screen name="SavedDiscussions" component={SavedDiscussionsScreen} />
    </Stack.Navigator>
  );
}

/* ═══════════════  TALK BUTTON  ═══════════════ */
function TalkButton({ onPress }) {
  return (
    <TouchableOpacity
      style={styles.talkContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.talkBtn}>
        <Ionicons name="chatbubble-ellipses" size={18} color={colors.white} />
        <Text style={styles.talkText}>Talk to someone</Text>
      </View>
    </TouchableOpacity>
  );
}

/* Placeholder component for the Talk tab (never renders) */
function Placeholder() {
  return null;
}

/* ═══════════════  TAB NAVIGATOR  ═══════════════ */
function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          borderTopWidth: 0,
          backgroundColor: colors.surface,
          ...shadow.tab,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const iconMap = {
            Home: focused ? 'home' : 'home-outline',
            Community: focused ? 'people' : 'people-outline',
            StartChat: 'add',
            Chats: focused ? 'pulse' : 'pulse-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={iconMap[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Home', { screen: 'HomeMain' });
          },
        })}
      />
      <Tab.Screen name="Community" component={CommunityStack} />
      <Tab.Screen
        name="StartChat"
        component={Placeholder}
        options={{
          tabBarLabel: () => null,
          tabBarButton: (props) => (
            <TalkButton
              onPress={() => {
                props.onPress?.();
              }}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Home', { screen: 'TopicSelect' });
          },
        })}
      />
      <Tab.Screen name="Chats" component={ChatsStack} options={{ tabBarLabel: 'Activity' }} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

/* ═══════════════  ROOT NAVIGATOR  ═══════════════ */
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="SafetyDisclaimer" component={SafetyDisclaimerScreen} />
      <Stack.Screen name="UserOnboarding" component={UserOnboardingScreen} />
      <Stack.Screen name="UserTabs" component={UserTabs} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  talkContainer: {
    top: -12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  talkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius.full,
    ...shadow.fab,
  },
  talkText: {
    color: colors.white,
    fontSize: font.caption,
    fontWeight: '600',
    marginLeft: 6,
  },
});
