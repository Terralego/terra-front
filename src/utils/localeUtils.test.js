import {
  getDayDate,
  formatDay,
  formatMonthTitle,
  formatWeekdayLong,
  formatWeekdayShort,
  getFirstDayOfWeek,
  getMonths,
} from './localeUtils';

it('should get day date', () => {
  Array.from({ length: 7 }).map((_, day) =>
    expect(getDayDate(day).getDay()).toBe(day));
});

it('should format day', () => {
  expect(formatDay(new Date('2019-01-01'), 'en')).toBe('1/1/2019');
});

it('should format month title', () => {
  [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ].map((month, k) =>
    expect(formatMonthTitle(k, 'en')).toBe(month));
});

it('should format week day long', () => {
  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) =>
    expect(formatWeekdayLong(i, 'en')).toBe(day));
});


it('should format week day short', () => {
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) =>
    expect(formatWeekdayShort(i, 'en')).toBe(day));
});

it('should get first day of week', () => {
  expect(getFirstDayOfWeek('en')).toBe(0);
  expect(getFirstDayOfWeek('fr')).toBe(1);
});

it('should get all months', () => {
  expect(getMonths('en')).toEqual([
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ]);
});
