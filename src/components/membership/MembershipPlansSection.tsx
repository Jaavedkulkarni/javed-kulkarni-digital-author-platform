import { memo } from 'react';
import type { MembershipPlanDefinition } from './membershipTypes';
import { MembershipPlanCard } from './MembershipPlanCard';

interface MembershipPlansSectionProps {
  plans: MembershipPlanDefinition[];
}

export const MembershipPlansSection = memo(function MembershipPlansSection({
  plans,
}: MembershipPlansSectionProps) {
  return (
    <section aria-label="Membership plans">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-navy-900 dark:text-white sm:text-lg">Membership Plans</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose a plan that fits your reading journey.
        </p>
      </div>

      <div
        role="list"
        aria-label="Available membership plans"
        className="grid grid-cols-1 items-stretch gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        {plans.map((plan) => (
          <div key={plan.id} role="listitem" className="flex h-full min-h-0">
            <MembershipPlanCard plan={plan} />
          </div>
        ))}
      </div>
    </section>
  );
});

export default MembershipPlansSection;
