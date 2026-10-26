'use client';

import { Tag } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { BOT_RUNTIME_STATUSES, type BotRuntimeStatus } from '@/types/botRuntimeStatus';

const COLORS: Partial<Record<BotRuntimeStatus, string>> = {
  [BOT_RUNTIME_STATUSES.connected]: 'success',
  [BOT_RUNTIME_STATUSES.dormant]: 'warning',
  [BOT_RUNTIME_STATUSES.failed]: 'error',
  [BOT_RUNTIME_STATUSES.queued]: 'processing',
  [BOT_RUNTIME_STATUSES.starting]: 'processing',
};

const LABELS: Partial<Record<BotRuntimeStatus, string>> = {
  [BOT_RUNTIME_STATUSES.connected]: 'channel.statusConnected',
  [BOT_RUNTIME_STATUSES.disconnected]: 'channel.statusDisconnected',
  [BOT_RUNTIME_STATUSES.dormant]: 'channel.statusDormant',
  [BOT_RUNTIME_STATUSES.failed]: 'channel.statusFailed',
  [BOT_RUNTIME_STATUSES.queued]: 'channel.statusQueued',
  [BOT_RUNTIME_STATUSES.starting]: 'channel.statusStarting',
};

/** The bot's connection state as a small tag, e.g. beside the bot's title. */
export const ChannelStatusTag = memo<{ status?: BotRuntimeStatus }>(({ status }) => {
  const { t: _t } = useTranslation('agent');
  const t = _t as (key: string) => string;

  const label = status ? LABELS[status] : undefined;
  if (!status || !label) return null;

  return (
    <Tag color={COLORS[status]} size={'small'}>
      {t(label)}
    </Tag>
  );
});

ChannelStatusTag.displayName = 'ChannelStatusTag';
