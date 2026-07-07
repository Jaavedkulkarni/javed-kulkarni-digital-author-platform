import * as XLSX from 'xlsx';
import type { ImportExportFormat } from '../import-export.types';

export function parseImportFile(file: File): Promise<Record<string, unknown>[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension === 'csv') return parseCsvFile(file);
  if (extension === 'xlsx' || extension === 'xls') return parseExcelFile(file);
  throw new Error('Unsupported file format. Use CSV or Excel (.xlsx).');
}

async function parseCsvFile(file: File): Promise<Record<string, unknown>[]> {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) throw new Error('CSV file must include a header row and at least one data row');
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() ?? '';
    });
    return row;
  });
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  result.push(current);
  return result;
}

async function parseExcelFile(file: File): Promise<Record<string, unknown>[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error('Excel file has no worksheets');
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
}

export function downloadTemplate(format: 'csv' | 'xlsx'): void {
  const headers = ['email', 'firstName', 'lastName', 'phone', 'role', 'status', 'country', 'timezone'];
  const sample = [
    'user@example.com',
    'Jane',
    'Doe',
    '+919876543210',
    'reader',
    'pending',
    'India',
    'Asia/Kolkata',
  ];

  if (format === 'csv') {
    const csv = [headers.join(','), sample.join(',')].join('\n');
    downloadBlob(csv, 'people-import-template.csv', 'text/csv;charset=utf-8;');
    return;
  }

  const worksheet = XLSX.utils.aoa_to_sheet([headers, sample]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
  XLSX.writeFile(workbook, 'people-import-template.xlsx');
}

export function downloadExportFile(
  format: ImportExportFormat,
  columns: string[],
  rows: Record<string, unknown>[],
  filenamePrefix = 'people-export',
): void {
  const filteredRows = rows.map((row) => {
    const entry: Record<string, unknown> = {};
    columns.forEach((column) => {
      entry[column] = row[column] ?? '';
    });
    return entry;
  });

  if (format === 'csv') {
    const header = columns.join(',');
    const body = filteredRows
      .map((row) => columns.map((col) => escapeCsv(String(row[col] ?? ''))).join(','))
      .join('\n');
    downloadBlob(`${header}\n${body}`, `${filenamePrefix}.csv`, 'text/csv;charset=utf-8;');
    return;
  }

  if (format === 'xlsx') {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows, { header: columns });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'People');
    XLSX.writeFile(workbook, `${filenamePrefix}.xlsx`);
    return;
  }

  void exportPdf(columns, filteredRows, filenamePrefix);
}

async function exportPdf(
  columns: string[],
  rows: Record<string, unknown>[],
  filenamePrefix: string,
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;
  const doc = new jsPDF({ orientation: 'landscape' });
  autoTable(doc, {
    head: [columns],
    body: rows.map((row) => columns.map((col) => String(row[col] ?? ''))),
    styles: { fontSize: 8 },
  });
  doc.save(`${filenamePrefix}.pdf`);
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function guessColumnMapping(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  const normalized = headers.map((h) => h.trim());
  const aliases: Record<string, string[]> = {
    email: ['email', 'e-mail', 'email address'],
    firstName: ['firstname', 'first name', 'first_name'],
    lastName: ['lastname', 'last name', 'last_name'],
    phone: ['phone', 'mobile', 'phone number'],
    role: ['role', 'primary role', 'primary_role'],
    status: ['status', 'account status'],
    country: ['country'],
    timezone: ['timezone', 'time zone'],
  };

  for (const [target, options] of Object.entries(aliases)) {
    const match = normalized.find((header) =>
      options.includes(header.toLowerCase()) || header.toLowerCase() === target.toLowerCase(),
    );
    if (match) mapping[target] = match;
  }

  return mapping;
}
