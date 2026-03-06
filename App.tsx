import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import EventEditorScreen from './src/screens/EventEditorScreen';
import EventDetailScreen from './src/screens/EventDetailScreen';
import { EventsProvider } from './src/context/EventsContext';
import { configureNotificationChannel, ensureNotificationPermissions } from './src/services/notifications';
import { RootStackParamList } from './src/navigation/types';
import * as Crypto from 'expo-crypto';

if (typeof global.crypto !== 'object') {
  global.crypto = {
    getRandomValues: (array: any) => Crypto.getRandomValues(array),
  } as any;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    (async () => {
      await configureNotificationChannel();
      await ensureNotificationPermissions();
    })();
  }, []);

  return (
    <EventsProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: true }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'EventPulse' }} />
          <Stack.Screen name="EventEditor" component={EventEditorScreen} options={{ title: 'Event' }} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ title: 'Event details' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </EventsProvider>
  );
}

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
  },
};
