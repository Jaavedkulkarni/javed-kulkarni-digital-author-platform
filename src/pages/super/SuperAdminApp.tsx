import { Navigate, Route, Routes } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useRoles } from '../../context/RoleContext';
import { canAccessPrimarySuperAdminDashboard } from '../../super-admin/security/accessControl';
import { RoleShell } from '../../components/dashboard/RoleShell';
import { SuperAdminProvider } from '../../super-admin/providers';
import { useSuperAdminContext } from '../../super-admin/hooks/useSuperAdminServices';
import { SUPER_ADMIN_NAV } from '../../super-admin/utils/navigation';
import { SUPER_ADMIN_BASE_PATH } from '../../super-admin/constants/superAdmin.constants';
import { useExecutiveDashboard } from '../../super-admin/hooks/useExecutiveDashboard';
import { usePlatformManagement } from '../../super-admin/hooks/usePlatformManagement';
import { useBusiness } from '../../super-admin/hooks/useBusiness';
import { useAnalytics } from '../../super-admin/hooks/useAnalytics';
import { useSecurity } from '../../super-admin/hooks/useSecurity';
import { useMindWaveConfiguration } from '../../super-admin/hooks/useMindWaveConfiguration';
import { useSuperAdminRealtime } from '../../super-admin/hooks/useSuperAdminRealtime';
import {
  ExecutiveOverviewCards,
  RecentActivitiesPanel,
  SystemStatusPanel,
  PeopleManagementPanel,
  PublisherManagementPanel,
  AuthorManagementPanel,
  PlatformAdminManagementPanel,
  BusinessPoliciesPanel,
  PlatformConfigPanel,
  SecurityAuditPanel,
  AnalyticsPanel,
  MindWaveConfigPanel,
} from '../../super-admin/components';
import { usePlatformConfiguration } from '../../super-admin/hooks/usePlatformConfig';

function SuperAdminProtected({ children }: { children: React.ReactNode }) {
  const { roles, profile, loading } = useRoles();
  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!canAccessPrimarySuperAdminDashboard(profile?.email, roles)) {
    return <Navigate to="/auth/login" replace />;
  }
  return <SuperAdminProvider>{children}</SuperAdminProvider>;
}

function SuperAdminShell({ pageTitle, children }: { pageTitle: string; children: React.ReactNode }) {
  const { superAdminContext } = useSuperAdminContext();
  const menuItems = SUPER_ADMIN_NAV.map((item) => ({
    id: item.id,
    label: item.label,
    path: item.path,
    icon: item.icon,
  }));

  return (
    <RoleShell
      title="Super Admin"
      subtitle={superAdminContext?.displayName ?? 'Platform Owner'}
      menuItems={menuItems}
      pageTitle={pageTitle}
      onLogout={async () => { await supabase.auth.signOut(); }}
      logoutRedirect="/"
    >
      {children}
    </RoleShell>
  );
}

