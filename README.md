# EventPulse

EventPulse is a lightweight cross-platform (iOS + Android) scheduler built with Expo/React Native. It ships with:

- Calendar-centric home screen powered by `react-native-calendars`.
- Persistent local storage via AsyncStorage to keep events offline-first.
- Local push notifications through `expo-notifications` with configurable reminder presets.
- Event creation/editing with participant management and quick sharing through the native share sheet.


This application is only for research purposes only.

## Getting started

1. **Install dependencies** (requires Node 18+, npm 9+):

   ```bash
   npm install
   ```

2. **Start the Expo dev server**:

   ```bash
   npm run start
   ```

3. **Run on a device or simulator**:
   - Press `i` for iOS simulator, `a` for Android emulator.
   - Or scan the QR code with the Expo Go app for on-device testing.

> ℹ️ The repository ships with placeholder assets in `assets/`. Replace them with production-ready icons and audio before releasing to stores.

## Architecture overview

```
App.tsx
└── src/
    ├─ context/EventsContext.tsx      ← global event store + notification hooks
    ├─ services/notifications.ts      ← helpers to request/schedule/cancel reminders
    ├─ services/storage.ts            ← AsyncStorage persistence + seed data
    ├─ screens/
    │   ├─ HomeScreen.tsx             ← calendar view + filtered agenda
    │   ├─ EventEditorScreen.tsx      ← create/update form + reminder controls
    │   └─ EventDetailScreen.tsx      ← share/delete actions and metadata
    ├─ components/                    ← cards, selectors, chips, empty states
    ├─ hooks/useEventForm.ts          ← form state helper for editor screen
    ├─ navigation/types.ts            ← typed route definitions
    └─ utils/dates.ts                 ← formatting helpers
```

## Notifications

- `ensureNotificationPermissions()` runs once on launch to request the necessary permissions.
- When an event is created or updated, reminder presets are converted to offsets and scheduled via `expo-notifications`.
- Deleting or editing events cancels previously scheduled notifications to avoid duplicates.

## Sharing

Event details are dispatched through the OS share sheet (text payload with title/time/location). This keeps the app lightweight; you can later integrate deep links or backend invites without rewriting UI layers.

## Next steps / enhancements

- Wire up cloud sync (Supabase/Firebase) so shared events stay in sync across devices.
- Add RSVP/status per participant and attach ICS exports in the share payload.
- Expand the notification system with smart suggestions (travel time, follow-up reminders).
- Harden input validation (conflicting ranges, email validation) and add unit tests around `EventsContext` reducers.

