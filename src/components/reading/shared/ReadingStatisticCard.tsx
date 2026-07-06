import { memo } from 'react';
import { StatisticItem } from '../../shared/statistics/StatisticItem';

interface ReadingStatisticCardProps {
  label: string;
  value?: string;
  ariaLabel?: string;
}

export const ReadingStatisticCard = memo(function ReadingStatisticCard(props: ReadingStatisticCardProps) {
  return <StatisticItem {...props} />;
});

export default ReadingStatisticCard;
