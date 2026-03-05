export type RootStackParamList = {
  Home: undefined;
  EventEditor: { eventId?: string; date?: string } | undefined;
  EventDetail: { eventId: string };
};
