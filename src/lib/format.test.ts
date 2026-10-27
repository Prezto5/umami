import { expect, test } from 'vitest';
import * as format from './format';

test('parseTime', () => {
  expect(format.parseTime(86400 + 3600 + 60 + 1)).toEqual({
    days: 1,
    hours: 1,
    minutes: 1,
    seconds: 1,
    ms: 0,
  });
});

test('formatTime', () => {
  expect(format.formatTime(3600 + 60 + 1)).toBe('1:01:01');
});

test('formatShortTime', () => {
  expect(format.formatShortTime(3600 + 60 + 1)).toBe('1m1s');

  expect(format.formatShortTime(3600 + 60 + 1, ['h', 'm', 's'])).toBe('1h1m1s');

  expect(format.formatShortTime(389, ['m', 's'], ' ')).toBe('6m 29s');
  expect(format.formatShortTime(0)).toBe('0s');
});

test('formatShortTime uses the unit labels of the locale', () => {
  // the separator between number and unit depends on the ICU version, so compare with plain spaces
  const ru = (val: number) =>
    format.formatShortTime(val, ['m', 's'], ' ', 'ru-RU').replace(/\s/g, ' ');

  expect(ru(389)).toBe('6 мин 29 с');
  expect(ru(0)).toBe('0 с');
});

test('formatNumber', () => {
  expect(format.formatNumber('10.2')).toBe('10');
  expect(format.formatNumber('10.5')).toBe('11');
});

test('formatLongNumber', () => {
  expect(format.formatLongNumber(1000000000)).toBe('1.0b');
  expect(format.formatLongNumber(2500000000)).toBe('2.5b');
  expect(format.formatLongNumber(1200000)).toBe('1.2m');
  expect(format.formatLongNumber(575000)).toBe('575k');
  expect(format.formatLongNumber(10500)).toBe('10.5k');
  expect(format.formatLongNumber(1200)).toBe('1.20k');
});

test('stringToColor', () => {
  expect(format.stringToColor('hello')).toBe('#d218e9');
  expect(format.stringToColor('goodbye')).toBe('#11e956');
});

test('truncateString', () => {
  expect(format.truncateString('hello', 3)).toBe('hel');
  expect(format.truncateString(undefined, 3)).toBeUndefined();
});

test('decodePunycodeDomain', () => {
  expect(format.decodePunycodeDomain('xn--bcher-kva.example')).toBe('bücher.example');
  expect(format.decodePunycodeDomain('example.com')).toBe('example.com');
  expect(format.decodePunycodeDomain(undefined)).toBeUndefined();
});
