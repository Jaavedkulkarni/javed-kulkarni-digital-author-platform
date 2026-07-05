import { memo } from 'react';
import { Check, X } from 'lucide-react';
import type { BenefitValue, MembershipPlanId } from './membershipTypes';
import { BENEFIT_COMPARISON_ROWS, MEMBERSHIP_PLANS } from './membershipTypes';

const PLAN_COLUMNS = MEMBERSHIP_PLANS.map((plan) => ({
  id: plan.id,
  label: plan.name,
}));

const BenefitCell = memo(function BenefitCell({ value }: { value: BenefitValue }) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
        <Check className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Included</span>
        <span aria-hidden="true">Yes</span>
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-gray-400 dark:text-gray-500">
        <X className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Not included</span>
        <span aria-hidden="true">—</span>
      </span>
    );
  }

  return <span className="tabular-nums text-navy-900 dark:text-white">{value}</span>;
});

export const MembershipBenefitsComparison = memo(function MembershipBenefitsComparison() {
  return (
    <section aria-label="Membership benefits comparison">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-navy-900 dark:text-white sm:text-lg">Benefits Comparison</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Compare features across all membership tiers.
        </p>
      </div>

      <div
        className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-navy-700 dark:bg-navy-800"
        tabIndex={0}
        role="region"
        aria-label="Scrollable benefits comparison table"
      >
        <table className="min-w-[48rem] w-full border-collapse text-left text-sm">
          <caption className="sr-only">Membership benefits comparison across plans</caption>
          <thead className="sticky top-0 z-20">
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-navy-700 dark:bg-navy-900/50">
              <th
                scope="col"
                className="sticky left-0 z-30 min-w-[10rem] bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] dark:bg-navy-900/50 dark:text-gray-400 dark:shadow-[2px_0_4px_-2px_rgba(0,0,0,0.3)]"
              >
                Benefit
              </th>
              {PLAN_COLUMNS.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className="min-w-[5.5rem] bg-gray-50 px-3 py-3 text-center text-xs font-semibold text-navy-900 dark:bg-navy-900/50 dark:text-white"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BENEFIT_COMPARISON_ROWS.map((row, rowIndex) => {
              const isStriped = rowIndex % 2 !== 0;
              const stickyRowBg = isStriped
                ? 'bg-gray-50/50 dark:bg-navy-900/20'
                : 'bg-white dark:bg-navy-800';

              return (
                <tr
                  key={row.label}
                  className={`border-b border-gray-100 dark:border-navy-700 ${isStriped ? 'bg-gray-50/50 dark:bg-navy-900/20' : ''}`}
                >
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 px-4 py-3 font-medium text-navy-900 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] dark:text-white dark:shadow-[2px_0_4px_-2px_rgba(0,0,0,0.3)] ${stickyRowBg}`}
                  >
                    {row.label}
                  </th>
                  {PLAN_COLUMNS.map((column) => (
                    <td
                      key={`${row.label}-${column.id}`}
                      className="px-3 py-3 text-center text-gray-600 dark:text-gray-300"
                    >
                      <BenefitCell value={row.values[column.id as MembershipPlanId]} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
});

export default MembershipBenefitsComparison;