function ExecutivePage() {
  useSuperAdminRealtime();
  const { overview, activities, systemStatus, isLoading } = useExecutiveDashboard();
  return (
    <div className="space-y-6">
      <ExecutiveOverviewCards overview={overview} isLoading={isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-navy-700 bg-navy-800/30 p-4">
          <h2 className="text-sm font-medium text-white mb-3">Recent Activities</h2>
          <RecentActivitiesPanel activities={activities} isLoading={isLoading} />
        </div>
        <div className="rounded-lg border border-navy-700 bg-navy-800/30 p-4">
          <h2 className="text-sm font-medium text-white mb-3">System Status</h2>
          <SystemStatusPanel items={systemStatus} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

function PeoplePage() {
  const { people, isLoading, suspendPersonMutation } = usePlatformManagement();
  return <PeopleManagementPanel people={people} isLoading={isLoading} onSuspend={(id) => suspendPersonMutation.mutate(id)} />;
}

function PublishersPage() {
  const { publishers, isLoading, approvePublisherMutation, rejectPublisherMutation } = usePlatformManagement();
  return (
    <PublisherManagementPanel
      publishers={publishers}
      isLoading={isLoading}
      onApprove={(id) => approvePublisherMutation.mutate(id)}
      onReject={(id) => rejectPublisherMutation.mutate(id)}
    />
  );
}

function AuthorsPage() {
  const { authors, isLoading, setAuthorVerificationMutation, suspendAuthorMutation } = usePlatformManagement();
  return (
    <AuthorManagementPanel
      authors={authors}
      isLoading={isLoading}
      onSetPremium={(id) => setAuthorVerificationMutation.mutate({ id, status: 'premium' })}
      onSuspend={(id) => suspendAuthorMutation.mutate(id)}
    />
  );
}

function PlatformAdminsPage() {
  const { platformAdmins, isLoading, deactivateAdminMutation } = usePlatformManagement();
  return <PlatformAdminManagementPanel admins={platformAdmins} isLoading={isLoading} onDeactivate={(id) => deactivateAdminMutation.mutate(id)} />;
}

function BusinessPage() {
  const { policies, isLoading } = useBusiness();
  return <BusinessPoliciesPanel policies={policies} isLoading={isLoading} />;
}

function PlatformPage() {
  const { configs, isLoading } = usePlatformConfiguration();
  return <PlatformConfigPanel configs={configs} isLoading={isLoading} />;
}

function SecurityPage() {
  const { auditLog, sessions, isLoading } = useSecurity();
  return <SecurityAuditPanel auditLog={auditLog} sessions={sessions} isLoading={isLoading} />;
}

function AnalyticsPage() {
  const { snapshot, isLoading } = useAnalytics();
  return <AnalyticsPanel snapshot={snapshot} isLoading={isLoading} />;
}

function MindWavePage() {
  const { config, isLoading, toggleMutation } = useMindWaveConfiguration();
  return <MindWaveConfigPanel config={config} isLoading={isLoading} onToggle={(id, enabled) => toggleMutation.mutate({ id, enabled })} />;
}

export function SuperAdminApp() {
  return (
    <Routes>
      <Route index element={<SuperAdminProtected><SuperAdminShell pageTitle="Executive Dashboard"><ExecutivePage /></SuperAdminShell></SuperAdminProtected>} />
      <Route path="people" element={<SuperAdminProtected><SuperAdminShell pageTitle="People"><PeoplePage /></SuperAdminShell></SuperAdminProtected>} />
      <Route path="publishers" element={<SuperAdminProtected><SuperAdminShell pageTitle="Publishers"><PublishersPage /></SuperAdminShell></SuperAdminProtected>} />
      <Route path="authors" element={<SuperAdminProtected><SuperAdminShell pageTitle="Authors"><AuthorsPage /></SuperAdminShell></SuperAdminProtected>} />
      <Route path="platform-admins" element={<SuperAdminProtected><SuperAdminShell pageTitle="Platform Admins"><PlatformAdminsPage /></SuperAdminShell></SuperAdminProtected>} />
      <Route path="business" element={<SuperAdminProtected><SuperAdminShell pageTitle="Business"><BusinessPage /></SuperAdminShell></SuperAdminProtected>} />
      <Route path="platform" element={<SuperAdminProtected><SuperAdminShell pageTitle="Platform"><PlatformPage /></SuperAdminShell></SuperAdminProtected>} />
      <Route path="security" element={<SuperAdminProtected><SuperAdminShell pageTitle="Security"><SecurityPage /></SuperAdminShell></SuperAdminProtected>} />
      <Route path="analytics" element={<SuperAdminProtected><SuperAdminShell pageTitle="Analytics"><AnalyticsPage /></SuperAdminShell></SuperAdminProtected>} />
      <Route path="mindwave" element={<SuperAdminProtected><SuperAdminShell pageTitle="MindWave AI"><MindWavePage /></SuperAdminShell></SuperAdminProtected>} />
      <Route path="*" element={<Navigate to={SUPER_ADMIN_BASE_PATH} replace />} />
    </Routes>
  );
}

export default SuperAdminApp;
