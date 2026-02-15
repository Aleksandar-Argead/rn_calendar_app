import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { format, isSameDay } from 'date-fns';
import { useStore } from '@/store';

type Props = {
  selectedDate: Date;
};

export function DayEventsList({ selectedDate }: Props) {
  const { events } = useStore();

  const dayEvents = events.filter(event => {
    const eventStart =
      event.start instanceof Date ? event.start : new Date(event.start);
    return isSameDay(eventStart, selectedDate);
  });

  const title = format(selectedDate, 'EEEE, MMMM d, yyyy');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>

      <FlatList
        data={dayEvents}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No events scheduled</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.eventCard}>
            <View style={styles.timeBlock}>
              <Text style={styles.time}>
                {format(new Date(item.start), 'HH:mm')}
              </Text>
              {item.end && (
                <Text style={styles.time}>
                  {' – '}
                  {format(new Date(item.end), 'HH:mm')}
                </Text>
              )}
            </View>
            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              {item.location && (
                <Text style={styles.location} numberOfLines={1}>
                  {item.location}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  timeBlock: {
    width: 80,
    paddingRight: 12,
  },
  time: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});
