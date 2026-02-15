import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { isToday } from 'date-fns';

type Props = {
  date: Date | null; // null = padding day from prev/next month
  isCurrentMonth: boolean;
  hasEvents: boolean;
  isSelected: boolean;
  onPress: (date: Date) => void;
};

export function DayCell({
  date,
  isCurrentMonth,
  isSelected,
  hasEvents,
  onPress,
}: Props) {
  if (!date) {
    return <View style={styles.empty} />;
  }

  const today = isToday(date);
  const selected = isSelected;
  const textColor = isCurrentMonth ? '#000' : '#aaa';

  return (
    <TouchableOpacity
      style={[styles.cell, today && styles.today, selected && styles.selected]}
      onPress={() => onPress(date)}
    >
      <Text style={[styles.dayNumber, { color: textColor }]}>
        {date.getDate()}
      </Text>
      {hasEvents && <View style={styles.eventDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayNumber: {
    fontSize: 16,
  },
  today: {
    backgroundColor: '#e6f2ff',
    borderRadius: 20,
  },
  selected: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    position: 'absolute',
    bottom: 8,
  },
  empty: {
    flex: 1,
    aspectRatio: 1,
  },
});
