import { memo } from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface AlreadyAuthorNoticeProps {
  onGoToDashboard: () => void;
}

export const AlreadyAuthorNotice = memo(function AlreadyAuthorNotice({
  onGoToDashboard,
}: AlreadyAuthorNoticeProps) {
  return (
    <div className="text-center space-y-4 py-2">
      <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
      <p className="text-gray-300 text-sm font-medium">You are already an Author.</p>
      <button
        type="button"
        onClick={onGoToDashboard}
        className="w-full py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400"
      >
        Go to Dashboard
      </button>
    </div>
  );
});

export default AlreadyAuthorNotice;
