import React, { useMemo, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../navigation/types';
import { useEvents } from '../context/EventsContext';
import { useEventForm } from '../hooks/useEventForm';
import ReminderSelector from '../components/ReminderSelector';
import ParticipantChips from '../components/ParticipantChips';

const EventEditorScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EventEditor'>>();
  const eventId = route.params?.eventId;
  const defaultDate = route.params?.date;
  const { events, createEvent, updateEvent } = useEvents();
  const existing = useMemo(() => events.find((evt) => evt.id === eventId), [events, eventId]);
  const { state, setField, toggleReminder, addParticipant, removeParticipant } = useEventForm(existing);
  const [participantInput, setParticipantInput] = useState('');
  const [startPickerVisible, setStartPickerVisible] = useState(false);
  const [endPickerVisible, setEndPickerVisible] = useState(false);

  React.useEffect(() => {
    if (!existing && defaultDate) {
      const asDate = new Date(defaultDate);
      if (!Number.isNaN(asDate.getTime())) {
        setField('startDate', asDate);
        setField('endDate', new Date(asDate.getTime() + 60 * 60 * 1000));
      }
    }
  }, [defaultDate, existing, setField]);

  const save = async () => {
    try {
      const payload = {
        title: state.title,
        description: state.description,
        location: state.location,
        startDate: state.startDate.toISOString(),
        endDate: state.endDate.toISOString(),
        reminders: state.reminders,
        participants: state.participants,
        isAllDay: state.isAllDay,
        color: state.color,
      };

      if (existing) {
        await updateEvent(existing.id, payload);
      } else {
        const created = await createEvent(payload);
        navigation.replace('EventDetail', { eventId: created.id });
        return;
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Unable to save event', (error as Error).message);
    }
  };

  const showStartPicker = () => setStartPickerVisible(true);
  const showEndPicker = () => setEndPickerVisible(true);

  const onParticipantAdd = () => {
    addParticipant(participantInput);
    setParticipantInput('');
  };

  const title = existing ? 'Edit event' : 'Create event';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{title}</Text>
      <TextInput style={styles.input} placeholder="Title" value={state.title} onChangeText={(text) => setField('title', text)} />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Description"
        value={state.description}
        onChangeText={(text) => setField('description', text)}
        multiline
      />
      <TextInput style={styles.input} placeholder="Location" value={state.location} onChangeText={(text) => setField('location', text)} />

      <View style={styles.rowBetween}>
        <Text style={styles.label}>All day</Text>
        <Switch value={state.isAllDay} onValueChange={(value) => setField('isAllDay', value)} />
      </View>

      <Pressable style={styles.datetime} onPress={showStartPicker}>
        <Text style={styles.label}>Starts</Text>
        <Text style={styles.value}>{state.startDate.toLocaleString()}</Text>
      </Pressable>
      <Pressable style={styles.datetime} onPress={showEndPicker}>
        <Text style={styles.label}>Ends</Text>
        <Text style={styles.value}>{state.endDate.toLocaleString()}</Text>
      </Pressable>

      <View style={styles.section}>
        <Text style={styles.label}>Reminders</Text>
        <ReminderSelector selected={state.reminders} onToggle={toggleReminder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Participants</Text>
        <View style={styles.participantRow}>
          <TextInput
            style={[styles.input, styles.participantInput]}
            placeholder="Add email"
            value={participantInput}
            onChangeText={setParticipantInput}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Pressable style={styles.addButton} onPress={onParticipantAdd}>
            <Text style={styles.addButtonLabel}>Add</Text>
          </Pressable>
        </View>
        <ParticipantChips participants={state.participants} onRemove={removeParticipant} />
      </View>

      <Pressable style={styles.primary} onPress={save}>
        <Text style={styles.primaryLabel}>{existing ? 'Update event' : 'Create event'}</Text>
      </Pressable>

      {(startPickerVisible || endPickerVisible) && (
        <DateTimePicker
          mode="datetime"
          value={startPickerVisible ? state.startDate : state.endDate}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            if (event.type === 'set' && selectedDate) {
              if (startPickerVisible) {
                setField('startDate', selectedDate);
                if (selectedDate > state.endDate) {
                  setField('endDate', new Date(selectedDate.getTime() + 60 * 60 * 1000));
                }
              } else {
                setField('endDate', selectedDate);
              }
            }
            setStartPickerVisible(false);
            setEndPickerVisible(false);
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datetime: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    gap: 8,
  },
  participantRow: {
    flexDirection: 'row',
    gap: 8,
  },
  participantInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonLabel: {
    color: '#0369a1',
    fontWeight: '600',
  },
  primary: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventEditorScreen;
