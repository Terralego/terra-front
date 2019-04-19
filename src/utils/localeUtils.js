const ONE_DAY = 1000 * 60 * 60 * 24;

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

export const formatWeekday = format => (weekDay, locale) => {
  let date = new Date('1970-01-01');
  for (let i = 0, len = 7; i < len; i += 1) {
    date = new Date(+date + ONE_DAY);
    if (date.getDay() === weekDay) {
      return date.toLocaleDateString(locale, { weekday: format });
    }
  }
  return null;
};

export const formatWeekdayLong = formatWeekday('long');

export const formatWeekdayShort = formatWeekday('short');

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
