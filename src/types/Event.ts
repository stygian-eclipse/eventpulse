export type ReminderPreset = 'at_time' | '5m' | '15m' | '1h' | '1d';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  isAllDay: boolean;
  reminders: ReminderPreset[];
  participants: string[];
  notificationIds?: string[];
  owner: string;
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
  color: string;
}
