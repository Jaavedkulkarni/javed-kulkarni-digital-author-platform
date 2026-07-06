import type { PublisherCompanyProfile } from '../../types/company.types';

interface CompanyProfilePanelProps {
  profile: PublisherCompanyProfile | null | undefined;
  isLoading?: boolean;
}

export function CompanyProfilePanel({ profile, isLoading }: CompanyProfilePanelProps) {
  if (isLoading) return <div className="text-sm text-gray-400">Loading company profile...</div>;
  if (!profile) return null;

  return (
    <div className="rounded-lg border border-navy-700 bg-navy-800/50 p-4 space-y-3">
      <h3 className="text-sm font-medium text-white">Company Profile</h3>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-gray-400">Company</p>
          <p className="text-white">{profile.companyName}</p>
        </div>
        <div>
          <p className="text-gray-400">GSTIN</p>
          <p className="text-white">{profile.gstin ?? '—'}</p>
        </div>
        <div>
          <p className="text-gray-400">PAN</p>
          <p className="text-white">{profile.pan ?? '—'}</p>
        </div>
        <div>
          <p className="text-gray-400">Capacity / month</p>
          <p className="text-white">{profile.printingCapacity.maxBooksPerMonth} books</p>
        </div>
      </div>
      {profile.printingMachines.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Machines</p>
          <p className="text-xs text-gray-300">{profile.printingMachines.join(', ')}</p>
        </div>
      )}
      {profile.specializations.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Specializations</p>
          <p className="text-xs text-gray-300">{profile.specializations.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
