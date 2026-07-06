import type { CmsSeoMetadata } from '../types/common';

export function buildSeoPayload(seo?: CmsSeoMetadata) {
  return {
    meta_title: seo?.metaTitle ?? null,
    meta_description: seo?.metaDescription ?? null,
    og_image: seo?.ogImage ?? null,
  };
}

export function truncateForMeta(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3).trim()}...`;
}

export function deriveMetaTitle(title: string, suffix = 'AuthorOS'): string {
  return `${title} | ${suffix}`;
}
