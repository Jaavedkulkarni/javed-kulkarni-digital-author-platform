export function LegalPanel({
  copyrightClaims,
  dmca,
  contracts,
  violations,
  disputes,
  isLoading,
}: {
  copyrightClaims?: { id: string; claimNumber: string; contentTitle: string; status: string }[];
  dmca?: { id: string; referenceNumber: string; contentTitle: string; status: string }[];
  contracts?: { id: string; partyName: string; contractType: string; status: string }[];
  violations?: { id: string; entityName: string; violationType: string; status: string }[];
  disputes?: { id: string; disputeNumber: string; parties: string; status: string }[];
  isLoading?: boolean;
}) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading legal...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { title: 'Copyright Claims', data: copyrightClaims, render: (c: { claimNumber: string; contentTitle: string }) => `${c.claimNumber} — ${c.contentTitle}` },
        { title: 'DMCA Requests', data: dmca, render: (d: { referenceNumber: string; contentTitle: string }) => `${d.referenceNumber} — ${d.contentTitle}` },
        { title: 'Contracts', data: contracts, render: (c: { partyName: string; contractType: string }) => `${c.partyName} (${c.contractType})` },
        { title: 'Policy Violations', data: violations, render: (v: { entityName: string; violationType: string }) => v.entityName },
        { title: 'Disputes', data: disputes, render: (d: { disputeNumber: string; parties: string }) => `${d.disputeNumber} — ${d.parties}` },
      ].map((section) => (
        <div key={section.title} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4">
          <h3 className="text-sm font-medium text-white mb-2">{section.title}</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            {(section.data ?? []).map((item) => (
              <li key={item.id}>{section.render(item as never)}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
