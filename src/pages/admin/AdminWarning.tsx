import { AlertCircle } from 'lucide-react';

export function AdminWarning({ title, message }: { title: string; message: string }) {
  return (
    <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
      <div>
        <p className="text-sm font-semibold text-amber-300">{title}</p>
        <p className="text-sm text-amber-200/90 mt-1 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
