export function ensureAuthorOwnership(bookAuthorId: string | null, authorId: string): boolean {
  return bookAuthorId === authorId;
}

export function filterByAuthorId<T extends { authorId: string }>(items: T[], authorId: string): T[] {
  return items.filter((item) => item.authorId === authorId);
}

export function generateDuplicateTitle(title: string): string {
  return `${title} (Copy)`;
}
