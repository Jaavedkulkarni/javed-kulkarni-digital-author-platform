import type { MediaAsset } from '../types/media.types';

const media = new Map<string, MediaAsset[]>();

export function getMediaAssets(authorId: string): MediaAsset[] {
  return media.get(authorId) ?? [];
}

export function addMediaAsset(asset: MediaAsset): void {
  const list = media.get(asset.authorId) ?? [];
  media.set(asset.authorId, [...list, asset]);
}

export function removeMediaAsset(authorId: string, assetId: string): void {
  media.set(authorId, getMediaAssets(authorId).filter((a) => a.id !== assetId));
}

export function resetMediaStore(): void {
  media.clear();
}
