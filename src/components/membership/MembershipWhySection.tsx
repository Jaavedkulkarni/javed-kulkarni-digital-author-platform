import { memo } from 'react';
import {
  BookOpen,
  Download,
  Percent,
  FileText,
  BookMarked,
  Feather,
  BarChart3,
  Headphones,
  type LucideIcon,
} from 'lucide-react';

interface WhyMemberCardDefinition {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const WHY_MEMBER_CARDS: WhyMemberCardDefinition[] = [
  {
    id: 'premium-books',
    title: 'Unlimited Premium Books',
    description: 'Access the full premium catalogue across genres and languages.',
    icon: BookOpen,
  },
  {
    id: 'offline-reading',
    title: 'Offline Reading',
    description: 'Download titles and read anywhere without an internet connection.',
    icon: Download,
  },
  {
    id: 'member-discounts',
    title: 'Member Discounts',
    description: 'Save on purchases with exclusive member pricing on select titles.',
    icon: Percent,
  },
  {
    id: 'premium-articles',
    title: 'Premium Articles',
    description: 'Read in-depth essays, columns, and long-form writing from the author.',
    icon: FileText,
  },
  {
    id: 'premium-stories',
    title: 'Premium Stories',
    description: 'Discover member-only fiction and serialized story collections.',
    icon: BookMarked,
  },
  {
    id: 'premium-poems',
    title: 'Premium Poems',
    description: 'Enjoy curated poetry collections reserved for members.',
    icon: Feather,
  },
  {
    id: 'reading-insights',
    title: 'Reading Insights',
    description: 'Track habits and milestones with personalized reading analytics.',
    icon: BarChart3,
  },
  {
    id: 'priority-support',
    title: 'Priority Support',
    description: 'Get faster help from the reader support team when you need it.',
    icon: Headphones,
  },
];

const WhyMemberCard = memo(function WhyMemberCard({ card }: { card: WhyMemberCardDefinition }) {
  const Icon = card.icon;

  return (
    <article
      aria-label={card.title}
      className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-gold-300/60 hover:shadow-md dark:border-navy-700 dark:bg-navy-800 dark:hover:border-gold-700/50 sm:p-6"
    >
      <div
        aria-hidden="true"
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 dark:border-navy-600 dark:bg-navy-900/50"
      >
        <Icon className="h-5 w-5 text-brand" />
      </div>
      <h3 className="text-sm font-semibold text-navy-900 dark:text-white sm:text-base">{card.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        {card.description}
      </p>
    </article>
  );
});

export const MembershipWhySection = memo(function MembershipWhySection() {
  return (
    <section aria-label="Why become a member">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-navy-900 dark:text-white sm:text-lg">
          Why Become a Member?
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Exclusive benefits designed for passionate readers.
        </p>
      </div>

      <div
        role="list"
        aria-label="Membership benefits highlights"
        className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4"
      >
        {WHY_MEMBER_CARDS.map((card) => (
          <div key={card.id} role="listitem" className="h-full min-h-0">
            <WhyMemberCard card={card} />
          </div>
        ))}
      </div>
    </section>
  );
});

export default MembershipWhySection;
