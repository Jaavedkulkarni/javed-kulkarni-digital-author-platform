import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AdminLayout } from './AdminLayout';
import { supabase } from '../../lib/supabase';
import {
  Upload,
  Search,
  X,
  Copy,
  Trash2,
  Check,
  AlertCircle,
  ZoomIn,
  FileText,
  ImageOff,
  HardDrive,
  SlidersHorizontal,
} from 'lucide-react';
import { format } from 'date-fns';

// ─── Constants ───────────────────────────────────────────────────────────────

const BUCKET = 'media';

// ─── Types ───────────────────────────────────────────────────────────────────

interface MediaFile {
  name: string;
  id: string;
  created_at: string;
  updated_at: string;
  size: number;
  mimetype: string;
  publicUrl: string;
}

interface UploadItem {
  uid: string;
  filename: string;
  done: boolean;
  error?: string;
}

type SortMode = 'newest' | 'oldest' | 'name' | 'size';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isImage(mime: string) {
  return mime?.startsWith('image/');
}

function fmtSize(bytes: number) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

function sanitizeFilename(name: string) {
  const ext = name.split('.').pop() ?? '';
  const base = name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .slice(0, 50);
  return `${Date.now()}_${base}.${ext}`;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortMode>('newest');
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // ── Load files ──────────────────────────────────────────────────────────────

  const loadFiles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from(BUCKET).list('', {
      limit: 1000,
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (!error && data) {
      const mapped: MediaFile[] = data
        .filter((f) => f.name !== '.emptyFolderPlaceholder' && f.name !== '')
        .map((f) => {
          const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(f.name);
          return {
            name: f.name,
            id: f.id ?? f.name,
            created_at: f.created_at ?? new Date().toISOString(),
            updated_at: f.updated_at ?? new Date().toISOString(),
            size: (f.metadata as any)?.size ?? 0,
            mimetype: (f.metadata as any)?.mimetype ?? '',
            publicUrl: urlData.publicUrl,
          };
        });
      setFiles(mapped);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  // ── Drag and drop ───────────────────────────────────────────────────────────

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.items.length > 0) setDragOver(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current <= 0) { dragCounter.current = 0; setDragOver(false); }
  };
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (dropped.length) uploadFiles(dropped);
  };

  // ── Upload ──────────────────────────────────────────────────────────────────

  const uploadFiles = async (filesToUpload: File[]) => {
    const batch: UploadItem[] = filesToUpload.map((f) => ({
      uid: `${Date.now()}-${Math.random()}`,
      filename: f.name,
      done: false,
    }));
    setUploads((prev) => [...prev, ...batch]);

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const uid = batch[i].uid;
      const path = sanitizeFilename(file.name);

      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

      setUploads((prev) =>
        prev.map((u) => u.uid === uid ? { ...u, done: true, error: error?.message } : u)
      );
    }

    await loadFiles();

    setTimeout(() => {
      setUploads((prev) => prev.filter((u) => !!u.error));
      setTimeout(() => setUploads([]), 3000);
    }, 1200);
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      uploadFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`"${file.name}" हटवायचे आहे का? हे पूर्वत होणार नाही.`)) return;
    setDeletingId(file.id);
    const { error } = await supabase.storage.from(BUCKET).remove([file.name]);
    if (!error) {
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      if (preview?.id === file.id) setPreview(null);
    }
    setDeletingId(null);
  };

  // ── Copy URL ────────────────────────────────────────────────────────────────

  const copyUrl = (file: MediaFile) => {
    navigator.clipboard.writeText(file.publicUrl).catch(() => {});
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  // ── Filter + sort ───────────────────────────────────────────────────────────

  const displayed = files
    .filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sort === 'size') return b.size - a.size;
      return a.name.localeCompare(b.name);
    });

  const totalSize = files.reduce((s, f) => s + f.size, 0);
  const imageCount = files.filter((f) => isImage(f.mimetype)).length;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <AdminLayout title="Media Library">
      <div
        className="relative"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {/* ── Drag overlay ──────────────────────────────────────────────── */}
        {dragOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/85 backdrop-blur-sm pointer-events-none">
            <div className="flex flex-col items-center gap-5 pointer-events-none">
              <div className="w-24 h-24 rounded-3xl bg-gold-500/15 border-2 border-gold-400 border-dashed flex items-center justify-center animate-pulse">
                <Upload className="w-10 h-10 text-gold-400" />
              </div>
              <p className="text-2xl font-bold text-white">Files सोडा</p>
              <p className="text-gray-400">Images येथे drop करा</p>
            </div>
          </div>
        )}

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Media Library</h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-gray-500 text-sm flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5" />
                {fmtSize(totalSize)}
              </span>
              <span className="text-gray-600 text-xs">·</span>
              <span className="text-gray-500 text-sm">{imageCount} images · {files.length} files</span>
            </div>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-sm rounded-lg transition-colors shadow-lg shadow-gold-500/20 flex-shrink-0"
          >
            <Upload className="w-4 h-4" />
            Upload Images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={onFileInput}
            className="hidden"
          />
        </div>

        {/* ── Filters ───────────────────────────────────────────────────── */}
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filename शोधा..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm focus:border-gold-400 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A–Z</option>
              <option value="size">Largest First</option>
            </select>
          </div>
        </div>

        {/* ── Upload progress ────────────────────────────────────────────── */}
        {uploads.length > 0 && (
          <div className="mb-5 space-y-2">
            {uploads.map((u) => (
              <div
                key={u.uid}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm border ${
                  u.error
                    ? 'bg-red-500/8 border-red-500/20 text-red-400'
                    : u.done
                    ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400'
                    : 'bg-navy-800 border-navy-700 text-gray-300'
                }`}
              >
                {u.error ? (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                ) : u.done ? (
                  <Check className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gold-400 border-t-transparent animate-spin flex-shrink-0" />
                )}
                <span className="flex-1 truncate font-mono text-xs">{u.filename}</span>
                {u.error && <span className="text-xs opacity-80 flex-shrink-0">{u.error}</span>}
              </div>
            ))}
          </div>
        )}

        {/* ── Drop hint ─────────────────────────────────────────────────── */}
        {files.length === 0 && !loading && (
          <DropZoneHint onUpload={() => fileInputRef.current?.click()} />
        )}

        {/* ── Loading skeleton ───────────────────────────────────────────── */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-navy-800 animate-pulse" />
            ))}
          </div>
        )}

        {/* ── Empty search result ────────────────────────────────────────── */}
        {!loading && files.length > 0 && displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ImageOff className="w-12 h-12 text-navy-600 mb-4" />
            <p className="text-gray-400 font-medium">"{search}" साठी कोणताही file सापडला नाही.</p>
            <button
              onClick={() => setSearch('')}
              className="mt-3 text-sm text-gold-400 hover:text-gold-300 transition-colors"
            >
              शोध साफ करा
            </button>
          </div>
        )}

        {/* ── File grid ─────────────────────────────────────────────────── */}
        {!loading && displayed.length > 0 && (
          <>
            <p className="text-xs text-gray-600 mb-3 tabular-nums">
              {displayed.length} {displayed.length !== files.length ? `of ${files.length}` : ''} files
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {displayed.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  copied={copiedId === file.id}
                  deleting={deletingId === file.id}
                  onPreview={() => setPreview(file)}
                  onCopy={() => copyUrl(file)}
                  onDelete={() => handleDelete(file)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Preview modal ──────────────────────────────────────────────────── */}
      {preview && (
        <PreviewModal
          file={preview}
          copied={copiedId === preview.id}
          deleting={deletingId === preview.id}
          onCopy={() => copyUrl(preview)}
          onDelete={() => handleDelete(preview)}
          onClose={() => setPreview(null)}
        />
      )}
    </AdminLayout>
  );
}

// ─── File Card ───────────────────────────────────────────────────────────────

function FileCard({
  file,
  copied,
  deleting,
  onPreview,
  onCopy,
  onDelete,
}: {
  file: MediaFile;
  copied: boolean;
  deleting: boolean;
  onPreview: () => void;
  onCopy: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`group relative rounded-xl overflow-hidden aspect-square bg-navy-800 border border-navy-700 hover:border-navy-500 transition-all duration-200 cursor-pointer ${
        deleting ? 'opacity-40 pointer-events-none' : ''
      }`}
    >
      {/* Thumbnail */}
      {isImage(file.mimetype) ? (
        <img
          src={file.publicUrl}
          alt={file.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-navy-750">
          <FileText className="w-10 h-10 text-navy-500" />
          <span className="text-xs text-navy-500 uppercase font-mono">
            {file.name.split('.').pop()}
          </span>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2">
        {/* Action buttons */}
        <div className="flex justify-end gap-1">
          <ActionBtn onClick={onPreview} title="Preview">
            <ZoomIn className="w-3.5 h-3.5" />
          </ActionBtn>
          <ActionBtn onClick={onCopy} title={copied ? 'Copied!' : 'Copy URL'} active={copied}>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </ActionBtn>
          <ActionBtn onClick={onDelete} title="Delete" danger>
            <Trash2 className="w-3.5 h-3.5" />
          </ActionBtn>
        </div>
        {/* Filename */}
        <div className="mt-auto">
          <p className="text-white text-xs font-medium truncate leading-tight">{file.name}</p>
          <p className="text-gray-400 text-xs mt-0.5">{fmtSize(file.size)}</p>
        </div>
      </div>

      {/* Copied flash */}
      {copied && (
        <div className="absolute inset-0 border-2 border-emerald-400 rounded-xl pointer-events-none transition-opacity" />
      )}
    </div>
  );
}

function ActionBtn({
  onClick,
  title,
  children,
  active,
  danger,
}: {
  onClick: (e: React.MouseEvent) => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={(e) => { e.stopPropagation(); onClick(e); }}
      className={`p-1.5 rounded-lg transition-colors ${
        active
          ? 'bg-emerald-500/20 text-emerald-400'
          : danger
          ? 'bg-white/10 text-white hover:bg-red-500/40 hover:text-red-200'
          : 'bg-white/10 text-white hover:bg-white/25'
      }`}
    >
      {children}
    </button>
  );
}

// ─── Preview Modal ───────────────────────────────────────────────────────────

function PreviewModal({
  file,
  copied,
  deleting,
  onCopy,
  onDelete,
  onClose,
}: {
  file: MediaFile;
  copied: boolean;
  deleting: boolean;
  onCopy: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-3xl bg-navy-800 border border-navy-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-navy-700 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold truncate">{file.name}</p>
            <p className="text-gray-500 text-xs mt-0.5 font-mono">{file.mimetype || '—'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-700 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image area */}
        <div className="flex-1 overflow-hidden bg-[#0a0d14] flex items-center justify-center min-h-0 p-6">
          {isImage(file.mimetype) ? (
            <img
              src={file.publicUrl}
              alt={file.name}
              className="max-w-full max-h-full object-contain rounded-lg"
              style={{ maxHeight: '55vh' }}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 py-16">
              <FileText className="w-20 h-20 text-navy-600" />
              <p className="text-gray-500 text-sm">Preview उपलब्ध नाही</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-navy-700 space-y-4 flex-shrink-0">
          {/* Metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetaItem label="File Size" value={fmtSize(file.size)} />
            <MetaItem label="Type" value={file.mimetype?.split('/')[1]?.toUpperCase() || '—'} />
            <MetaItem
              label="Uploaded"
              value={file.created_at ? format(new Date(file.created_at), 'd MMM yyyy') : '—'}
            />
            <MetaItem
              label="Modified"
              value={file.updated_at ? format(new Date(file.updated_at), 'd MMM yyyy') : '—'}
            />
          </div>

          {/* URL row */}
          <div className="flex gap-2">
            <div className="flex-1 relative min-w-0">
              <input
                readOnly
                value={file.publicUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="w-full px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-gray-300 text-xs font-mono truncate focus:outline-none focus:border-gold-400 cursor-text"
              />
            </div>
            <button
              onClick={onCopy}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                copied
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-navy-700 border border-navy-600 text-gray-300 hover:text-white hover:border-navy-500'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy URL'}
            </button>
            <button
              onClick={onDelete}
              disabled={deleting}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Drop Zone (empty state) ─────────────────────────────────────────────────

function DropZoneHint({ onUpload }: { onUpload: () => void }) {
  return (
    <div
      onClick={onUpload}
      className="group flex flex-col items-center justify-center min-h-96 rounded-2xl border-2 border-dashed border-navy-600 hover:border-gold-500/50 bg-navy-800/30 hover:bg-navy-800/60 transition-all cursor-pointer"
    >
      <div className="w-20 h-20 rounded-2xl bg-navy-800 border border-navy-700 group-hover:border-gold-500/30 flex items-center justify-center mb-5 transition-colors">
        <Upload className="w-9 h-9 text-navy-500 group-hover:text-gold-400 transition-colors" />
      </div>
      <p className="text-white font-semibold text-lg mb-2">Images Upload करा</p>
      <p className="text-gray-500 text-sm text-center max-w-xs">
        Files येथे Drag & Drop करा किंवा क्लिक करून निवडा
      </p>
      <p className="text-gray-600 text-xs mt-3">JPG, PNG, GIF, WebP, SVG, AVIF</p>
    </div>
  );
}

// ─── MetaItem ────────────────────────────────────────────────────────────────

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-white font-medium truncate">{value}</p>
    </div>
  );
}

export default MediaLibrary;
