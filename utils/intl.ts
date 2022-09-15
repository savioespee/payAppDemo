import { scenario } from '../constants/scenario';

if (typeof Intl === 'undefined') {
  require('intl');
  require('intl/locale-data/jsonp/en');
  require('@formatjs/intl-locale/polyfill');
  require('@formatjs/intl-datetimeformat/polyfill');
  require('@formatjs/intl-datetimeformat/locale-data/en'); // locale-data for en
  require('@formatjs/intl-datetimeformat/add-all-tz'); // Add ALL tz data
}

export const intlTimeFormat = Intl.DateTimeFormat(scenario.defaultLanguage, {
  hour: 'numeric',
  minute: 'numeric',
});

export const intlDateFormat = Intl.DateTimeFormat(scenario.defaultLanguage, {
  month: 'short',
  day: 'numeric',
});

export const intlDateDifferentYearFormat = Intl.DateTimeFormat(scenario.defaultLanguage, {
  month: 'numeric',
  day: 'numeric',
  year: 'numeric',
});

export const intlDateTimeFormat = Intl.DateTimeFormat(scenario.defaultLanguage, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
});

export const intlDateLineLastYearFormat = Intl.DateTimeFormat(scenario.defaultLanguage, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export const intlDateLineFormat = Intl.DateTimeFormat(scenario.defaultLanguage, {
  month: 'short',
  day: 'numeric',
  weekday: 'long',
});
