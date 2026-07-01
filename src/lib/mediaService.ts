import {
  MEDIA_LIST_PREFIXES,
  MEDIA_STORAGE_BUCKET,
  detectMediaKind,
  getUploadFolder,
  isKindEnabled,
  type MediaKind,
} from '../config/media';
import { supabase } from './supabase';

export interface MediaAsset {
  id: string;
  name: string;
  path: string;
  created_at: string;
  updated_at: string;
  size: number;
  mimetype: string;
  publicUrl: string;
  kind: MediaKind;
}

function sanitizeFilename(name: string) {
  const ext = name.split('.').pop() ?? 'bin';
  const base = name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .slice(0, 50);
  return `${Date.now()}_${base}.${ext}`;
}

function storagePath(folder: string, filename: string) {
  return folder ? `${folder}/${filename}` : filename;
}

function mapStorageObject(
  name: string,
  folder: string,
  metadata: { size?: number; mimetype?: string } | null,
  timestamps: { created_at?: string; updated_at?: string; id?: string }
): MediaAsset | null {
  const path = folder ? `${folder}/${name}` : name;
  const mimetype = metadata?.mimetype ?? '';
  const kind = detectMediaKind(mimetype, name);
  if (!kind) return null;

  const { data } = supabase.storage.from(MEDIA_STORAGE_BUCKET).getPublicUrl(path);

  return {
    id: timestamps.id ?? path,
    name,
    path,
    created_at: timestamps.created_at ?? new Date().toISOString(),
    updated_at: timestamps.updated_at ?? new Date().toISOString(),
    size: metadata?.size ?? 0,
    mimetype,
    publicUrl: data.publicUrl,
    kind,
  };
}

export function getMediaPublicUrl(path: string): string {
  const { data } = supabase.storage.from(MEDIA_STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function listMediaAssets(): Promise<MediaAsset[]> {
  const assets: MediaAsset[] = [];

  for (const prefix of MEDIA_LIST_PREFIXES) {
    const { data, error } = await supabase.storage.from(MEDIA_STORAGE_BUCKET).list(prefix, {
      limit: 1000,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error || !data) continue;

    for (const file of data) {
      if (!file.name || file.name === '.emptyFolderPlaceholder') continue;
      if (file.metadata === null && !file.id) continue;

      const asset = mapStorageObject(
        file.name,
        prefix,
        file.metadata as { size?: number; mimetype?: string } | null,
        {
          created_at: file.created_at,
          updated_at: file.updated_at,
          id: file.id,
        }
      );

      if (asset) assets.push(asset);
    }
  }

  return assets.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function uploadMediaFile(
  file: File,
  options?: { folder?: string; kind?: MediaKind }
): Promise<MediaAsset> {
  const kind = options?.kind ?? detectMediaKind(file.type, file.name);
  if (!kind) {
    throw new Error('Unsupported file type.');
  }
  if (!isKindEnabled(kind)) {
    throw new Error(`${kind.toUpperCase()} uploads are not enabled yet.`);
  }

  const folder = options?.folder ?? getUploadFolder(kind);
  const path = storagePath(folder, sanitizeFilename(file.name));

  const { error } = await supabase.storage.from(MEDIA_STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) throw error;

  return {
    id: path,
    name: path.split('/').pop() ?? path,
    path,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    size: file.size,
    mimetype: file.type,
    publicUrl: getMediaPublicUrl(path),
    kind,
  };
}

export async function deleteMediaAsset(path: string): Promise<void> {
  const { error } = await supabase.storage.from(MEDIA_STORAGE_BUCKET).remove([path]);
  if (error) throw error;
}

export function filterMediaAssets(
  assets: MediaAsset[],
  search: string,
  kinds?: MediaKind[]
): MediaAsset[] {
  const query = search.trim().toLowerCase();
  return assets.filter((asset) => {
    if (kinds?.length && !kinds.includes(asset.kind)) return false;
    if (!query) return true;
    return (
      asset.name.toLowerCase().includes(query) ||
      asset.path.toLowerCase().includes(query)
    );
  });
}

export function isImageAsset(asset: MediaAsset): boolean {
  return asset.kind === 'image';
}

export function isPdfAsset(asset: MediaAsset): boolean {
  return asset.kind === 'pdf';
}

export function formatMediaSize(bytes: number): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}
