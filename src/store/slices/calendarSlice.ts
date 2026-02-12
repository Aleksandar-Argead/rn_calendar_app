import { create } from 'zustand';
import { addMonths, addDays, startOfMonth, endOfMonth } from 'date-fns';
import { CalendarView } from '../../types';

interface CalendarState {
  currentDate: Date;
  view: CalendarView;
  selectedDate: Date;

  setCurrentDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  setSelectedDate: (date: Date) => void;

  goToNext: () => void;
  goToPrev: () => void;
  goToToday: () => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  currentDate: new Date(),
  view: 'month',
  selectedDate: new Date(),

  setCurrentDate: date => set({ currentDate: date }),
  setView: view => set({ view }),
  setSelectedDate: date => set({ selectedDate: date }),

  goToNext: () => {
    const { currentDate, view } = get();
    const newDate =
      view === 'month' ? addMonths(currentDate, 1) : addDays(currentDate, 1);
    set({ currentDate: newDate, selectedDate: newDate });
  },

  goToPrev: () => {
    const { currentDate, view } = get();
    const newDate =
      view === 'month' ? addMonths(currentDate, -1) : addDays(currentDate, -1);
    set({ currentDate: newDate, selectedDate: newDate });
  },

  goToToday: () => {
    const today = new Date();
    set({ currentDate: today, selectedDate: today });
  },
}));
