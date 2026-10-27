'use client';
import { createContext, type ReactNode, useContext } from 'react';
import { REALTIME_INTERVAL } from '@/lib/constants';

const LiveRefetchContext = createContext<number | undefined>(undefined);

/**
 * Включает автообновление данных сайта (метрики, график, панели) для поддерева:
 * хуки просмотра данных берут интервал из useLiveRefetch(). Вне провайдера
 * (отчёты, настройки, админка) интервала нет — запросы работают как раньше.
 * Фоновые вкладки не опрашиваются: refetchIntervalInBackground не включён.
 */
export function LiveRefetchProvider({
  interval = REALTIME_INTERVAL,
  children,
}: {
  interval?: number;
  children: ReactNode;
}) {
  return <LiveRefetchContext.Provider value={interval}>{children}</LiveRefetchContext.Provider>;
}

export function useLiveRefetch() {
  return useContext(LiveRefetchContext);
}
