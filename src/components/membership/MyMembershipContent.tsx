/**
 * Membership UI Version 1.0 — Frozen
 * Sprint 05A.2 production polish.
 */
import { useMembership } from '../../hooks/useMembership';
import { MembershipPageHeader } from './MembershipPageHeader';
import { MembershipStatusSection } from './MembershipStatusSection';
import { MembershipPlansSection } from './MembershipPlansSection';
import { MembershipWhySection } from './MembershipWhySection';
import { MembershipBenefitsComparison } from './MembershipBenefitsComparison';
import { MembershipFaq } from './MembershipFaq';

export function MyMembershipContent() {
  const membership = useMembership();

  return (
    <div className="space-y-5 sm:space-y-6">
      <MembershipPageHeader />

      <MembershipStatusSection
        isGuest={membership.isGuest}
        currentPlan={membership.currentPlan}
        status={membership.status}
        expiryDate={membership.expiryDate}
        daysRemaining={membership.daysRemaining}
        daysRemainingValue={membership.daysRemainingValue}
        planDurationDays={membership.planDurationDays}
      />

      <div className="space-y-5 sm:space-y-6">
        <MembershipWhySection />
        <MembershipPlansSection plans={membership.availablePlans} />
      </div>

      <MembershipBenefitsComparison />
      <MembershipFaq />
    </div>
  );
}

export default MyMembershipContent;
