import { memo } from 'react';
import { Clock } from 'lucide-react';

export interface PublisherPendingApprovalPanelProps {
  onClose?: () => void;
}

export const PublisherPendingApprovalPanel = memo(function PublisherPendingApprovalPanel({
  onClose,
}: PublisherPendingApprovalPanelProps) {
  return (
    <div className="text-center space-y-4 py-2">
      <Clock className="w-12 h-12 text-gold-400 mx-auto" />
      <p className="text-gray-300 text-sm font-medium">Registration submitted successfully.</p>
      <p className="text-gray-500 text-xs">
        Your publisher application is pending approval. We will notify you once it has been reviewed.
      </p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-lg border border-gold-500/40 text-gold-400 font-semibold hover:bg-gold-500/10"
        >
          Return to Home
        </button>
      )}
    </div>
  );
});

export default PublisherPendingApprovalPanel;
