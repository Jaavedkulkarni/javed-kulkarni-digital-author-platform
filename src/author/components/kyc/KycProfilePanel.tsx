import type { KycTaxProfile } from '../../types/kyc.types';

interface KycProfilePanelProps {
  profile: KycTaxProfile | null | undefined;
}

export function KycProfilePanel({ profile }: KycProfilePanelProps) {
  if (!profile) return null;

  const statusColors: Record<string, string> = {
    unverified: 'text-gray-400',
    pending: 'text-amber-400',
    verified: 'text-green-400',
    rejected: 'text-red-400',
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gold-400">KYC & Tax Profile</h3>
      <p className={`text-xs capitalize ${statusColors[profile.verificationStatus] ?? 'text-gray-400'}`}>
        Status: {profile.verificationStatus}
      </p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div><span className="text-gray-400">PAN:</span> <span className="text-white">{profile.pan ?? '—'}</span></div>
        <div><span className="text-gray-400">GSTIN:</span> <span className="text-white">{profile.gstin ?? '—'}</span></div>
        <div><span className="text-gray-400">Bank:</span> <span className="text-white">{profile.bank?.bankName ?? '—'}</span></div>
        <div><span className="text-gray-400">UPI:</span> <span className="text-white">{profile.upi?.upiId ?? '—'}</span></div>
      </div>
    </div>
  );
}
