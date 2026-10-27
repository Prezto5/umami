import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { expect, test, vi } from 'vitest';
import { useWebsiteStatsQuery } from './queries/useWebsiteStatsQuery';
import { LiveRefetchProvider } from './useLiveRefetch';

const get = vi.fn().mockResolvedValue({ visitors: 1 });

vi.mock('./useApi', () => ({ useApi: () => ({ get, useQuery }) }));
vi.mock('./useDateParameters', () => ({ useDateParameters: () => ({ startAt: 1, endAt: 2 }) }));
vi.mock('./useFilterParameters', () => ({ useFilterParameters: () => ({}) }));

function Stats() {
  useWebsiteStatsQuery({ websiteId: 'site-1' });
  return null;
}

function renderStats(wrap: (children: ReactNode) => ReactNode) {
  get.mockClear();
  // staleTime как в Providers.tsx: без интервала повторного запроса не будет
  const client = new QueryClient({ defaultOptions: { queries: { staleTime: 60000 } } });
  render(<QueryClientProvider client={client}>{wrap(<Stats />)}</QueryClientProvider>);
}

test('stats query polls inside LiveRefetchProvider', async () => {
  renderStats(children => <LiveRefetchProvider interval={30}>{children}</LiveRefetchProvider>);

  await waitFor(() => expect(get.mock.calls.length).toBeGreaterThanOrEqual(3));
});

test('stats query does not poll outside LiveRefetchProvider', async () => {
  renderStats(children => children);

  await waitFor(() => expect(get).toHaveBeenCalledTimes(1));
  await new Promise(resolve => setTimeout(resolve, 200));

  expect(get).toHaveBeenCalledTimes(1);
});
