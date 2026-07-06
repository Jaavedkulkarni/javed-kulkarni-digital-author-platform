import { memo } from 'react';

import { READING_TIMELINE_STEPS } from '../readingTypes';



interface ReadingTimelineProps {

  startedReading?: string;

  lastOpened?: string;

  currentProgress?: string;

  completedDate?: string;

  compact?: boolean;

  className?: string;

}



const PLACEHOLDER = '—';



export const ReadingTimeline = memo(function ReadingTimeline({

  startedReading,

  lastOpened,

  currentProgress,

  completedDate,

  compact = false,

  className = '',

}: ReadingTimelineProps) {

  const values: Record<string, string | undefined> = {

    started: startedReading,

    lastOpened,

    currentProgress,

    completed: completedDate,

  };



  const shellClass = compact

    ? 'rounded-lg border border-gray-100 bg-gray-50 p-2 dark:border-navy-700 dark:bg-navy-900/40'

    : 'rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-navy-700 dark:bg-navy-900/40';



  const listClass = compact

    ? 'grid grid-cols-2 gap-x-2 gap-y-1 sm:grid-cols-4'

    : 'space-y-2';



  const itemClass = compact ? 'flex min-w-0 flex-col gap-0.5 text-[11px]' : 'flex items-start gap-2 text-xs';



  return (

    <div role="list" aria-label="Reading timeline" className={`${shellClass} ${className}`}>

      <p

        className={`font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 ${

          compact ? 'mb-1.5 text-[10px]' : 'mb-2 text-xs'

        }`}

      >

        Reading Timeline

      </p>

      <ol className={listClass}>

        {READING_TIMELINE_STEPS.map((step, index) => (

          <li key={step.key} className={itemClass}>

            {!compact ? (

              <span

                aria-hidden="true"

                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-[10px] font-medium text-gray-500 dark:border-navy-600 dark:bg-navy-800 dark:text-gray-400"

              >

                {index + 1}

              </span>

            ) : null}

            <div className="min-w-0 flex-1">

              <p className={`font-medium text-gray-600 dark:text-gray-300 ${compact ? 'text-[10px]' : ''}`}>

                {step.label}

              </p>

              <p className="truncate tabular-nums text-navy-900 dark:text-white">{values[step.key] ?? PLACEHOLDER}</p>

            </div>

          </li>

        ))}

      </ol>

    </div>

  );

});



export default ReadingTimeline;


