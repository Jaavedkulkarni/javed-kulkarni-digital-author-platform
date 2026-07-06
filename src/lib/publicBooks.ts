import { supabase } from './supabase';
import {
  books as staticBooks,
  getBookBySlug as getStaticBookBySlug,
  getRelatedBooks as getStaticRelatedBooks,
  type Book,
} from '../data/books';

const PUBLIC_BOOK_SELECT =
  'id, title, slug, short_description, cover_image, language, isbn, amazon_url, author_name, why_read, authors_note, table_of_contents, related_slugs, featured_highlights, sort_order, is_featured, category:book_categories(name, slug)';

type SupabaseBookRow = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  cover_image: string | null;
  language: string;
  isbn: string | null;
  amazon_url: string | null;
  author_name: string;
  why_read: string | null;
  authors_note: string | null;
  table_of_contents: string[] | null;
  related_slugs: string[] | null;
  featured_highlights: string[] | null;
  sort_order: number;
  is_featured: boolean;
  category?: { name: string; slug: string } | { name: string; slug: string }[] | null;
};

function normalizeJoin<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function mapRowToBook(row: SupabaseBookRow): Book {
  const category = normalizeJoin(row.category);
  return {
    id: row.sort_order,
    slug: row.slug,
    title: row.title,
    author: row.author_name,
    category: category?.name ?? '',
    language: row.language,
    isbn: row.isbn ?? '',
    cover: row.cover_image ?? '',
    description: row.short_description ?? '',
    whyRead: row.why_read ?? '',
    authorsNote: row.authors_note ?? '',
    tableOfContents: row.table_of_contents ?? [],
    amazonUrl: row.amazon_url ?? '',
    relatedSlugs: row.related_slugs ?? [],
  };
}

function mapRows(rows: SupabaseBookRow[]): Book[] {
  return rows.map(mapRowToBook);
}

export interface FeaturedBookData {
  book: Book;
  highlights: string[];
}

export interface PublicCategory {
  slug: string;
  name: string;
  count: number;
  previewTitles: string[];
}

export interface HomepageBookData {
  books: Book[];
  featured: FeaturedBookData;
  categories: PublicCategory[];
}

const FALLBACK_FEATURED_SLUG = 'digital-kaid-mr';

const FALLBACK_FEATURED_HIGHLIGHTS = [
  'डिजिटल व्यसन',
  'सोशल मीडिया',
  'डेटा गोपनीयता',
  'कृत्रिम बुद्धिमत्ता',
  'सायबर युद्ध',
];

const STATIC_CATEGORY_MAP: Record<string, { label: string; categories: string[] }> = {
  atmvikas: { label: 'आत्मविकास', categories: ['आत्मविकास', 'Self Development'] },
  parenting: { label: 'पालकत्व', categories: ['पालकत्व'] },
  'digital-life': { label: 'डिजिटल जीवन', categories: ['डिजिटल जीवन', 'Technology'] },
  katha: { label: 'कथा', categories: ['कथा'] },
  horror: { label: 'भयकथा', categories: ['भयकथा'] },
  humour: { label: 'विनोदी लेखन', categories: ['विनोदी लेखन'] },
};

function getStaticFeaturedBook(): FeaturedBookData {
  const fallback =
    getStaticBookBySlug(FALLBACK_FEATURED_SLUG) ??
    staticBooks.find((b) => b.slug === FALLBACK_FEATURED_SLUG) ??
    staticBooks[0];

  return {
    book: fallback,
    highlights: FALLBACK_FEATURED_HIGHLIGHTS,
  };
}

function getStaticHomepageData(): HomepageBookData {
  const books = staticBooks;
  return {
    books,
    featured: getStaticFeaturedBook(),
    categories: buildCategoriesFromStaticBooks(books),
  };
}

export function getHomepageInitialData(): HomepageBookData {
  return getStaticHomepageData();
}

async function fetchPublishedBookRows(): Promise<SupabaseBookRow[] | null> {
  const { data, error } = await supabase
    .from('books')
    .select(PUBLIC_BOOK_SELECT)
    .eq('workflow_status', 'published')
    .eq('is_hidden', false)
    .order('sort_order', { ascending: true });

  if (error || !data?.length) {
    return null;
  }

  return data as SupabaseBookRow[];
}

