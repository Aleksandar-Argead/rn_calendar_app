import {
  startOfMonth,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  subDays,
  startOfDay,
  addDays,
} from 'date-fns';

export type MonthItem = {
  key: string;
  monthDate: Date;
};

export function generateMonthsAround(anchor: Date, range = 12): MonthItem[] {
  return Array.from({ length: range * 2 + 1 }, (_, i) => {
    const month = startOfMonth(addMonths(anchor, i - range));
    return {
      key: format(month, 'yyyy-MM'),
      monthDate: month,
    };
  });
}

export function addMonthsToList(
  months: MonthItem[],
  count: number,
): MonthItem[] {
  const newest = months[months.length - 1].monthDate;
  const toAdd = Array.from({ length: count }, (_, i) =>
    startOfMonth(addMonths(newest, i + 1)),
  ).map(m => ({
    key: format(m, 'yyyy-MM'),
    monthDate: m,
  }));

  return [...months, ...toAdd];
}

export function addPastMonthsToList(
  months: MonthItem[],
  count: number,
): MonthItem[] {
  const oldest = months[0].monthDate;
  const toAdd = Array.from({ length: count }, (_, i) =>
    startOfMonth(subMonths(oldest, i + 1)),
  ).map(m => ({
    key: format(m, 'yyyy-MM'),
    monthDate: m,
  }));

  return [...toAdd.reverse(), ...months];
}

export function findMonthIndex(months: MonthItem[], target: Date): number {
  return months.findIndex(m => isSameMonth(m.monthDate, target));
}

export type DayItem = {
  key: string; // "2026-02-15"
  date: Date;
};

export function generateDaysAround(anchor: Date, range = 14): DayItem[] {
  return Array.from({ length: range * 2 + 1 }, (_, i) => {
    const d = startOfDay(addDays(anchor, i - range));
    return {
      key: format(d, 'yyyy-MM-dd'),
      date: d,
    };
  });
}

export function addFutureDays(days: DayItem[], count: number): DayItem[] {
  const newest = days[days.length - 1].date;
  const toAdd = Array.from({ length: count }, (_, i) =>
    startOfDay(addDays(newest, i + 1)),
  ).map(d => ({
    key: format(d, 'yyyy-MM-dd'),
    date: d,
  }));
  return [...days, ...toAdd];
}

export function addPastDays(days: DayItem[], count: number): DayItem[] {
  const oldest = days[0].date;
  const toAdd = Array.from({ length: count }, (_, i) =>
    startOfDay(subDays(oldest, i + 1)),
  ).map(d => ({
    key: format(d, 'yyyy-MM-dd'),
    date: d,
  }));
  return [...toAdd.reverse(), ...days];
}

export function findDayIndex(days: DayItem[], target: Date): number {
  return days.findIndex(d => isSameDay(d.date, target));
}
