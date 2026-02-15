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

export function EventList({ selectedDate }: Props) {
  const { events } = useStore();

  const selectedDayEvents = events.filter(event => {
    const eventDate =
      event.start instanceof Date ? event.start : new Date(event.start);
    return isSameDay(eventDate, selectedDate);
  });

  return (
    <View style={styles.eventsSection}>
      <Text style={styles.sectionTitle}>
        Events on {format(selectedDate, 'MMMM d, yyyy')}
      </Text>

      <FlatList
        data={selectedDayEvents}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events scheduled</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.eventItem}>
            <View style={styles.eventTimeContainer}>
              <Text style={styles.eventTime}>
                {format(new Date(item.start), 'HH:mm')}
              </Text>
              {item.end && (
                <Text style={styles.eventTime}>
                  {' – '}
                  {format(new Date(item.end), 'HH:mm')}
                </Text>
              )}
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle} numberOfLines={1}>
                {item.title}
              </Text>
              {item.location && (
                <Text style={styles.eventLocation} numberOfLines={1}>
                  {item.location}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        style={styles.eventsList}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  eventsSection: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  eventsList: {},
  eventItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  eventTimeContainer: {
    width: 80,
    paddingRight: 12,
  },
  eventTime: {
    fontSize: 15,
    color: '#666',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});
