'use client';

import { Button, Flexbox, Icon, Text } from '@lobehub/ui';
import { cssVar } from '@lobehub/ui/stylex/cssVar.stylex';
import * as stylex from '@stylexjs/stylex';
import { ExternalLinkIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { SetupGuide as SetupGuideModel } from './guides';

const styles = stylex.create({
  index: {
    color: cssVar.colorTextTertiary,
    flexShrink: 0,
    fontVariantNumeric: 'tabular-nums',
    minWidth: 16,
  },
  row: {
    alignItems: 'flex-start',
    columnGap: 12,
    display: 'flex',
    justifyContent: 'space-between',
    paddingBlock: 14,
  },
  rowSeparated: {
    borderBlockStartColor: cssVar.colorBorderSecondary,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
  },
});

/**
 * A platform's setup as a plain list of steps: what to do, one line of how,
 * and the link to the console page it happens on at the end of the row. Steps
 * that need the app ID say so until the form has it.
 */
const SetupGuide = memo<{ guide: SetupGuideModel }>(({ guide }) => {
  const { t } = useTranslation('agent');
  const prefix = `channel.quickSetup.${guide.guide}`;

  return (
    <div data-testid={'channel-setup-guide'}>
      {guide.steps.map((step, index) => (
        <div {...stylex.props(styles.row, index > 0 && styles.rowSeparated)} key={step.key}>
          <Flexbox horizontal align={'flex-start'} gap={12} style={{ minWidth: 0 }}>
            <Text fontSize={13} {...stylex.props(styles.index)}>
              {index + 1}
            </Text>
            <Flexbox gap={2} style={{ minWidth: 0 }}>
              <Text weight={500}>{t(`${prefix}.${step.key}.title` as any)}</Text>
              <Text fontSize={12} type={'secondary'}>
                {t(`${prefix}.${step.key}.desc` as any)}
              </Text>
              {step.needsApplicationId && (
                <Text fontSize={12} type={'warning'}>
                  {t('channel.quickSetup.needsApplicationId')}
                </Text>
              )}
            </Flexbox>
          </Flexbox>
          {step.link && (
            <a href={step.link.href} rel={'noreferrer'} style={{ flexShrink: 0 }} target={'_blank'}>
              <Button icon={<Icon icon={ExternalLinkIcon} />} size={'small'}>
                {t(`channel.quickSetup.link.${step.link.label}`)}
              </Button>
            </a>
          )}
        </div>
      ))}
    </div>
  );
});

SetupGuide.displayName = 'ChannelSetupGuide';

export default SetupGuide;
