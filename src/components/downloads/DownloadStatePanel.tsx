import { Download } from 'lucide-react';
import { EmptyState, EmptyStateLink } from '../shared/states/EmptyState';
import { SecondaryButton } from '../shared/buttons/SecondaryButton';

export function DownloadStatePanel() {
  return (
    <EmptyState
      icon={Download}
      title="No Downloads Yet"
      description="Downloaded books will appear here for offline reading."
      ariaLabel="No downloads yet"
    >
      <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
        <EmptyStateLink to="/#books" className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 sm:w-auto">
          Browse Books
        </EmptyStateLink>
        <SecondaryButton>Membership</SecondaryButton>
      </div>
    </EmptyState>
  );
}

export default DownloadStatePanel;
