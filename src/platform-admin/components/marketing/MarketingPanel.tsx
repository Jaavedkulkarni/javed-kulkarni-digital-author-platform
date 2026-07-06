export function MarketingPanel({
  campaigns,
  coupons,
  banners,
  announcements,
  emailQueue,
  isLoading,
}: {
  campaigns?: { id: string; name: string; status: string }[];
  coupons?: { id: string; code: string; discount: string; status: string }[];
  banners?: { id: string; title: string; placement: string; status: string }[];
  announcements?: { id: string; title: string; status: string }[];
  emailQueue?: { id: string; subject: string; recipients: number; status: string }[];
  isLoading?: boolean;
}) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading marketing...</p>;

  const sections = [
    { title: 'Campaigns', items: campaigns?.map((c) => `${c.name} (${c.status})`) },
    { title: 'Coupons', items: coupons?.map((c) => `${c.code} — ${c.discount}`) },
    { title: 'Banners', items: banners?.map((b) => `${b.title} @ ${b.placement}`) },
    { title: 'Announcements', items: announcements?.map((a) => a.title) },
    { title: 'Email Queue', items: emailQueue?.map((e) => `${e.subject} (${e.recipients} recipients)`) },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sections.map((s) => (
        <div key={s.title} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4">
          <h3 className="text-sm font-medium text-white mb-2">{s.title}</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            {(s.items ?? []).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
