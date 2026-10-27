import { type Query, useQueryClient } from '@tanstack/react-query';
import { Icon, LoadingButton, Tooltip, TooltipTrigger } from '@umami/react-zen';
import { useState } from 'react';
import { useMessages } from '@/components/hooks';
import { RefreshCw } from '@/components/icons';

// Запросы данных сайта: во втором элементе ключа лежит { websiteId, ... },
// у «Онлайн» (`websites:active`) — сам websiteId.
export function isWebsiteDataQuery(websiteId: string, { queryKey }: Pick<Query, 'queryKey'>) {
  const [, params] = queryKey as [unknown, any];

  return params === websiteId || params?.websiteId === websiteId;
}

export function RefreshButton({
  websiteId,
  isLoading,
}: {
  websiteId: string;
  isLoading?: boolean;
}) {
  const { t, labels } = useMessages();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function handleClick() {
    if (isLoading || isRefreshing || !websiteId) {
      return;
    }

    setIsRefreshing(true);

    try {
      await queryClient.invalidateQueries({
        predicate: query => isWebsiteDataQuery(websiteId, query),
      });
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <TooltipTrigger>
      <LoadingButton
        isLoading={isLoading || isRefreshing}
        onPress={handleClick}
        aria-label={t(labels.refresh)}
      >
        <Icon>
          <RefreshCw />
        </Icon>
      </LoadingButton>
      <Tooltip>{t(labels.refresh)}</Tooltip>
    </TooltipTrigger>
  );
}
