import { Navigate, Route, Routes } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useRoles } from '../../context/RoleContext';
import { canAccessPlatformAdmin } from '../../platform-admin/utils/security';
import { RoleShell } from '../../components/dashboard/RoleShell';
import { PlatformAdminProvider } from '../../platform-admin/providers';
import { usePlatformAdminContext } from '../../platform-admin/hooks/usePlatformAdminServices';
import { getNavForDepartments } from '../../platform-admin/utils/navigation';
import { buildPlatformAdminMenu } from '../../platform-admin/components/layout/platformAdminNav';
import { PLATFORM_ADMIN_BASE_PATH } from '../../platform-admin/constants/platformAdmin.constants';
import {
  DashboardOverviewCards,
  PendingTasksPanel,
  RecentActivityPanel,
  DepartmentPerformancePanel,
  ContentReviewPanel,
  PaperbackOperationsPanel,
  FinancePanel,
  SupportPanel,
  MarketingPanel,
  AuthorServicesPanel,
  LegalPanel,
} from '../../platform-admin/components';
import { usePlatformAdminDashboard } from '../../platform-admin/hooks/usePlatformAdminDashboard';
import { useBookReview } from '../../platform-admin/hooks/useBookReview';
import { usePaperbackOperations } from '../../platform-admin/hooks/usePaperbackOperations';
import { useFinance } from '../../platform-admin/hooks/useFinance';
import { useSupport } from '../../platform-admin/hooks/useSupport';
import { useMarketing } from '../../platform-admin/hooks/useMarketing';
import { useAuthorServices } from '../../platform-admin/hooks/useAuthorServices';
import { useLegal } from '../../platform-admin/hooks/useLegal';
import { usePlatformAdminRealtime } from '../../platform-admin/hooks/usePlatformAdminRealtime';
import { hasDepartmentAccess } from '../../platform-admin/utils/permissions';
import type { PlatformAdminDepartment } from '../../platform-admin/types/department.types';

function PlatformAdminProtected({ children }: { children: React.ReactNode }) {
  const { roles, loading } = useRoles();
  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!canAccessPlatformAdmin(roles)) {
    return <Navigate to="/auth/login" replace />;
  }
  return <PlatformAdminProvider>{children}</PlatformAdminProvider>;
}

function DepartmentGuard({ department, children }: { department: PlatformAdminDepartment; children: React.ReactNode }) {
  const { departments } = usePlatformAdminContext();
  if (!hasDepartmentAccess(departments, department)) {
    return <Navigate to={PLATFORM_ADMIN_BASE_PATH} replace />;
  }
  return <>{children}</>;
}

function PlatformAdminShell({ pageTitle, children }: { pageTitle: string; children: React.ReactNode }) {
  const { departments, permissions, adminContext } = usePlatformAdminContext();
  const nav = getNavForDepartments(departments, permissions);
  const menuItems = buildPlatformAdminMenu(nav).map((item) => ({
    id: item.id,
    label: item.label,
    path: item.path,
    icon: item.icon,
    action: undefined as undefined,
  }));

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <RoleShell
      title="Platform Operations"
      subtitle={adminContext?.displayName ?? 'Platform Admin'}
      menuItems={menuItems}
      pageTitle={pageTitle}
      onLogout={handleLogout}
      logoutRedirect="/"
    >
      {children}
    </RoleShell>
  );
}

