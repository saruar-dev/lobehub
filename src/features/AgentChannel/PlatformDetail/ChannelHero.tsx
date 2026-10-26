'use client';

import { Button, Flexbox, Icon, Text } from '@lobehub/ui';
import { cssVar } from '@lobehub/ui/stylex/cssVar.stylex';
import * as stylex from '@stylexjs/stylex';
import { ExternalLink } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { SerializedPlatformDefinition } from '@/server/services/bot/platforms/types';

import { getPlatformIcon } from '../const';
import { getSetupGuide } from '../quickSetup/guides';
import { findInviteLink, maskId } from './heroModel';

const styles = stylex.create({
  logo: {
    alignItems: 'center',
    backgroundColor: cssVar.colorFillQuaternary,
    borderRadius: cssVar.borderRadiusLG,
    display: 'flex',
    flexShrink: 0,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
});

interface ChannelHeroProps {
  /** The saved bot's application ID; empty before the channel is set up. */
  applicationId?: string;
  /** The agent the bot speaks as. */
  botName?: string;
  platformDef: SerializedPlatformDefinition;
}

/**
 * Which bot this page is about: the platform, the agent it speaks as and the
 * app it is connected to, with the two links a person reaches for most (the
 * platform's console and, where the platform has one, the invite link).
 */
export const ChannelHero = memo<ChannelHeroProps>(({ applicationId, botName, platformDef }) => {
  const { t: _t } = useTranslation('agent');
  const t = _t as (key: string, options?: Record<string, unknown>) => string;

  const PlatformIcon = getPlatformIcon(platformDef.name);
  const ColorIcon =
    PlatformIcon && 'Color' in PlatformIcon ? (PlatformIcon as any).Color : PlatformIcon;

  const savedId = applicationId?.trim();
  const invite = useMemo(
    () =>
      savedId
        ? findInviteLink(getSetupGuide(platformDef.id, { applicationId: savedId, appName: '' }))
        : undefined,
    [platformDef.id, savedId],
  );
  const portalUrl = platformDef.documentation?.portalUrl;
  const agent = botName?.trim() || t('channel.quickView.bot');

  return (
    <Flexbox horizontal align={'center'} data-testid={'channel-hero'} gap={12} wrap={'wrap'}>
      <div {...stylex.props(styles.logo)}>{ColorIcon && <ColorIcon size={28} />}</div>
      <Flexbox flex={1} gap={2} style={{ minWidth: 200 }}>
        <Text fontSize={18} weight={600}>
          {t('channel.hero.title', { name: platformDef.name })}
        </Text>
        <Text ellipsis fontSize={13} type={'secondary'}>
          {savedId
            ? t('channel.hero.connected', { agent, id: maskId(savedId) })
            : t('channel.hero.new', { agent, name: platformDef.name })}
        </Text>
      </Flexbox>
      <Flexbox horizontal gap={8}>
        {invite && (
          <a href={invite.href} rel={'noreferrer'} target={'_blank'}>
            <Button icon={<Icon icon={ExternalLink} />}>
              {t('channel.quickSetup.link.inviteBot')}
            </Button>
          </a>
        )}
        {portalUrl && (
          <a href={portalUrl} rel={'noreferrer'} target={'_blank'}>
            <Button icon={<Icon icon={ExternalLink} />}>
              {t('channel.quickSetup.link.openConsole')}
            </Button>
          </a>
        )}
      </Flexbox>
    </Flexbox>
  );
});

ChannelHero.displayName = 'ChannelHero';
