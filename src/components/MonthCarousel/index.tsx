import React, { useRef } from 'react';
import { FlatList, View, Text, StyleSheet, Dimensions } from 'react-native';
import { MonthItem } from '@/utils/calendarUtils';
import { MonthView } from '@/components/calendar/MonthView';
import { useStore } from '@/store';
import { format } from 'date-fns';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MONTH_WIDTH = SCREEN_WIDTH;

type Props = {
  months: MonthItem[];
  initialIndex: number;
  onLoadMorePast: () => void;
  onLoadMoreFuture: () => void;
};

export function MonthCarousel({
  months,
  initialIndex,
  onLoadMorePast,
  onLoadMoreFuture,
}: Props) {
  const flatListRef = useRef<FlatList>(null);
  const { selectedDate, setSelectedDate, events } = useStore();

  const renderMonth = ({ item }: { item: MonthItem }) => (
    <View style={{ width: MONTH_WIDTH }}>
      <Text style={styles.monthTitle}>
        {format(item.monthDate, 'MMMM yyyy')}
      </Text>
      <MonthView
        currentMonth={item.monthDate}
        selectedDate={selectedDate}
        events={events}
        onDayPress={setSelectedDate}
      />
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={months}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={initialIndex}
      getItemLayout={(_, index) => ({
        length: MONTH_WIDTH,
        offset: MONTH_WIDTH * index,
        index,
      })}
      renderItem={renderMonth}
      keyExtractor={item => item.key}
      onEndReached={onLoadMoreFuture}
      onEndReachedThreshold={0.5}
      onStartReached={onLoadMorePast}
      onStartReachedThreshold={0.5}
      windowSize={7}
      style={styles.monthlyFlatlist}
    />
  );
}

const styles = StyleSheet.create({
  monthlyFlatlist: {
    maxHeight: 360,
  },
  monthTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 12,
  },
});
