import { render, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { useFitValue } from './useFitValue';

function Value({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useFitValue(ref);

  return (
    <div ref={ref} data-test="value" style={{ fontSize: '40px' }}>
      {text}
    </div>
  );
}

function mockTextWidth(width: number) {
  Range.prototype.getBoundingClientRect = () => ({ width }) as DOMRect;
}

afterEach(() => {
  // jsdom has no Range.getBoundingClientRect
  delete Range.prototype.getBoundingClientRect;
  vi.restoreAllMocks();
});

test('useFitValue stores the text width in em (width / font size)', () => {
  mockTextWidth(200);

  const { getByTestId } = render(<Value text="3 мин 27 с" />);

  expect(getByTestId('value').style.getPropertyValue('--fit-em')).toBe('5');
});

test('useFitValue measures again when the text changes', async () => {
  mockTextWidth(200);

  const { getByTestId } = render(<Value text="1" />);
  const el = getByTestId('value');

  mockTextWidth(400);
  el.textContent = '59 мин 59 с';

  await waitFor(() => expect(el.style.getPropertyValue('--fit-em')).toBe('10'));
});

test('useFitValue does nothing without layout', () => {
  const { getByTestId } = render(<Value text="1" />);

  expect(getByTestId('value').style.getPropertyValue('--fit-em')).toBe('');
});
