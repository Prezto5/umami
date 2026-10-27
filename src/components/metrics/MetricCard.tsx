import { Button, Column, Icon, Row, Text, Tooltip, TooltipTrigger } from '@umami/react-zen';
import { useSpring, useTransform } from 'motion/react';
import { type ReactNode, useEffect, useRef } from 'react';
import { AnimatedDiv } from '@/components/common/AnimatedDiv';
import { Info } from '@/components/icons';
import { ChangeLabel } from '@/components/metrics/ChangeLabel';
import { useFitValue } from '@/components/metrics/useFitValue';
import { formatNumber } from '@/lib/format';
import styles from './MetricCard.module.css';

export interface MetricCardProps {
  value: number;
  previousValue?: number;
  change?: number;
  label?: string;
  tooltip?: ReactNode;
  reverseColors?: boolean;
  formatValue?: (n: any) => string;
  showLabel?: boolean;
  showChange?: boolean;
}

export const MetricCard = ({
  value = 0,
  change = 0,
  label,
  tooltip,
  reverseColors = false,
  formatValue = formatNumber,
  showLabel = true,
  showChange = false,
}: MetricCardProps) => {
  const diff = value - change;
  const pct = diff !== 0 ? ((value - diff) / diff) * 100 : value !== 0 ? 100 : 0;
  const x = Number(value) || 0;
  const p = Number(pct) || 0;
  const xSpring = useSpring(0, { stiffness: 170, damping: 26 });
  const pctSpring = useSpring(0, { stiffness: 170, damping: 26 });
  const valueText = useTransform(xSpring, n => formatValue(n));
  const pctText = useTransform(pctSpring, n => `${Math.abs(~~n)}%`);
  const valueRef = useRef<HTMLDivElement>(null);

  useFitValue(valueRef);

  useEffect(() => {
    xSpring.set(x);
  }, [x, xSpring]);

  useEffect(() => {
    pctSpring.set(p);
  }, [p, pctSpring]);

  return (
    <Column
      justifyContent="center"
      paddingX="6"
      paddingY="4"
      borderRadius
      backgroundColor="surface"
      border
      gap="4"
      className={styles.card}
    >
      {showLabel && (
        <Row justifyContent="space-between" alignItems="flex-start">
          <Text weight="bold" wrap="nowrap">
            {label}
          </Text>
          {tooltip && (
            <TooltipTrigger delay={0}>
              <Button size="sm" variant="quiet">
                <Icon size="sm">
                  <Info />
                </Icon>
              </Button>
              <Tooltip placement="top">{tooltip}</Tooltip>
            </TooltipTrigger>
          )}
        </Row>
      )}
      <Text size="4xl" weight="bold" wrap="nowrap">
        <AnimatedDiv ref={valueRef} className={styles.value} title={value?.toString()}>
          {valueText}
        </AnimatedDiv>
      </Text>
      {showChange && (
        <ChangeLabel value={change} title={formatValue(change)} reverseColors={reverseColors}>
          <AnimatedDiv>{pctText}</AnimatedDiv>
        </ChangeLabel>
      )}
    </Column>
  );
};
