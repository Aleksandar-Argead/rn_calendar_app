import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { format, isSameDay } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '@/store';

import { EventList } from '../EventList'; // adjust relative path as needed

// ─────────────────────────────────────────────
// Mocks (unchanged from previous version)
// ─────────────────────────────────────────────

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@/store', () => ({
  useStore: jest.fn(),
}));

jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  format: jest.fn(),
  isSameDay: jest.fn(),
}));

describe('EventList', () => {
  const mockNavigate = jest.fn();
  const defaultDate = new Date(2026, 1, 15); // Feb 15, 2026 – matches current date

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });

    (useStore as jest.Mock).mockReturnValue({
      events: [],
    });

    (format as jest.Mock).mockImplementation((date: Date, pattern: string) => {
      if (pattern === 'MMMM d, yyyy') return 'February 15, 2026';
      if (pattern === 'HH:mm') return date.toISOString().slice(11, 16);
      return jest.requireActual('date-fns').format(date, pattern);
    });

    (isSameDay as jest.Mock).mockImplementation(
      (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString(),
    );
  });

  it('renders section title with formatted selected date', () => {
    render(<EventList selectedDate={defaultDate} />);

    expect(screen.getByText('Events on February 15, 2026')).toBeOnTheScreen();
  });

  it('shows empty state message when no events for the day', () => {
    render(<EventList selectedDate={defaultDate} />);

    expect(screen.getByText('No events scheduled')).toBeOnTheScreen();
  });

  it('filters events to show only those on the selected day', () => {
    const events = [
      {
        id: 'e-wrong-day',
        title: 'Wrong Day Meeting',
        start: new Date(2026, 1, 14, 10, 0), // previous day
      },
    ];

    (useStore as jest.Mock).mockReturnValue({ events });

    render(<EventList selectedDate={defaultDate} />);

    expect(screen.queryByText('Wrong Day Meeting')).not.toBeOnTheScreen();
  });

  it('renders event details including time range, title, and location when present', () => {
    const events = [
      {
        id: 'e1',
        title: 'Doctor Appointment',
        start: new Date(2026, 1, 15, 14, 30),
        end: new Date(2026, 1, 15, 15, 45),
        location: 'City Clinic',
      },
      {
        id: 'e2',
        title: 'Team Sync (no end time)',
        start: new Date(2026, 1, 15, 9, 0),
      },
    ];

    (useStore as jest.Mock).mockReturnValue({ events });

    render(<EventList selectedDate={defaultDate} />);

    expect(screen.getByText('14:30')).toBeOnTheScreen();
    expect(screen.getByText(' – ')).toBeOnTheScreen();
    expect(screen.getByText('15:45')).toBeOnTheScreen();
    expect(screen.getByText('09:00')).toBeOnTheScreen();

    expect(screen.getByText('Doctor Appointment')).toBeOnTheScreen();
    expect(screen.getByText('Team Sync (no end time)')).toBeOnTheScreen();

    expect(screen.getByText('City Clinic')).toBeOnTheScreen();
  });

  it('navigates to EventScreen on event press with correct eventId', () => {
    const events = [
      {
        id: 'abc123',
        title: 'Pressable Event',
        start: new Date(2026, 1, 15, 13, 0),
      },
    ];

    (useStore as jest.Mock).mockReturnValue({ events });

    render(<EventList selectedDate={defaultDate} />);

    fireEvent.press(screen.getByText('Pressable Event'));

    expect(mockNavigate).toHaveBeenCalledWith('EventScreen', {
      eventId: 'abc123',
    });
  });

  it('handles string ISO start date correctly', () => {
    const events = [
      {
        id: 'e3',
        title: 'Webinar',
        start: '2026-02-15T16:00:00Z',
      },
    ];

    (useStore as jest.Mock).mockReturnValue({ events });
    (isSameDay as jest.Mock).mockReturnValue(true);

    render(<EventList selectedDate={defaultDate} />);

    expect(screen.getByText('Webinar')).toBeOnTheScreen();
    expect(screen.getByText('16:00')).toBeOnTheScreen();
  });
});
