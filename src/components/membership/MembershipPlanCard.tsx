import { memo } from 'react';
import { Check } from 'lucide-react';
import type { MembershipPlanDefinition } from './membershipTypes';
import {
  COMING_SOON_BADGE_STYLE,
  CURRENT_PLAN_BADGE_STYLE,
  LIFETIME_BADGE_LABEL,
  MEMBERSHIP_PLAN_SAVINGS,
  POPULAR_BADGE_STYLE,
} from './membershipTypes';
import { MembershipBadge, MembershipPrimaryButton } from './membershipUi';

interface MembershipPlanCardProps {
  plan: MembershipPlanDefinition;
}

function getPlanCtaLabel(plan: MembershipPlanDefinition): string {
  if (plan.isCurrent) return 'Current Plan';
  if (plan.isComingSoon) return 'Coming Soon';
  return 'Choose Plan';
}

const HERO_CARD_CLASS =
  'relative z-10 border-gold-300 bg-gradient-to-b from-gold-50/80 to-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gold-700 dark:from-gold-950/30 dark:to-navy-800 sm:scale-[1.02] sm:p-7';

const STANDARD_CARD_CLASS =
  'border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md dark:border-navy-700';

export const MembershipPlanCard = memo(function MembershipPlanCard({ plan }: MembershipPlanCardProps) {
  const isCtaDisabled = plan.isComingSoon || plan.isCurrent;
  const savingsLabel = MEMBERSHIP_PLAN_SAVINGS[plan.id];

  return (
    <article
      aria-label={`${plan.name} membership plan`}
      className={`flex h-full flex-col rounded-xl border bg-white p-5 focus-within:ring-2 focus-within:ring-gold-400/40 dark:bg-navy-800 sm:p-6 ${
        plan.isPopular ? HERO_CARD_CLASS : STANDARD_CARD_CLASS
      }`}
    >
      {plan.isPopular ? (
        <div className="absolute right-4 top-4" aria-label="Plan badges">
          <MembershipBadge label="Popular" styleClass={POPULAR_BADGE_STYLE} />
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div className={plan.isPopular ? 'pr-20' : undefined}>
          <h3 className="text-base font-semibold text-navy-900 dark:text-white sm:text-lg">{plan.name}</h3>
          <p className="mt-1 text-2xl font-bold tabular-nums text-navy-900 dark:text-white">{plan.price}</p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{plan.validity}</p>
          {savingsLabel ? (
            <p className="mt-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">{savingsLabel}</p>
          ) : null}
        </div>
        {!plan.isPopular ? (
          <div className="flex flex-wrap gap-1.5" aria-label="Plan badges">
            {plan.isCurrent ? (
              <MembershipBadge label="Current Plan" styleClass={CURRENT_PLAN_BADGE_STYLE} />
            ) : null}
            {plan.isComingSoon ? (
              <MembershipBadge label={LIFETIME_BADGE_LABEL} styleClass={COMING_SOON_BADGE_STYLE} />
            ) : null}
          </div>
        ) : null}
      </div>

      {plan.isPopular ? (
        <div className="mb-3 flex flex-wrap gap-1.5" aria-hidden={plan.isCurrent ? undefined : true}>
          {plan.isCurrent ? (
            <MembershipBadge label="Current Plan" styleClass={CURRENT_PLAN_BADGE_STYLE} />
          ) : null}
        </div>
      ) : null}

      <ul className="mb-5 min-h-0 flex-1 space-y-2" aria-label={`${plan.name} plan features`}>
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <MembershipPrimaryButton disabled={isCtaDisabled}>{getPlanCtaLabel(plan)}</MembershipPrimaryButton>
        {isCtaDisabled ? (
          <span className="sr-only">This plan action is not yet available</span>
        ) : null}
      </div>
    </article>
  );
});

export default MembershipPlanCard;
