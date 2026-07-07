export function exportBulkResultsToCsv(
  results: Array<{
    userId: string;
    email?: string | null;
    name?: string | null;
    status: string;
    reason?: string;
  }>,
  operation: string,
): void {
  const header = ['User ID', 'Name', 'Email', 'Status', 'Reason'];
  const lines = [
    header.join(','),
    ...results.map((row) =>
      [
        row.userId,
        escapeCsv(row.name ?? ''),
        escapeCsv(row.email ?? ''),
        row.status,
        escapeCsv(row.reason ?? ''),
      ].join(','),
    ),
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bulk-${operation}-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
