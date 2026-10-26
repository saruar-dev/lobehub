import { describe, expect, it } from 'vitest';

import type { FieldSchema } from '@/server/services/bot/platforms/types';

import { defaultTab, resolveTabs, tabsWithIssues } from './channelTabs';

const schema: FieldSchema[] = [
  { key: 'applicationId', label: 'id', required: true, type: 'string' },
  {
    key: 'credentials',
    label: 'credentials',
    properties: [
      { key: 'botToken', label: 'token', required: true, type: 'password' },
      { key: 'note', label: 'note', type: 'string' },
    ],
    type: 'object',
  },
];

describe('resolveTabs', () => {
  it('always has connect, then the settings tabs the platform has, in page order', () => {
    expect(resolveTabs(['advanced', 'access', 'reply'])).toEqual([
      'connect',
      'access',
      'reply',
      'advanced',
    ]);
    expect(resolveTabs(['reply'])).toEqual(['connect', 'reply']);
    expect(resolveTabs([])).toEqual(['connect']);
  });
});

describe('defaultTab', () => {
  it('starts a new channel on connect', () => {
    expect(defaultTab(['connect', 'access', 'reply'], false)).toBe('connect');
  });

  it('opens a saved channel on its first settings tab', () => {
    expect(defaultTab(['connect', 'access', 'reply'], true)).toBe('access');
    expect(defaultTab(['connect', 'reply'], true)).toBe('reply');
  });

  it('stays on connect when there is nothing else', () => {
    expect(defaultTab(['connect'], true)).toBe('connect');
  });
});

describe('tabsWithIssues', () => {
  it('flags connect while a required credential or the app ID is empty', () => {
    expect(tabsWithIssues({}, schema)).toEqual(['connect']);
    expect(tabsWithIssues({ applicationId: '1', credentials: { botToken: ' ' } }, schema)).toEqual([
      'connect',
    ]);
    expect(tabsWithIssues({ credentials: { botToken: 't' } }, schema)).toEqual(['connect']);
  });

  it('is quiet once required values are there, including a stored masked secret', () => {
    expect(
      tabsWithIssues({ applicationId: '1', credentials: { botToken: '••••' } }, schema),
    ).toEqual([]);
  });

  it('flags access when approval is chosen without an owner ID', () => {
    const values = {
      applicationId: '1',
      credentials: { botToken: 't' },
      settings: { dmPolicy: 'pairing' },
    };
    expect(tabsWithIssues(values, schema)).toEqual(['access']);
    expect(
      tabsWithIssues({ ...values, settings: { ...values.settings, userId: '9' } }, schema),
    ).toEqual([]);
  });

  it('lists several tabs in page order', () => {
    expect(tabsWithIssues({ settings: { dmPolicy: 'pairing' } }, schema)).toEqual([
      'connect',
      'access',
    ]);
  });
});
