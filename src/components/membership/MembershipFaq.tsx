import { memo, useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { MembershipFaqItem } from './membershipTypes';
import { MEMBERSHIP_FAQ_ITEMS } from './membershipTypes';

const DEFAULT_OPEN_ID = MEMBERSHIP_FAQ_ITEMS[0]?.id ?? null;

interface FaqAccordionItemProps {
  item: MembershipFaqItem;
  isOpen: boolean;
  panelId: string;
  onToggle: (id: string) => void;
}

const FaqAccordionItem = memo(function FaqAccordionItem({
  item,
  isOpen,
  panelId,
  onToggle,
}: FaqAccordionItemProps) {
  return (
    <div>
      <h3>
        <button
          type="button"
          id={`${panelId}-trigger`}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => onToggle(item.id)}
          className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-medium text-navy-900 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-400/50 dark:text-white dark:hover:bg-navy-900/40 sm:px-5 sm:text-base"
        >
          <span>{item.question}</span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ease-out dark:text-gray-500 ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={`${panelId}-trigger`}
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:px-5">
            {item.answer}
          </div>
        </div>
      </div>
    </div>
  );
});

export const MembershipFaq = memo(function MembershipFaq() {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(DEFAULT_OPEN_ID);

  const toggleItem = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section aria-label="Membership frequently asked questions">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-navy-900 dark:text-white sm:text-lg">
          Frequently Asked Questions
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Common questions about AuthorOS membership.
        </p>
      </div>

      <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white shadow-sm dark:divide-navy-700 dark:border-navy-700 dark:bg-navy-800">
        {MEMBERSHIP_FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          const panelId = `${baseId}-${item.id}`;

          return (
            <FaqAccordionItem
              key={item.id}
              item={item}
              isOpen={isOpen}
              panelId={panelId}
              onToggle={toggleItem}
            />
          );
        })}
      </div>
    </section>
  );
});

export default MembershipFaq;
