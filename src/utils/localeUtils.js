const ONE_DAY = 1000 * 60 * 60 * 24;

export const getDayDate = day => {
  let date = new Date('2019-01-01');
  while (true) {
    date = new Date(+date + ONE_DAY);
    if (date.getDay() === day) return date;
  }
};

export const formatDay = (day, locale) => {
  const date = new Date(day);
  return date.toLocaleDateString(locale);
};

export const formatMonthTitle = (month, locale) => {
  const date = new Date('2019-01-01');
  date.setMonth(month);
  const label = date.toLocaleDateString(locale, { month: 'long' });
  return label.substr(0, 1).toUpperCase() + label.substr(1);
};

export const formatWeekdayLong = (i, locale) =>
  getDayDate(i).toLocaleDateString(locale, { weekday: 'long' });

export const formatWeekdayShort = (i, locale) =>
  getDayDate(i).toLocaleDateString(locale, { weekday: 'short' });

export const getFirstDayOfWeek = locale => {
  if (locale === 'fr') return 1;
  return 0;
};

export const getMonths = locale =>
  Array.from({ length: 12 }).map((_, month) => formatMonthTitle(month, locale));

export default {
  formatDay,
  formatMonthTitle,
  formatWeekdayLong,
  formatWeekdayShort,
  getFirstDayOfWeek,
  getMonths,
};
