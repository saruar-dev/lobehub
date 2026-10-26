import type { FieldSchema } from '@/server/services/bot/platforms/types';

import { accessIssues } from './accessStance';
import { getSchemaFields, type SettingsGroupKey } from './settingsGroups';

/**
 * The page is one tab per question a person asks, in the order they ask them:
 * how is it connected, who may use it, when may it speak up unprompted, how does it reply, what else is there.
 */
export type ChannelTab = 'access' | 'advanced' | 'connect' | 'reply' | 'wake';

export const TAB_ORDER: ChannelTab[] = ['connect', 'access', 'wake', 'reply', 'advanced'];

/** Connecting always exists; the other tabs exist when the platform has settings for them. */
export const resolveTabs = (settingsGroupKeys: SettingsGroupKey[]): ChannelTab[] =>
  TAB_ORDER.filter((tab) => tab === 'connect' || settingsGroupKeys.includes(tab));

/**
 * A new channel starts on connecting, since nothing else works before it. A
 * saved one opens on the first settings tab: the connection is done.
 */
export const defaultTab = (tabs: ChannelTab[], hasConfig: boolean): ChannelTab =>
  (hasConfig ? tabs.find((tab) => tab !== 'connect') : undefined) ?? 'connect';

export interface ChannelValues {
  applicationId?: string;
  credentials?: Record<string, string>;
  settings?: Record<string, unknown>;
}

const isFilled = (value: unknown) => typeof value === 'string' && value.trim() !== '';

/**
 * Tabs that hold something the person still has to fix, in tab order. A
 * credential that is stored (masked) counts as filled.
 */
export const tabsWithIssues = (values: ChannelValues, schema: FieldSchema[]): ChannelTab[] => {
  const issues = new Set<ChannelTab>();

  const applicationId = schema.find((field) => field.key === 'applicationId');
  const missingCredential = getSchemaFields(schema, 'credentials').some(
    (field) => field.required && !isFilled(values.credentials?.[field.key]),
  );
  if ((applicationId?.required && !isFilled(values.applicationId)) || missingCredential)
    issues.add('connect');

  if (accessIssues(values.settings ?? {}).includes('approverMissing')) issues.add('access');

  return TAB_ORDER.filter((tab) => issues.has(tab));
};
