import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Upload,
  FolderOpen,
  X,
  Copy,
  Check,
  Search,
  FileText,
  ZoomIn,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { getAcceptString, detectMediaKind, type MediaKind } from '../../config/media';
import {
  deleteMediaAsset,
  filterMediaAssets,
  formatMediaSize,
  isImageAsset,
  isPdfAsset,
  listMediaAssets,
  uploadMediaFile,
  type MediaAsset,
} from '../../lib/mediaService';

type PreviewAspect = 'book' | 'video' | 'square';

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  acceptKinds?: MediaKind[];
  uploadFolder?: string;
  previewAspect?: PreviewAspect;
  emptyLabel?: string;
}

const aspectClasses: Record<PreviewAspect, string> = {
  book: 'aspect-[2/3]',
  video: 'aspect-video',
  square: 'aspect-square',
};

export function MediaPicker({
  value,
  onChange,
  acceptKinds = ['image'],
  uploadFolder,
  previewAspect = 'video',
  emptyLabel = 'Upload or choose from Media Library',
}: MediaPickerProps) {
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const detected = detectMediaKind(file.type, file.name);
      if (!detected || !acceptKinds.includes(detected)) {
        throw new Error('Unsupported file type for this field.');
      }
      const asset = await uploadMediaFile(file, { folder: uploadFolder, kind: detected });
      onChange(asset.publicUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-navy-700 border border-navy-600 text-gray-300 text-sm font-medium hover:text-white hover:border-navy-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <div className="w-4 h-4 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-navy-700 border border-navy-600 text-gray-300 text-sm font-medium hover:text-white hover:border-navy-500 transition-colors"
        >
          <FolderOpen className="w-4 h-4" />
          Choose from Media Library
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptString(acceptKinds)}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = '';
          }}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}

      {value ? (
        <input
          type="text"
          readOnly
          value={value}
          className="w-full px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-gray-400 text-xs font-mono cursor-default focus:outline-none"
          aria-label="Selected media URL"
        />
      ) : (
        <p className="text-xs text-gray-500">{emptyLabel}</p>
      )}

      {value ? (
        <div
          className={`relative rounded-lg overflow-hidden bg-navy-700 border border-navy-600 ${aspectClasses[previewAspect]}`}
        >
          <MediaPreview url={value} alt="Selected media" className="w-full h-full" contain />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            title="Remove"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          className={`rounded-lg bg-navy-700 border border-dashed border-navy-600 flex items-center justify-center text-gray-500 text-xs ${aspectClasses[previewAspect]}`}
        >
          Preview
        </div>
      )}

      {pickerOpen && (
        <MediaPickerModal
          acceptKinds={acceptKinds}
          onSelect={(asset) => {
            onChange(asset.publicUrl);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

function MediaPickerModal({
  acceptKinds,
  onSelect,
  onClose,
}: {
  acceptKinds: MediaKind[];
  onSelect: (asset: MediaAsset) => void;
  onClose: () => void;
}) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<MediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    try {
      setAssets(await listMediaAssets());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const displayed = filterMediaAssets(assets, search, acceptKinds);

  const copyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.publicUrl).catch(() => {});
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!confirm(`"${asset.path}" हटवायचे आहे का?`)) return;
    setDeletingId(asset.id);
    try {
      await deleteMediaAsset(asset.path);
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      if (preview?.id === asset.id) setPreview(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-navy-800 border border-navy-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-navy-700 flex-shrink-0">
          <h2 className="text-white font-semibold flex-1">Media Library</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-navy-700 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 min-h-0">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-navy-700 animate-pulse" />
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <p className="text-center text-gray-500 py-16">No matching media files.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {displayed.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => onSelect(asset)}
                  className="group relative rounded-xl overflow-hidden aspect-square bg-navy-900 border border-navy-700 hover:border-gold-500/50 transition-colors text-left"
                >
                  <AssetThumbnail asset={asset} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs truncate">{asset.name}</p>
                  </div>
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MiniAction
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreview(asset);
                      }}
                      title="Preview"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </MiniAction>
                    <MiniAction
                      onClick={(e) => {
                        e.stopPropagation();
                        copyUrl(asset);
                      }}
                      title="Copy URL"
                    >
                      {copiedId === asset.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </MiniAction>
                    <MiniAction
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(asset);
                      }}
                      title="Delete"
                      danger
                    >
                      <Trash2 className="w-3 h-3" />
                    </MiniAction>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {preview && (
        <AssetPreviewModal
          asset={preview}
          copied={copiedId === preview.id}
          deleting={deletingId === preview.id}
          onCopy={() => copyUrl(preview)}
          onDelete={() => handleDelete(preview)}
          onSelect={() => {
            onSelect(preview);
            onClose();
          }}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}

function AssetPreviewModal({
  asset,
  copied,
  deleting,
  onCopy,
  onDelete,
  onSelect,
  onClose,
}: {
  asset: MediaAsset;
  copied: boolean;
  deleting: boolean;
  onCopy: () => void;
  onDelete: () => void;
  onSelect: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-navy-800 border border-navy-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-navy-700">
          <p className="text-white font-semibold truncate flex-1">{asset.path}</p>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 min-h-0 bg-[#0a0d14] flex items-center justify-center p-6">
          <MediaPreview url={asset.publicUrl} alt={asset.name} className="max-w-full max-h-[50vh]" contain />
        </div>
        <div className="px-5 py-4 border-t border-navy-700 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSelect}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold-500 text-navy-900 text-sm font-semibold"
          >
            Select
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-gray-300 text-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            Copy URL
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-sm disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function AssetThumbnail({ asset }: { asset: MediaAsset }) {
  if (isImageAsset(asset)) {
    return (
      <img src={asset.publicUrl} alt={asset.name} className="w-full h-full object-cover" loading="lazy" />
    );
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-navy-900">
      <FileText className="w-8 h-8 text-navy-500" />
      <span className="text-[10px] uppercase text-navy-500 font-mono">{asset.kind}</span>
    </div>
  );
}

export function MediaPreview({
  url,
  alt,
  className = '',
  contain = false,
}: {
  url: string;
  alt: string;
  className?: string;
  contain?: boolean;
}) {
  const lower = url.toLowerCase();
  const isPdf = lower.endsWith('.pdf') || lower.includes('.pdf?');

  if (isPdf) {
    return (
      <iframe
        src={url}
        title={alt}
        className={`${className} bg-white rounded`}
      />
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={`${className} ${contain ? 'object-contain bg-white p-2' : 'object-cover'}`}
    />
  );
}

function MiniAction({
  onClick,
  title,
  children,
  danger,
}: {
  onClick: (e: React.MouseEvent) => void;
  title: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1 rounded-md bg-black/60 text-white hover:bg-black/80 ${
        danger ? 'hover:text-red-300' : ''
      }`}
    >
      {children}
    </button>
  );
}

export default MediaPicker;
