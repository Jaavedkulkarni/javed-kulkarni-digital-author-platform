/**
 * Reading Insights UI Version 1.0 — Frozen
 * Sprint 07A.1 production polish.
 */
import { useState, type ReactNode } from 'react';
import { PageHeader } from '../shared/page/PageHeader';
import { ReadingProgressContent } from '../reading/ReadingProgressContent';
import type { ReadingInsightsTabKey } from './readingInsightsTypes';
import { ReadingInsightsTabs } from './ReadingInsightsTabs';
import { AnalyticsCards } from './AnalyticsCards';
import { ReadingTimeCards } from './ReadingTimeCards';
import { ReadingStreakCards } from './ReadingStreakCards';
import { ReadingGoals } from './ReadingGoals';
import { AchievementsGrid } from './AchievementsGrid';

function ReadingInsightsPanel({
  tabId,
  activeTab,
  children,
}: {
  tabId: ReadingInsightsTabKey;
  activeTab: ReadingInsightsTabKey;
  children: ReactNode;
}) {
  const isActive = tabId === activeTab;

  return (
    <div
      role="tabpanel"
      id={`reading-insights-panel-${tabId}`}
      aria-labelledby={`reading-insights-tab-${tabId}`}
      hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
      className={isActive ? 'space-y-4 sm:space-y-5' : undefined}
    >
      {isActive ? children : null}
    </div>
  );
}

export function ReadingInsightsContent() {
  const [activeTab, setActiveTab] = useState<ReadingInsightsTabKey>('progress');

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader subtitle="Track your reading habits, progress and achievements." />

      <ReadingInsightsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <ReadingInsightsPanel tabId="progress" activeTab={activeTab}>
        <ReadingProgressContent embedded />
      </ReadingInsightsPanel>

      <ReadingInsightsPanel tabId="analytics" activeTab={activeTab}>
        <AnalyticsCards />
      </ReadingInsightsPanel>

      <ReadingInsightsPanel tabId="reading-time" activeTab={activeTab}>
        <ReadingTimeCards />
      </ReadingInsightsPanel>

      <ReadingInsightsPanel tabId="streak" activeTab={activeTab}>
        <ReadingStreakCards />
      </ReadingInsightsPanel>

      <ReadingInsightsPanel tabId="goals" activeTab={activeTab}>
        <ReadingGoals />
      </ReadingInsightsPanel>

      <ReadingInsightsPanel tabId="achievements" activeTab={activeTab}>
        <AchievementsGrid />
      </ReadingInsightsPanel>
    </div>
  );
}

export default ReadingInsightsContent;
