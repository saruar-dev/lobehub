import { describe, expect, it } from 'vitest';

import type { FieldSchema } from '@/server/services/bot/platforms/types';

import { groupSettingsFields } from './settingsGroups';

const field = (key: string): FieldSchema => ({ key, label: key, type: 'string' });

describe('groupSettingsFields', () => {
  it('sorts fields into connect, access, reply and advanced, ordered by how a person decides them', () => {
    const groups = groupSettingsFields(
      [
        'serverId',
        'charLimit',
        'groupPolicy',
        'watchKeywords',
        'allowFrom',
        'dmPolicy',
        'userId',
        'displayToolCalls',
        'reactionMode',
        'historyLimit',
      ].map(field),
    );

    expect(groups.map((g) => [g.key, g.fields.map((f) => f.key)])).toEqual([
      ['connect', ['serverId']],
      ['access', ['userId', 'dmPolicy', 'allowFrom', 'groupPolicy']],
      ['reply', ['displayToolCalls', 'reactionMode', 'watchKeywords']],
      ['advanced', ['charLimit', 'historyLimit']],
    ]);
  });

  it('keeps a field it does not know in advanced, in schema order, so nothing disappears', () => {
    const groups = groupSettingsFields(['mysterySetting', 'dmPolicy', 'someNewSetting'].map(field));

    expect(groups.find((g) => g.key === 'advanced')?.fields.map((f) => f.key)).toEqual([
      'mysterySetting',
      'someNewSetting',
    ]);
  });

  it('puts how the bot reaches the platform with the connection, not with the technical limits', () => {
    const groups = groupSettingsFields(['charLimit', 'connectionMode', 'serverId'].map(field));

    expect(groups.find((g) => g.key === 'connect')?.fields.map((f) => f.key)).toEqual([
      'serverId',
      'connectionMode',
    ]);
    expect(groups.find((g) => g.key === 'advanced')?.fields.map((f) => f.key)).toEqual([
      'charLimit',
    ]);
  });

  it('drops sections a platform has no fields for', () => {
    const groups = groupSettingsFields(['displayToolCalls', 'watchKeywords'].map(field));

    expect(groups.map((g) => g.key)).toEqual(['reply']);
  });

  it('returns nothing for a platform without settings', () => {
    expect(groupSettingsFields([])).toEqual([]);
  });
});
