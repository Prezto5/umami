import { toUnicode } from 'punycode';
import { DEFAULT_CURRENCY } from './constants';

export function parseTime(val: number) {
  const days = ~~(val / 86400);
  const hours = ~~(val / 3600) - days * 24;
  const minutes = ~~(val / 60) - days * 1440 - hours * 60;
  const seconds = ~~val - days * 86400 - hours * 3600 - minutes * 60;
  const ms = (val - ~~val) * 1000;

  return {
    days,
    hours,
    minutes,
    seconds,
    ms,
  };
}

export function formatTime(val: number) {
  const { hours, minutes, seconds } = parseTime(val);
  const h = hours > 0 ? `${hours}:` : '';
  const m = hours > 0 ? minutes.toString().padStart(2, '0') : minutes;
  const s = seconds.toString().padStart(2, '0');

  return `${h}${m}:${s}`;
}

const DURATION_UNITS: Record<string, string> = {
  d: 'day',
  h: 'hour',
  m: 'minute',
  s: 'second',
  ms: 'millisecond',
};

// Unit labels come from the locale data (en-US: 6m 29s, ru-RU: 6 мин 29 с).
function formatDurationUnit(value: number, format: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: DURATION_UNITS[format],
    unitDisplay: 'narrow',
    maximumFractionDigits: 3,
  }).format(value);
}

export function formatShortTime(val: number, formats = ['m', 's'], space = '', locale = 'en-US') {
  const { days, hours, minutes, seconds, ms } = parseTime(val);
  const parts: string[] = [];

  if (days > 0 && formats.indexOf('d') !== -1) parts.push(formatDurationUnit(days, 'd', locale));
  if (hours > 0 && formats.indexOf('h') !== -1) parts.push(formatDurationUnit(hours, 'h', locale));
  if (minutes > 0 && formats.indexOf('m') !== -1) {
    parts.push(formatDurationUnit(minutes, 'm', locale));
  }
  if (seconds > 0 && formats.indexOf('s') !== -1) {
    parts.push(formatDurationUnit(seconds, 's', locale));
  }
  if (ms > 0 && formats.indexOf('ms') !== -1) parts.push(formatDurationUnit(ms, 'ms', locale));

  if (!parts.length) {
    return formatDurationUnit(0, formats[formats.length - 1], locale);
  }

  return parts.join(space);
}

export function formatNumber(n: string | number) {
  return Number(n).toFixed(0);
}

export function formatLongNumber(value: number) {
  const n = Number(value);

  if (n >= 1000000000) {
    return `${(n / 1000000000).toFixed(1)}b`;
  }
  if (n >= 1000000) {
    return `${(n / 1000000).toFixed(1)}m`;
  }
  if (n >= 100000) {
    return `${(n / 1000).toFixed(0)}k`;
  }
  if (n >= 10000) {
    return `${(n / 1000).toFixed(1)}k`;
  }
  if (n >= 1000) {
    return `${(n / 1000).toFixed(2)}k`;
  }

  return formatNumber(n);
}

export function stringToColor(str: string) {
  if (!str) {
    return '#ffffff';
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

export function formatCurrency(value: number, currency: string, locale = 'en-US') {
  let formattedValue: Intl.NumberFormat;

  try {
    formattedValue = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    });
  } catch {
    // Fallback to default currency format if an error occurs
    formattedValue = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: DEFAULT_CURRENCY,
    });
  }

  return formattedValue.format(value);
}

export function formatLongCurrency(value: number, currency: string, locale = 'en-US') {
  const n = Number(value);

  if (n >= 1000000000) {
    return `${formatCurrency(n / 1000000000, currency, locale)}b`;
  }
  if (n >= 1000000) {
    return `${formatCurrency(n / 1000000, currency, locale)}m`;
  }
  if (n >= 1000) {
    return `${formatCurrency(n / 1000, currency, locale)}k`;
  }

  return formatCurrency(n, currency, locale);
}

export function decodePunycodeDomain(domain?: string | null) {
  if (!domain) {
    return domain;
  }

  try {
    return toUnicode(domain);
  } catch {
    return domain;
  }
}

export function truncateString<T extends string | null | undefined>(
  value: T,
  maxLength: number,
): T extends string ? string : T {
  return (value ? value.substring(0, maxLength) : value) as T extends string ? string : T;
}
