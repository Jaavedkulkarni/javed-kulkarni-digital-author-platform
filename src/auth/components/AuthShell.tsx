import type { ReactNode } from 'react';

export const AUTH_INPUT_CLASS =
  'w-full rounded-lg border border-navy-600 bg-navy-700 px-4 py-3 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50';

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  embedded = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  embedded?: boolean;
}) {
  const card = (
    <div className="rounded-xl border border-navy-700 bg-navy-800 p-8 shadow-xl">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gold-500 text-3xl font-bold text-navy-900">
          ज
        </div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle ? <p className="mt-2 text-gray-400">{subtitle}</p> : null}
      </div>
      {children}
      {footer ? <div className="mt-6">{footer}</div> : null}
    </div>
  );

  if (embedded) {
    return card;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 p-4">
      <div className="w-full max-w-md">{card}</div>
    </div>
  );
}

export default AuthShell;