function DashboardPage() {
  usePlatformAdminRealtime();
  const { overview, pendingTasks, recentActivity, performance, isLoading } = usePlatformAdminDashboard();

  return (
    <div className="space-y-6">
      <DashboardOverviewCards overview={overview} isLoading={isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-navy-700 bg-navy-800/30 p-4">
          <h2 className="text-sm font-medium text-white mb-3">Pending Tasks</h2>
          <PendingTasksPanel tasks={pendingTasks} isLoading={isLoading} />
        </div>
        <div className="rounded-lg border border-navy-700 bg-navy-800/30 p-4">
          <h2 className="text-sm font-medium text-white mb-3">Recent Activity</h2>
          <RecentActivityPanel activity={recentActivity} isLoading={isLoading} />
        </div>
      </div>
      <div className="rounded-lg border border-navy-700 bg-navy-800/30 p-4">
        <h2 className="text-sm font-medium text-white mb-3">Department Performance</h2>
        <DepartmentPerformancePanel performance={performance} isLoading={isLoading} />
      </div>
    </div>
  );
}

function ContentPage() {
  usePlatformAdminRealtime();
  const { books, blogs, isLoading, reviewMutation } = useBookReview();
  return (
    <ContentReviewPanel
      books={books}
      blogs={blogs}
      isLoading={isLoading}
      onReview={(id, decision, type) => reviewMutation.mutate({ id, decision, type })}
    />
  );
}

function PaperbackPage() {
  const { requests, production, isLoading, createRfqMutation, assignMutation } = usePaperbackOperations();
  return (
    <PaperbackOperationsPanel
      requests={requests}
      production={production}
      isLoading={isLoading}
      onCreateRfq={(id) => createRfqMutation.mutate(id)}
      onAssign={(id) => assignMutation.mutate({ requestId: id, publisher: 'PrintCo' })}
    />
  );
}

function FinancePage() {
  const data = useFinance();
  return (
    <FinancePanel
      withdrawals={data.withdrawals}
      refunds={data.refunds}
      pendingSettlements={data.pendingSettlements}
      completedSettlements={data.completedSettlements}
      revenue={data.revenue}
      isLoading={data.isLoading}
      onApproveWithdrawal={(id) => data.approveWithdrawalMutation.mutate(id)}
      onProcessRefund={(id, approved) => data.refundMutation.mutate({ id, approved })}
    />
  );
}

function SupportPage() {
  const { tickets, isLoading, assignMutation } = useSupport();
  return (
    <SupportPanel
      tickets={tickets}
      isLoading={isLoading}
      onAssign={(id) => assignMutation.mutate({ id, assignee: 'Current Agent' })}
    />
  );
}

function MarketingPage() {
  const data = useMarketing();
  return (
    <MarketingPanel
      campaigns={data.campaigns}
      coupons={data.coupons}
      banners={data.banners}
      announcements={data.announcements}
      emailQueue={data.emailQueue}
      isLoading={data.isLoading}
    />
  );
}

function AuthorServicesPage() {
  const { queue, isLoading, assignMutation } = useAuthorServices();
  return <AuthorServicesPanel queue={queue} isLoading={isLoading} onAssign={(id) => assignMutation.mutate(id)} />;
}

function LegalPage() {
  const data = useLegal();
  return (
    <LegalPanel
      copyrightClaims={data.copyrightClaims}
      dmca={data.dmca}
      contracts={data.contracts}
      violations={data.violations}
      disputes={data.disputes}
      isLoading={data.isLoading}
    />
  );
}

export function PlatformAdminApp() {
  return (
    <Routes>
      <Route
        index
        element={
          <PlatformAdminProtected>
            <PlatformAdminShell pageTitle="Dashboard">
              <DashboardPage />
            </PlatformAdminShell>
          </PlatformAdminProtected>
        }
      />
      <Route
        path="content"
        element={
          <PlatformAdminProtected>
            <DepartmentGuard department="content">
              <PlatformAdminShell pageTitle="Content">
                <ContentPage />
              </PlatformAdminShell>
            </DepartmentGuard>
          </PlatformAdminProtected>
        }
      />
      <Route
        path="paperback"
        element={
          <PlatformAdminProtected>
            <DepartmentGuard department="paperback">
              <PlatformAdminShell pageTitle="Paperback">
                <PaperbackPage />
              </PlatformAdminShell>
            </DepartmentGuard>
          </PlatformAdminProtected>
        }
      />
      <Route
        path="finance"
        element={
          <PlatformAdminProtected>
            <DepartmentGuard department="finance">
              <PlatformAdminShell pageTitle="Finance">
                <FinancePage />
              </PlatformAdminShell>
            </DepartmentGuard>
          </PlatformAdminProtected>
        }
      />
      <Route
        path="support"
        element={
          <PlatformAdminProtected>
            <DepartmentGuard department="support">
              <PlatformAdminShell pageTitle="Support">
                <SupportPage />
              </PlatformAdminShell>
            </DepartmentGuard>
          </PlatformAdminProtected>
        }
      />
      <Route
        path="marketing"
        element={
          <PlatformAdminProtected>
            <DepartmentGuard department="marketing">
              <PlatformAdminShell pageTitle="Marketing">
                <MarketingPage />
              </PlatformAdminShell>
            </DepartmentGuard>
          </PlatformAdminProtected>
        }
      />
      <Route
        path="author-services"
        element={
          <PlatformAdminProtected>
            <DepartmentGuard department="author_services">
              <PlatformAdminShell pageTitle="Author Services">
                <AuthorServicesPage />
              </PlatformAdminShell>
            </DepartmentGuard>
          </PlatformAdminProtected>
        }
      />
      <Route
        path="legal"
        element={
          <PlatformAdminProtected>
            <DepartmentGuard department="legal">
              <PlatformAdminShell pageTitle="Legal">
                <LegalPage />
              </PlatformAdminShell>
            </DepartmentGuard>
          </PlatformAdminProtected>
        }
      />
      <Route path="*" element={<Navigate to={PLATFORM_ADMIN_BASE_PATH} replace />} />
    </Routes>
  );
}

export default PlatformAdminApp;
