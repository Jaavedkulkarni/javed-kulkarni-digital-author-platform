import { memo, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import type { OrderDetailView } from './orderTypes';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_STYLES,
} from './orderTypes';
import { MONO_ID_CLASS, OrderDrawerButton, OrderStatusBadge } from './orderUi';

interface OrderDetailsDrawerProps {
  detail: OrderDetailView | null;
  open: boolean;
  onClose: () => void;
}

const TIMELINE_STEPS = [
  'Order Created',
  'Payment Successful',
  'Invoice Generated',
  'Book Added to Library',
  'Download Enabled',
] as const;

const DRAWER_TRANSITION_MS = 300;

function sectionId(title: string) {
  return `drawer-${title.replace(/\s+/g, '-').toLowerCase()}`;
}

function DrawerSection({ title, children }: { title: string; children: ReactNode }) {
  const id = sectionId(title);
  return (
    <section aria-labelledby={id} className="scroll-mt-4">
      <h3
        id={id}
        className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

function DetailPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3.5 text-sm shadow-sm dark:border-navy-700 dark:bg-navy-800/70">
      {children}
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-2 last:border-0 dark:border-navy-700/80">
      <dt className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{label}</dt>
      <dd
        className={`text-right text-sm font-medium text-navy-900 dark:text-white ${
          mono ? MONO_ID_CLASS : 'tabular-nums'
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export const OrderDetailsDrawer = memo(function OrderDetailsDrawer({
  detail,
  open,
  onClose,
}: OrderDetailsDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const timeline = useMemo(() => TIMELINE_STEPS, []);

  useEffect(() => {
    if (open && detail) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      setIsMounted(true);
      const frame = requestAnimationFrame(() => setIsVisible(true));
      const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), DRAWER_TRANSITION_MS);
      return () => {
        cancelAnimationFrame(frame);
        window.clearTimeout(focusTimer);
      };
    }

    setIsVisible(false);
    const timer = window.setTimeout(() => setIsMounted(false), DRAWER_TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [open, detail]);

  useEffect(() => {
    if (!isMounted) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMounted, onClose]);

  useEffect(() => {
    if (isMounted) return;
    previousFocusRef.current?.focus?.();
  }, [isMounted]);

  const handleClose = () => {
    onClose();
  };

  if (!isMounted || !detail) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button
        type="button"
        aria-label="Close order details"
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-drawer-title"
        aria-describedby="order-drawer-subtitle"
        className={`relative flex h-full w-full max-w-[min(100vw,28rem)] flex-col border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out dark:border-navy-700 dark:bg-[#0f1117] sm:max-w-xl ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3.5 dark:border-navy-700 sm:px-6">
          <div className="min-w-0 pr-3">
            <h2 id="order-drawer-title" className="truncate text-lg font-semibold text-navy-900 dark:text-white">
              Order Details
            </h2>
            <p id="order-drawer-subtitle" className={`mt-0.5 truncate text-sm ${MONO_ID_CLASS}`}>
              {detail.orderNumber}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Close drawer"
            className="inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:hover:bg-navy-800 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6">
          <DrawerSection title="Order Summary">
            <DetailPanel>
              <dl>
                <DetailRow label="Order Number" value={detail.orderNumber} mono />
                <DetailRow label="Purchase Date" value={detail.purchaseDate} />
                <DetailRow label="Amount Paid" value={detail.amountPaid} />
              </dl>
              <div
                className="mt-3 flex min-h-7 flex-wrap items-center gap-1.5"
                role="group"
                aria-label="Order status badges"
              >
                <OrderStatusBadge
                  label={PAYMENT_STATUS_LABELS[detail.paymentStatus]}
                  styleClass={PAYMENT_STATUS_STYLES[detail.paymentStatus]}
                  type="payment"
                />
                <OrderStatusBadge
                  label={ORDER_STATUS_LABELS[detail.orderStatus]}
                  styleClass={ORDER_STATUS_STYLES[detail.orderStatus]}
                  type="order"
                />
              </div>
            </DetailPanel>
          </DrawerSection>

          <DrawerSection title="Book Information">
            <DetailPanel>
              <p className="text-base font-semibold leading-snug text-navy-900 dark:text-white">{detail.bookTitle}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{detail.author}</p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {detail.language} · {detail.category} · {detail.format}
              </p>
            </DetailPanel>
          </DrawerSection>

          <DrawerSection title="Payment">
            <DetailPanel>
              <dl>
                <DetailRow label="Payment Method" value={detail.paymentMethod} />
                <DetailRow label="Subtotal" value={detail.subtotal} />
                <DetailRow label="Discount" value={detail.discountAmount} />
                <DetailRow label="Grand Total" value={detail.grandTotal} />
                <DetailRow label="Transaction ID" value={detail.transactionId} mono />
                <DetailRow label="Payment Reference" value={detail.paymentReference} mono />
                <DetailRow label="Billing Name" value={detail.billingName} />
                <DetailRow label="Billing Email" value={detail.billingEmail} />
              </dl>
            </DetailPanel>
          </DrawerSection>

          <DrawerSection title="Invoice">
            <DetailPanel>
              <dl>
                <DetailRow label="Invoice Number" value={detail.invoiceNumber} mono />
                <DetailRow label="Invoice URL" value={detail.invoiceUrl ?? '—'} mono />
              </dl>
              <div className="mt-3">
                <OrderDrawerButton>Download Invoice</OrderDrawerButton>
              </div>
            </DetailPanel>
          </DrawerSection>

          <DrawerSection title="GST">
            <DetailPanel>
              <dl>
                <DetailRow label="GST %" value={detail.gstPercent} />
                <DetailRow label="GST Amount" value={detail.gstAmount} />
              </dl>
            </DetailPanel>
          </DrawerSection>

          <DrawerSection title="Downloads">
            <DetailPanel>
              <dl>
                <DetailRow label="Download Available" value={detail.downloadAvailable ? 'Yes' : 'No'} />
                <DetailRow label="Downloads Used" value={`${detail.downloadCount} / ${detail.downloadLimit}`} />
              </dl>
              <div className="mt-3">
                <OrderDrawerButton>Download Book</OrderDrawerButton>
              </div>
            </DetailPanel>
          </DrawerSection>

          {detail.membershipPurchase ? (
            <DrawerSection title="Membership Details">
              <DetailPanel>
                <dl>
                  <DetailRow label="Plan" value={detail.membershipPlan ?? '—'} />
                  <DetailRow label="Expiry" value={detail.membershipExpiry ?? '—'} />
                </dl>
              </DetailPanel>
            </DrawerSection>
          ) : null}

          <DrawerSection title="Support">
            <DetailPanel>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Need help with this order? Support options will be available in a future sprint.
              </p>
              <div className="mt-3">
                <OrderDrawerButton variant="ghost">Need Help</OrderDrawerButton>
              </div>
            </DetailPanel>
          </DrawerSection>

          <DrawerSection title="Timeline">
            <ol className="relative space-y-0" aria-label="Order timeline">
              {timeline.map((step, index) => {
                const isComplete = index === 0;
                const isLast = index === timeline.length - 1;
                return (
                  <li key={step} className="relative flex gap-3 pb-5 last:pb-0">
                    {!isLast ? (
                      <span
                        aria-hidden="true"
                        className={`absolute left-[11px] top-6 h-[calc(100%-1rem)] w-px ${
                          isComplete ? 'bg-brand/30 dark:bg-gold-500/30' : 'bg-gray-200 dark:bg-navy-600'
                        }`}
                      />
                    ) : null}
                    <span
                      aria-hidden="true"
                      className={`relative z-[1] mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        isComplete
                          ? 'bg-brand text-white shadow-sm dark:bg-gold-500 dark:text-navy-900'
                          : 'border border-gray-300 bg-white text-gray-400 dark:border-navy-600 dark:bg-navy-800 dark:text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-sm font-medium text-navy-900 dark:text-white">{step}</p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Pending update</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </DrawerSection>

          <DrawerSection title="Refund Information">
            <DetailPanel>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Refund details and status will appear here when available.
              </p>
            </DetailPanel>
          </DrawerSection>
        </div>
      </aside>
    </div>
  );
});

export default OrderDetailsDrawer;
