import { memo } from 'react';

interface PermissionSkeletonProps {
  rows?: number;
  className?: string;
}

export const PermissionSkeleton = memo(function PermissionSkeleton({
  rows = 3,
  className,
}: PermissionSkeletonProps) {
  return (
    <div className={`animate-pulse space-y-3 ${className ?? ''}`} aria-hidden>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-10 rounded-lg bg-navy-700/60" />
      ))}
      <span className="sr-only">Loading permissions…</span>
    </div>
  );
});

export default PermissionSkeleton;
