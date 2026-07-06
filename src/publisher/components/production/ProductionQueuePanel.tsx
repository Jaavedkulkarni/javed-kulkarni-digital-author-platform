import type { ProductionJob } from '../../types/production.types';
import { PRODUCTION_STATUS_LABELS } from '../../constants';

interface ProductionQueuePanelProps {
  jobs: ProductionJob[];
  isLoading?: boolean;
}

export function ProductionQueuePanel({ jobs, isLoading }: ProductionQueuePanelProps) {
  if (isLoading) return <div className="text-sm text-gray-400">Loading production jobs...</div>;

  if (jobs.length === 0) {
    return <p className="text-sm text-gray-400">No production jobs assigned by AuthorOS.</p>;
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div key={job.id} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-white">{job.jobNumber}</p>
              <p className="text-xs text-gray-400">{job.bookTitle}</p>
              <p className="text-xs text-gray-500">Ref: {job.referenceAuthorName}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-navy-700 text-gray-300 capitalize">
              {job.priority}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
            <span>Qty: {job.quantity}</span>
            <span>{PRODUCTION_STATUS_LABELS[job.status] ?? job.status}</span>
            <span>Due: {job.expectedCompletion.slice(0, 10)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
