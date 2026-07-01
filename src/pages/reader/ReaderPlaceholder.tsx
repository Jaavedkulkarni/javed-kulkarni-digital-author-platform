import { ReactNode } from 'react';

export function ReaderPlaceholder({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-8 max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <div className="rounded-lg border border-dashed border-navy-600 bg-navy-900/50 p-6 text-center text-gray-500 text-sm">
        {children ?? 'Coming soon — product and library features will be added in a future sprint.'}
      </div>
    </div>
  );
}

export default ReaderPlaceholder;