function pickFeaturedFromRows(rows: SupabaseBookRow[]): FeaturedBookData {
  const featuredRow =
    rows.find((row) => row.is_featured) ??
    rows.find((row) => row.slug === FALLBACK_FEATURED_SLUG) ??
    rows[0];

  return {
    book: mapRowToBook(featuredRow),
    highlights: featuredRow.featured_highlights?.length
      ? featuredRow.featured_highlights
      : FALLBACK_FEATURED_HIGHLIGHTS,
  };
}

function groupBookTitlesByCategorySlug(rows: SupabaseBookRow[]): Map<string, string[]> {
  const booksByCategorySlug = new Map<string, string[]>();

  for (const row of rows) {
    const category = normalizeJoin(row.category);
    if (!category?.slug) continue;

    const titles = booksByCategorySlug.get(category.slug) ?? [];
    titles.push(row.title);
    booksByCategorySlug.set(category.slug, titles);
  }

  return booksByCategorySlug;
}

async function buildPublicCategoriesFromRows(rows: SupabaseBookRow[]): Promise<PublicCategory[]> {
  const booksByCategorySlug = groupBookTitlesByCategorySlug(rows);

  const { data: categories, error } = await supabase
    .from('book_categories')
    .select('name, slug, sort_order')
    .order('sort_order', { ascending: true });

  if (error || !categories?.length) {
    return buildCategoriesFromStaticBooks(mapRows(rows));
  }

  return categories.map((cat) => {
    const titles = booksByCategorySlug.get(cat.slug) ?? [];
    return {
      slug: cat.slug,
      name: cat.name,
      count: titles.length,
      previewTitles: titles.slice(0, 2),
    };
  });
}

export async function loadHomepageBookData(): Promise<HomepageBookData> {
  const rows = await fetchPublishedBookRows();

  if (!rows) {
    return getStaticHomepageData();
  }

  const categories = await buildPublicCategoriesFromRows(rows);

  return {
    books: mapRows(rows),
    featured: pickFeaturedFromRows(rows),
    categories,
  };
}

export async function loadBookBySlug(slug: string): Promise<Book | undefined> {
  if (!slug) return undefined;

  const { data, error } = await supabase
    .from('books')
    .select(PUBLIC_BOOK_SELECT)
    .eq('workflow_status', 'published')
    .eq('is_hidden', false)
    .eq('slug', slug)
    .maybeSingle();

  if (!error && data) {
    return mapRowToBook(data as SupabaseBookRow);
  }

  return getStaticBookBySlug(slug);
}

export async function loadRelatedBooks(slugs: string[]): Promise<Book[]> {
  if (!slugs.length) return [];

  const { data, error } = await supabase
    .from('books')
    .select(PUBLIC_BOOK_SELECT)
    .eq('workflow_status', 'published')
    .eq('is_hidden', false)
    .in('slug', slugs);

  if (!error && data?.length) {
    const bySlug = new Map(mapRows(data as SupabaseBookRow[]).map((b) => [b.slug, b]));
    return slugs.map((s) => bySlug.get(s)).filter(Boolean) as Book[];
  }

  return getStaticRelatedBooks(slugs);
}

export async function loadBooksByCategorySlug(
  categorySlug: string
): Promise<{ label: string; books: Book[] } | null> {
  const rows = await fetchPublishedBookRows();

  if (!rows) {
    return loadStaticCategory(categorySlug);
  }

  const { data: category, error: catError } = await supabase
    .from('book_categories')
    .select('id, name, slug')
    .eq('slug', categorySlug)
    .maybeSingle();

  if (catError || !category) {
    return loadStaticCategory(categorySlug);
  }

  const categoryBooks = rows.filter((row) => normalizeJoin(row.category)?.slug === category.slug);

  if (!categoryBooks.length) {
    return { label: category.name, books: [] };
  }

  return {
    label: category.name,
    books: mapRows(categoryBooks),
  };
}

function loadStaticCategory(slug: string): { label: string; books: Book[] } | null {
  const meta = STATIC_CATEGORY_MAP[slug];
  if (!meta) return null;
  return {
    label: meta.label,
    books: staticBooks.filter((b) => meta.categories.includes(b.category)),
  };
}

function buildCategoriesFromStaticBooks(publishedBooks: Book[]): PublicCategory[] {
  return Object.entries(STATIC_CATEGORY_MAP).map(([slug, meta]) => {
    const catBooks = publishedBooks.filter((b) => meta.categories.includes(b.category));
    return {
      slug,
      name: meta.label,
      count: catBooks.length,
      previewTitles: catBooks.slice(0, 2).map((b) => b.title),
    };
  });
}
