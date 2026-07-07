import { memo } from 'react';
import {
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from 'lucide-react';
import type { PeopleStatistics } from '../types/people.types';

interface PeopleStatsProps {
  stats?: PeopleStatistics;
  isLoading?: boolean;
  isError?: boolean;
}

function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-navy-700 bg-navy-800/50 p-4">
      <div className="h-3 w-24 rounded bg-navy-700" />
      <div className="mt-3 h-8 w-16 rounded bg-navy-700" />
    </div>
  );
}

const StatCard = memo(function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Users;
}) {
  return (
    <article
      className="rounded-xl border border-navy-700 bg-navy-800/50 p-4 transition-colors hover:border-gold-500/30"
      aria-label={`${label}: ${value.toLocaleString()}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
        <Icon className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-white">{value.toLocaleString()}</p>
    </article>
  );
});

export const PeopleStats = memo(function PeopleStats({ stats, isLoading, isError }: PeopleStatsProps) {
  if (isError) {
    return (
      <section
        aria-label="People statistics"
        className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
      >
        Unable to load statistics.
      </section>
    );
  }

  return (
    <section aria-label="People statistics">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {isLoading || !stats ? (
          Array.from({ length: 6 }).map((_, index) => <StatCardSkeleton key={index} />)
        ) : (
          <>
            <StatCard label="Total Users" value={stats.totalUsers} icon={Users} />
            <StatCard label="Active Users" value={stats.activeUsers} icon={UserCheck} />
            <StatCard label="Suspended Users" value={stats.suspendedUsers} icon={UserX} />
            <StatCard label="Pending Users" value={stats.pendingUsers} icon={UserPlus} />
            <StatCard label="Verified Users" value={stats.verifiedUsers} icon={ShieldCheck} />
            <StatCard label="New Users (30 Days)" value={stats.newUsers30Days} icon={UserPlus} />
          </>
        )}
      </div>
    </section>
  );
});

export default PeopleStats;
