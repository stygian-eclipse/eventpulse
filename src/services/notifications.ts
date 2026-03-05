import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { CalendarEvent, ReminderPreset } from '../types/Event';

const reminderOffsets: Record<ReminderPreset, number> = {
  at_time: 0,
  '5m': 5,
  '15m': 15,
  '1h': 60,
  '1d': 60 * 24,
};

export async function ensureNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.warn('Push notifications only work on physical devices.');
    return false;
  }

  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }

  const request = await Notifications.requestPermissionsAsync();
  return request.granted || request.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

export async function configureNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('events', {
      name: 'Event reminders',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}

export function reminderToOffset(reminder: ReminderPreset) {
  return reminderOffsets[reminder];
}

export async function scheduleEventNotifications(event: CalendarEvent) {
  const schedules = await Promise.all(
    event.reminders.map(async (reminder) => {
      const offsetMinutes = reminderToOffset(reminder);
      const triggerDate = new Date(new Date(event.startDate).getTime() - offsetMinutes * 60 * 1000);
      if (Number.isNaN(triggerDate.getTime()) || triggerDate.getTime() <= Date.now()) {
        return null;
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: event.title,
          body: reminder === 'at_time' ? 'Your event is starting now' : `Starts at ${new Date(event.startDate).toLocaleTimeString()}`,
          data: { eventId: event.id },
        },
        trigger: triggerDate,
      });
      return id;
    })
  );

  return schedules.filter((value): value is string => Boolean(value));
}

export async function cancelEventNotifications(notificationIds?: string[]) {
  if (!notificationIds?.length) return;
  await Promise.all(notificationIds.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}
