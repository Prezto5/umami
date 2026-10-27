import { createTranslator } from 'next-intl';
import { expect, test } from 'vitest';
import enUS from '../../public/intl/messages/en-US.json';
import ruRU from '../../public/intl/messages/ru-RU.json';
import { messages } from './messages';

function visitors(locale: string, data: object, count: number) {
  const t = createTranslator({ locale, messages: data as any });

  return t(messages.visitorsCount as any, { count, value: String(count) });
}

test('visitorsCount in ru-RU is declined by the number (one / few / many)', () => {
  expect(visitors('ru-RU', ruRU, 1)).toBe('1 посетитель');
  expect(visitors('ru-RU', ruRU, 2)).toBe('2 посетителя');
  expect(visitors('ru-RU', ruRU, 5)).toBe('5 посетителей');
  expect(visitors('ru-RU', ruRU, 21)).toBe('21 посетитель');
  expect(visitors('ru-RU', ruRU, 0)).toBe('0 посетителей');
  expect(visitors('ru-RU', ruRU, 11)).toBe('11 посетителей');
  expect(visitors('ru-RU', ruRU, 22)).toBe('22 посетителя');
});

test('visitorsCount in en-US is singular for 1 and plural otherwise', () => {
  expect(visitors('en-US', enUS, 1)).toBe('1 visitor');
  expect(visitors('en-US', enUS, 2)).toBe('2 visitors');
  expect(visitors('en-US', enUS, 0)).toBe('0 visitors');
});

test('visitorsCount shows the preformatted value, the number only picks the form', () => {
  const t = createTranslator({ locale: 'ru-RU', messages: ruRU as any });

  expect(t(messages.visitorsCount as any, { count: 1500, value: '1.5k' })).toBe('1.5k посетителей');
});
