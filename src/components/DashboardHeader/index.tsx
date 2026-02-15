import { format } from 'date-fns';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  selectedDate: Date;
  onTodayPressed: () => void;
}

export const DashboardHeader = ({ selectedDate, onTodayPressed }: Props) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onTodayPressed}>
        <Text style={styles.todayButton}>Today</Text>
      </TouchableOpacity>
      <Text style={styles.selected}>
        {format(selectedDate, 'EEEE, MMM d, yyyy')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  todayButton: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  selected: { fontSize: 16, fontWeight: '500', color: '#333' },
});
