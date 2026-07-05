import { Search, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

type OrderStateVariant = 'empty' | 'no-results';

interface OrderStatePanelProps {
  variant: OrderStateVariant;
}

const STATE_CONTENT: Record<
  OrderStateVariant,
  { icon: typeof ShoppingBag; title: string; description: string; showCta: boolean; ariaLabel: string }
> = {
  empty: {
    icon: ShoppingBag,
    title: 'No Orders Yet',
    description: 'Your purchased books will appear here after successful payment.',
    showCta: true,
    ariaLabel: 'No orders yet',
  },
  'no-results': {
    icon: Search,
    title: 'No orders match your search or filters.',
    description: 'Try adjusting your search or filter criteria.',
    showCta: false,
    ariaLabel: 'No matching orders',
  },
};

export function OrderStatePanel({ variant }: OrderStatePanelProps) {
  const content = STATE_CONTENT[variant];
  const Icon = content.icon;

  return (
    <div
      role="status"
      aria-label={content.ariaLabel}
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm dark:border-navy-700 dark:bg-navy-800 sm:px-10"
    >
      <div
        aria-hidden="true"
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 dark:border-navy-600 dark:bg-navy-900/50"
      >
        <Icon className="h-12 w-12 text-gray-300 dark:text-gray-600" />
      </div>
      <h2 className="text-lg font-semibold text-navy-900 dark:text-white sm:text-xl">{content.title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        {content.description}
      </p>
      {content.showCta ? (
        <Link
          to="/#books"
          className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
        >
          Browse Books
        </Link>
      ) : null}
    </div>
  );
}

export default OrderStatePanel;
