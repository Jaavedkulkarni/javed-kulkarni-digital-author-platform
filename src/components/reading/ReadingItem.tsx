import { memo } from 'react';
import type { ReadingCardItem } from './readingTypes';
import { ReadingCard } from './ReadingCard';

interface ReadingItemProps {
  item: ReadingCardItem;
  selected: boolean;
  onSelect: (recordId: string) => void;
  compact?: boolean;
}

export const ReadingItem = memo(function ReadingItem({
  item,
  selected,
  onSelect,
  compact = false,
}: ReadingItemProps) {
  return (
    <ReadingCard
      item={item}
      compact={compact}
      selected={selected}
      onSelect={() => onSelect(item.id)}
    />
  );
});

export default ReadingItem;
