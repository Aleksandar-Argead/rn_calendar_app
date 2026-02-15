import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStore } from '@/store';
import EventScreen from '.';

// Mock navigation & route
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

// Mock store
jest.mock('@/store', () => ({
  useStore: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock DateTimePicker (very important!)
jest.mock('@react-native-community/datetimepicker', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ value, onChange, mode }: any) => (
      <View testID={`datetime-picker-${mode}`} />
      // You can also simulate change with:
      // onChange(null, new Date(...))
    ),
  };
});

describe('EventScreen', () => {
  // Default mocks
  const mockNavigation = {
    goBack: jest.fn(),
  };

  const mockCreateEvent = jest.fn();
  const mockUpdateEvent = jest.fn();
  const mockDeleteEvent = jest.fn();

  const mockStore = {
    createEvent: mockCreateEvent,
    updateEvent: mockUpdateEvent,
    deleteEvent: mockDeleteEvent,
    events: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useStore as jest.Mock).mockReturnValue(mockStore);
  });

  describe('New Event Mode', () => {
    beforeEach(() => {
      (useRoute as jest.Mock).mockReturnValue({
        params: { eventId: undefined, selectedDate: new Date('2026-02-15') },
      });
    });

    it('renders new event title', () => {
      render(<EventScreen />);
      expect(screen.getByText('New Event')).toBeTruthy();
    });

    it('shows required title error when trying to save empty title', async () => {
      render(<EventScreen />);

      fireEvent.press(screen.getByText('Create'));

      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeTruthy();
      });

      expect(mockCreateEvent).not.toHaveBeenCalled();
    });

    it('creates event when title is filled', async () => {
      render(<EventScreen />);

      fireEvent.changeText(
        screen.getByPlaceholderText('Event Title *'),
        'Team Meeting',
      );

      fireEvent.press(screen.getByText('Create'));

      await waitFor(() => {
        expect(mockCreateEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Team Meeting',
            start: expect.any(String), // ISO string
          }),
        );
      });

      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  describe('Edit Event Mode', () => {
    const existingEvent = {
      id: 'evt-123',
      title: 'Doctor Appointment',
      start: '2026-02-15T14:30:00Z',
      location: 'Clinic XYZ',
      description: 'Bring insurance card',
    };

    beforeEach(() => {
      (useRoute as jest.Mock).mockReturnValue({
        params: { eventId: 'evt-123' },
      });

      (useStore as jest.Mock).mockReturnValue({
        ...mockStore,
        events: [existingEvent],
      });
    });

    it('shows edit title + prefilled values', () => {
      render(<EventScreen />);

      expect(screen.getByText('Edit Event')).toBeTruthy();
      expect(screen.getByDisplayValue('Doctor Appointment')).toBeTruthy();
      expect(screen.getByDisplayValue('Clinic XYZ')).toBeTruthy();
      expect(screen.getByDisplayValue('Bring insurance card')).toBeTruthy();
    });

    it('calls updateEvent when saving changes', async () => {
      render(<EventScreen />);

      // Change title
      fireEvent.changeText(
        screen.getByDisplayValue('Doctor Appointment'),
        'Important Meeting',
      );

      fireEvent.press(screen.getByText('Update'));

      await waitFor(() => {
        expect(mockUpdateEvent).toHaveBeenCalledWith(
          'evt-123',
          expect.objectContaining({
            title: 'Important Meeting',
            start: expect.any(String),
          }),
        );
      });
    });

    it('shows confirmation and deletes when pressing Delete', async () => {
      render(<EventScreen />);

      fireEvent.press(screen.getByText('Delete'));

      // Simulate user pressing "Delete" in alert
      const deleteButtonCall = (Alert.alert as jest.Mock).mock.calls[0][2][1];
      deleteButtonCall.onPress();

      await waitFor(() => {
        expect(mockDeleteEvent).toHaveBeenCalledWith('evt-123');
        expect(mockNavigation.goBack).toHaveBeenCalled();
      });
    });
  });

  it('goes back when pressing Cancel', () => {
    (useRoute as jest.Mock).mockReturnValue({ params: {} });

    render(<EventScreen />);

    fireEvent.press(screen.getByText('Cancel'));

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
