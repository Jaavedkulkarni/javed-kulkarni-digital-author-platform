import { Crown } from 'lucide-react';
import { MembershipBrowseLink, MembershipPrimaryButton } from './membershipUi';

export function MembershipGuestState() {
  return (
    <div
      role="status"
      aria-label="Join membership"
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center shadow-sm dark:border-navy-700 dark:bg-navy-800 sm:px-10 sm:py-14"
    >
      <div
        aria-hidden="true"
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 dark:border-navy-600 dark:bg-navy-900/50"
      >
        <Crown className="h-12 w-12 text-gray-300 dark:text-gray-600" />
      </div>
      <h2 className="text-lg font-semibold text-navy-900 dark:text-white sm:text-xl">Join Membership</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        Unlock premium books, exclusive articles, offline reading, and member-only benefits.
      </p>
      <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
        <MembershipPrimaryButton size="lg">Join Membership</MembershipPrimaryButton>
        <MembershipBrowseLink>Browse Books</MembershipBrowseLink>
      </div>
    </div>
  );
}

export default MembershipGuestState;
