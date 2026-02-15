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
import { format } from 'date-fns';
import { useStore } from '@/store';

export default function NewEventScreen() {
  const navigation = useNavigation<any>();
  const { createEvent, selectedDate } = useStore();

  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState(selectedDate ?? new Date());
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState(false);

  const handleCreate = () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    const eventData = {
      title: title.trim(),
      date: format(dateTime, 'yyyy-MM-dd'),
      time: format(dateTime, 'HH:mm'),
      start: dateTime.toISOString(),
      location: location.trim(),
      description: description.trim(),
    };

    createEvent(eventData);
    navigation.goBack();
  };

  const onDateChange = (_event: any, selected?: Date) => {
    if (selected) {
      setDateTime(selected);
    }
  };

  const onTimeChange = (_event: any, selected?: Date) => {
    if (selected) {
      // Keep the date part, only update time
      const newDate = new Date(dateTime);
      newDate.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setDateTime(newDate);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>New Event</Text>

        <TextInput
          style={[styles.input, titleError && styles.inputError]}
          placeholder="Event Title *"
          value={title}
          onChangeText={text => {
            setTitle(text);
            setTitleError(false);
          }}
          autoFocus
          placeholderTextColor="#999"
        />
        {titleError && <Text style={styles.errorText}>Title is required</Text>}

        {/* Date + Time pickers side by side */}
        <View style={styles.pickerRow}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Date</Text>
            <DateTimePicker
              value={dateTime}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date(2020, 0, 1)}
              maximumDate={new Date(2035, 11, 31)}
            />
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Time</Text>
            <DateTimePicker
              value={dateTime}
              mode="time"
              display="default"
              onChange={onTimeChange}
              is24Hour={Platform.OS === 'android'}
            />
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#999"
        />

        <TextInput
          style={[styles.input, styles.description]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          placeholderTextColor="#999"
        />

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
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
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
    marginBottom: 12,
    marginLeft: 4,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },

  pickerContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    marginLeft: 4,
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
