import { memo } from 'react';
import type { JsonDiffEntry } from '../../../enterprise/timeline';

interface JsonDiffViewProps {
  entries: JsonDiffEntry[];
}

const TYPE_STYLES: Record<JsonDiffEntry['type'], string> = {
  added: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  removed: 'border-red-500/30 bg-red-500/10 text-red-200 line-through',
  modified: 'border-amber-500/30 bg-amber-500/10 text-amber-100',
  unchanged: 'border-navy-600 bg-navy-900/40 text-gray-400',
};

function formatValue(value: unknown): string {
  if (value === undefined) return '—';
  if (typeof value === 'string') return value;
  return JSON.stringify(value, null, 2);
}

export const JsonDiffView = memo(function JsonDiffView({ entries }: JsonDiffViewProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-gray-500">No field changes detected.</p>;
  }

  return (
    <div className="space-y-2" role="list" aria-label="Field changes">
      {entries.map((entry) => (
        <div
          key={entry.path}
          role="listitem"
          className={`rounded-lg border px-3 py-2 ${TYPE_STYLES[entry.type]}`}
        >
          <p className="font-mono text-xs font-semibold">{entry.path}</p>
          {entry.type === 'added' ? (
            <pre className="mt-1 whitespace-pre-wrap break-all text-xs">{formatValue(entry.after)}</pre>
          ) : null}
          {entry.type === 'removed' ? (
            <pre className="mt-1 whitespace-pre-wrap break-all text-xs">{formatValue(entry.before)}</pre>
          ) : null}
          {entry.type === 'modified' ? (
            <div className="mt-2 space-y-2">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-red-300/80">Before</p>
                <pre className="whitespace-pre-wrap break-all text-xs">{formatValue(entry.before)}</pre>
              </div>
              <p className="text-center text-xs text-gray-500" aria-hidden="true">
                ↓
              </p>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-emerald-300/80">After</p>
                <pre className="whitespace-pre-wrap break-all text-xs">{formatValue(entry.after)}</pre>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
});

export default JsonDiffView;
