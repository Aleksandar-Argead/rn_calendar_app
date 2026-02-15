import React, { useRef, useMemo } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { format, isSameDay } from 'date-fns';
import { DayItem } from '@/utils/calendarUtils';
import { useStore } from '@/store';
import { CalendarEvent } from '@/store/slices/calendarSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAY_WIDTH = SCREEN_WIDTH / 5; // show ~5 days at once (adjust as needed)

type Props = {
  days: DayItem[];
  events: CalendarEvent[];
  onLoadMorePast: () => void;
  onLoadMoreFuture: () => void;
};

export function DayCarousel({
  days,
  onLoadMorePast,
  onLoadMoreFuture,
  events,
}: Props) {
  const flatListRef = useRef<FlatList>(null);
  const { selectedDate, setSelectedDate } = useStore();

  const initialIndex = useMemo(
    () => days.findIndex(d => isSameDay(d.date, selectedDate)),
    [days, selectedDate],
  );

  const daysWithEvents = new Set(
    events.map(e => format(new Date(e.start), 'yyyy-MM-dd')),
  );

  const renderDay = ({ item }: { item: DayItem }) => {
    const isSelected = isSameDay(item.date, selectedDate);
    return (
      <TouchableOpacity
        style={[styles.dayItem, isSelected && styles.dayItemSelected]}
        onPress={() => setSelectedDate(item.date)}
      >
        <Text style={[styles.dayName, isSelected && styles.selectedText]}>
          {format(item.date, 'EEE')}
        </Text>
        <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>
          {format(item.date, 'd')}
        </Text>
        {daysWithEvents.has(format(item.date, 'yyyy-MM-dd')) && (
          <View style={styles.selectedDot} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={days}
      horizontal
      pagingEnabled={false} // smooth scrolling, not strict paging
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={Math.max(0, initialIndex - 2)} // center current day
      getItemLayout={(_, index) => ({
        length: DAY_WIDTH,
        offset: DAY_WIDTH * index,
        index,
      })}
      renderItem={renderDay}
      keyExtractor={item => item.key}
      onEndReached={onLoadMoreFuture}
      onEndReachedThreshold={0.4}
      onStartReached={onLoadMorePast}
      onStartReachedThreshold={0.4}
      windowSize={11}
      style={styles.carousel}
      contentContainerStyle={styles.carouselContent}
    />
  );
}

const styles = StyleSheet.create({
  carousel: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  carouselContent: {
    paddingVertical: 12,
  },
  dayItem: {
    width: DAY_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  dayItemSelected: {
    // backgroundColor: 'rgba(0,122,255,0.1)',
  },
  dayName: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  selectedText: {
    color: '#007AFF',
  },
  selectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginTop: 6,
  },
});
