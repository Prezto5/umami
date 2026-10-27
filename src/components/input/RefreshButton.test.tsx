import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { expect, test, vi } from 'vitest';
import { RefreshButton } from './RefreshButton';

vi.mock('@umami/react-zen', () => ({
  Icon: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  LoadingButton: ({ children, onPress }: { children: ReactNode; onPress: () => void }) => (
    <button type="button" onClick={onPress}>
      {children}
    </button>
  ),
  Tooltip: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  TooltipTrigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/hooks', () => ({
  useMessages: () => ({ t: (value: string) => value, labels: { refresh: 'Refresh' } }),
  useDateRange: () => ({ dateRange: { value: '24hour' } }),
}));

vi.mock('@/components/icons', () => ({ RefreshCw: () => <svg /> }));

test('refresh button refetches only the data queries of its website', async () => {
  const client = new QueryClient();
  const statsFetch = vi.fn().mockResolvedValue({ visitors: 1 });
  const metricsFetch = vi.fn().mockResolvedValue([]);
  const otherSiteFetch = vi.fn().mockResolvedValue({ visitors: 5 });

  function Probe({ id, name, fn }: { id: string; name: string; fn: () => Promise<unknown> }) {
    useQuery({ queryKey: [name, { websiteId: id }], queryFn: fn, staleTime: 60000 });
    return null;
  }

  render(
    <QueryClientProvider client={client}>
      <Probe id="site-1" name="websites:stats" fn={statsFetch} />
      <Probe id="site-1" name="websites:metrics" fn={metricsFetch} />
      <Probe id="site-2" name="websites:stats" fn={otherSiteFetch} />
      <RefreshButton websiteId="site-1" />
    </QueryClientProvider>,
  );

  await waitFor(() => expect(statsFetch).toHaveBeenCalledTimes(1));
  expect(metricsFetch).toHaveBeenCalledTimes(1);

  fireEvent.click(screen.getByRole('button'));

  await waitFor(() => expect(statsFetch).toHaveBeenCalledTimes(2));
  expect(metricsFetch).toHaveBeenCalledTimes(2);
  expect(otherSiteFetch).toHaveBeenCalledTimes(1);
});
