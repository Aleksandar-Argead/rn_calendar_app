import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { format, isPast, parseISO } from 'date-fns';
import { useStore } from '@/store';

type RootStackParamList = {
  NewEvent: { initialDate?: string };
};
type NewEventRouteProp = RouteProp<RootStackParamList, 'NewEvent'>;

interface Props {
  route: NewEventRouteProp;
}

export default function NewEventScreen({ route }: Props) {
  const navigation = useNavigation<any>();
  const initialDateStr = route.params?.initialDate;

  const { createEvent } = useStore();

  const initialDate = initialDateStr ? parseISO(initialDateStr) : new Date();

  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState(initialDate);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState(false);

  const handleCreate = () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    setTitleError(false);

    const eventData = {
      title: title.trim(),
      date: format(dateTime, 'yyyy-MM-dd'),
      time: format(dateTime, 'HH:mm'), // ← added
      start: format(dateTime, "yyyy-MM-dd'T'HH:mm:ss"), // ISO format is often useful
      location: location.trim(),
      description: description.trim(),
    };

    console.log('Creating event:', eventData);
    createEvent(eventData);

    // Reset form
    setTitle('');
    setDateTime(new Date());
    setLocation('');
    setDescription('');
    navigation.goBack();
  };

  const showDatePicker = () => {
    setPickerMode('date');
    setShowPicker(true);
  };

  const showTimePicker = () => {
    setPickerMode('time');
    setShowPicker(true);
  };

  const onDateTimeChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateTime;

    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'set' || Platform.OS === 'ios') {
      setDateTime(currentDate);
    }
  };

  const formattedDate = format(dateTime, 'yyyy-MM-dd');
  const formattedTime = format(dateTime, 'HH:mm');
  const isEventInPast = isPast(dateTime);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>New Event</Text>

        {/* Title */}
        <TextInput
          style={[styles.input, titleError && styles.inputError]}
          placeholder="Event Title *"
          value={title}
          onChangeText={text => {
            setTitle(text);
            if (titleError) setTitleError(false);
          }}
          autoFocus
          placeholderTextColor="#999"
        />
        {titleError && <Text style={styles.errorText}>Title is required</Text>}

        {/* Date */}
        <TouchableOpacity
          style={styles.input}
          onPress={showDatePicker}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.dateText}>Date:</Text>

            <DateTimePicker
              value={dateTime}
              mode={'date'}
              display={'default'}
              onChange={onDateTimeChange}
              minimumDate={new Date(2020, 0, 1)}
              maximumDate={new Date(2035, 11, 31)}
              // Android specific: auto-dismiss on selection
              {...(Platform.OS === 'android' ? { is24Hour: true } : {})}
            />
          </View>
        </TouchableOpacity>

        {/* Time */}
        <TouchableOpacity
          style={styles.input}
          onPress={showTimePicker}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.dateText}>Time:</Text>

            <DateTimePicker
              value={dateTime}
              mode={'time'}
              display={'default'}
              onChange={onDateTimeChange}
              minimumDate={new Date(2020, 0, 1)}
              maximumDate={new Date(2035, 11, 31)}
              // Android specific: auto-dismiss on selection
              {...(Platform.OS === 'android' ? { is24Hour: true } : {})}
            />
          </View>
        </TouchableOpacity>

        {/* Location */}
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#999"
        />

        {/* Description */}
        <TextInput
          style={[styles.input, styles.description]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          placeholderTextColor="#999"
        />

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonTextCancel}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleCreate}>
            <Text style={styles.buttonTextCreate}>Create</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles remain mostly the same, just a small tweak for clarity
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 28,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#ff3b30',
    borderWidth: 2,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  description: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonTextCreate: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  buttonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});
