import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMinutes, addHours } from 'date-fns';
import { CalendarEvent } from '../types/Event';
import { v4 as uuid } from 'uuid';

const EVENTS_KEY = 'EVENTPULSE_EVENTS_V1';

export async function loadEvents(): Promise<CalendarEvent[]> {
  const raw = await AsyncStorage.getItem(EVENTS_KEY);
  if (!raw) {
    const seeded = seedEvents();
    await persistEvents(seeded);
    return seeded;
  }

  try {
    return JSON.parse(raw) as CalendarEvent[];
  } catch (error) {
    console.warn('Unable to parse events cache, resetting', error);
    await AsyncStorage.removeItem(EVENTS_KEY);
    return [];
  }
}

export async function persistEvents(events: CalendarEvent[]) {
  await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

function seedEvents(): CalendarEvent[] {
  const now = new Date();
  const kickoff: CalendarEvent = {
    id: uuid(),
    title: 'Product kickoff',
    description: 'Share roadmap milestones and align priorities.',
    location: 'Hybrid · Project room 3',
    startDate: addHours(now, 2).toISOString(),
    endDate: addHours(now, 3).toISOString(),
    isAllDay: false,
    reminders: ['15m', '5m'],
    participants: ['you@company.com', 'team@company.com'],
    sharedWith: ['team@company.com'],
    owner: 'you@company.com',
    notificationIds: [],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    color: '#6C63FF',
  };

  const focus: CalendarEvent = {
    id: uuid(),
    title: 'Focus block',
    description: 'Deep work to finish planning notes.',
    location: 'Anywhere',
    startDate: addHours(now, 26).toISOString(),
    endDate: addHours(now, 28).toISOString(),
    isAllDay: false,
    reminders: ['1h'],
    participants: ['you@company.com'],
    sharedWith: [],
    owner: 'you@company.com',
    notificationIds: [],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    color: '#FF6584',
  };

  return [kickoff, focus];
}
