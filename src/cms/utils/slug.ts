export function slugifyText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function ensureUniqueSlug(base: string, existingSlugs: string[]): string {
  const slug = slugifyText(base);
  if (!existingSlugs.includes(slug)) return slug;

  let counter = 2;
  while (existingSlugs.includes(`${slug}-${counter}`)) {
    counter += 1;
  }
  return `${slug}-${counter}`;
}
