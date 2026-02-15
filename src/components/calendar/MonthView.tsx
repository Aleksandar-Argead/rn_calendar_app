import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
} from 'date-fns';
import { DayCell } from './DayCell';
import { WeekdaysHeader } from './WeekdaysHeader';

type Props = {
  currentMonth: Date;
  selectedDate: Date;
  events: { start: string }[];
  onDayPress: (date: Date) => void;
};

export function MonthView({
  currentMonth,
  selectedDate,
  events,
  onDayPress,
}: Props) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const daysWithEvents = new Set(events.map(e => e.start.split('T')[0]));

  return (
    <View style={styles.container}>
      <WeekdaysHeader />
      {weeks.map((week, idx) => (
        <View key={idx} style={styles.week}>
          {week.map(day => (
            <DayCell
              key={day.toISOString()}
              date={day}
              isCurrentMonth={isSameMonth(day, currentMonth)}
              isSelected={
                isSameMonth(day, selectedDate) &&
                day.getDate() === selectedDate.getDate()
              }
              hasEvents={daysWithEvents.has(day.toISOString().split('T')[0])}
              onPress={onDayPress}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  week: { flexDirection: 'row' },
});
