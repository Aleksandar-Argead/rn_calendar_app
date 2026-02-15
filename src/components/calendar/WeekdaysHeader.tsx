import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function WeekdaysHeader() {
  return (
    <View style={styles.container}>
      {weekdays.map(day => (
        <View key={day} style={styles.day}>
          <Text style={styles.dayText}>{day}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  day: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
});
