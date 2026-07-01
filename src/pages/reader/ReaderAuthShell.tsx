import { ReactNode } from 'react';

const inputCls =
  'w-full px-4 py-3 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none';

export function ReaderAuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-navy-800 rounded-xl p-8 shadow-xl border border-navy-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gold-500 flex items-center justify-center text-navy-900 text-3xl font-bold mb-4">
              ज
            </div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-gray-400 mt-2">{subtitle}</p>}
          </div>
          {children}
          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export { inputCls };
