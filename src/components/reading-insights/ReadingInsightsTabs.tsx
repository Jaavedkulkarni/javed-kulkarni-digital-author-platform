import { memo, useCallback, useRef, type KeyboardEvent } from 'react';
import type { ReadingInsightsTab, ReadingInsightsTabKey } from './readingInsightsTypes';import { READING_INSIGHTS_TABS } from './readingInsightsTypes';

interface ReadingInsightsTabsProps {
  activeTab: ReadingInsightsTabKey;
  onTabChange: (tab: ReadingInsightsTabKey) => void;
}

function getTabIndex(tabs: ReadingInsightsTab[], tabId: ReadingInsightsTabKey): number {
  return tabs.findIndex((tab) => tab.id === tabId);
}

export const ReadingInsightsTabs = memo(function ReadingInsightsTabs({
  activeTab,
  onTabChange,
}: ReadingInsightsTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = useCallback((index: number) => {
    const tab = READING_INSIGHTS_TABS[index];
    if (!tab) return;
    tabRefs.current[index]?.focus();
    onTabChange(tab.id);
  }, [onTabChange]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = getTabIndex(READING_INSIGHTS_TABS, activeTab);
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % READING_INSIGHTS_TABS.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = (currentIndex - 1 + READING_INSIGHTS_TABS.length) % READING_INSIGHTS_TABS.length;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = READING_INSIGHTS_TABS.length - 1;
        break;
      default:
        return;
    }

    focusTab(nextIndex);
  };

  return (
    <div
      role="tablist"
      aria-label="Reading insights sections"
      onKeyDown={handleKeyDown}
      className="-mx-1 overflow-x-auto px-1 pb-1"
    >
      <div className="flex min-w-max gap-1 rounded-xl border border-gray-200 bg-white p-1 dark:border-navy-700 dark:bg-navy-800 sm:gap-1.5">
        {READING_INSIGHTS_TABS.map((tab, index) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`reading-insights-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`reading-insights-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 sm:px-4 ${
                isActive
                  ? 'bg-brand text-white shadow-sm dark:bg-gold-500 dark:text-navy-900'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-navy-900 dark:text-gray-300 dark:hover:bg-navy-700 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default ReadingInsightsTabs;
