import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useBooks } from '../../context/BookContext';
import { supabase } from '../../lib/supabase';
import { AdminLayout } from './AdminLayout';
import { AdminWarning } from './AdminWarning';
import { BookEditor } from './BookEditor';
import { Book, BookListItem } from '../../types/book';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Copy,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Star,
  Filter,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';

const PAGE_SIZE = 15;

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  draft: 'bg-gray-500/15 text-gray-400 border-gray-500/25',
};

const STATUS_LABELS: Record<string, string> = {
  published: 'प्रकाशित',
  draft: 'ड्राफ्ट',
};

const LANGUAGE_OPTIONS = ['मराठी', 'English'];

export function BookManager() {
  const { currentView, setCurrentView } = useAdmin();
  const { getBooks, getBook, deleteBook } = useBooks();

  const [books, setBooks] = useState<BookListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [booksTableEmpty, setBooksTableEmpty] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const isEditorOpen = currentView === 'book-create' || currentView === 'book-edit';

  useEffect(() => {
    setCategoriesLoading(true);
    supabase
      .from('book_categories')
      .select('id, name')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error loading book categories:', error);
          setCategories([]);
        } else {
          setCategories(data ?? []);
        }
        setCategoriesLoading(false);
      });
  }, []);

  useEffect(() => {
    supabase
      .from('books')
      .select('id', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (error) {
          console.error('Error checking books table:', error);
          setBooksTableEmpty(false);
          return;
        }
        setBooksTableEmpty((count ?? 0) === 0);
      });
  }, [books, total]);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getBooks({
        page,
        limit: PAGE_SIZE,
        search: searchQuery || undefined,
        status: filterStatus as 'all' | 'draft' | 'published',
        category_id: filterCategory || undefined,
        language: filterLanguage || undefined,
        sort_by: 'created_at',
        sort_order: 'desc',
      });
      setBooks(result.data);
      setTotal(result.total);
    } catch (err) {
      console.error('Error loading books:', err);
      setBooks([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [getBooks, page, searchQuery, filterStatus, filterCategory, filterLanguage]);

  useEffect(() => {
    if (!isEditorOpen) loadBooks();
  }, [isEditorOpen, loadBooks]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterStatus, filterCategory, filterLanguage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const handleCreateNew = () => {
    setEditingBook(null);
    setCurrentView('book-create');
  };

  const handleEdit = async (book: BookListItem) => {
    const full = await getBook(book.id);
    setEditingBook(full);
    setCurrentView('book-edit');
  };

  const handleCancel = () => {
    setEditingBook(null);
    setCurrentView('books');
  };

  const handleSaved = () => {
    setEditingBook(null);
    setCurrentView('books');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('हे पुस्तक कायमचे हटवायचे आहे का?')) return;
    setDeletingId(id);
    const ok = await deleteBook(id);
    if (ok) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
      setTotal((prev) => prev - 1);
    }
    setDeletingId(null);
  };

  const hasActiveFilters =
    !!searchQuery || filterStatus !== 'all' || !!filterCategory || !!filterLanguage;
  const showSeedWarning = booksTableEmpty && !hasActiveFilters && !loading;

  if (isEditorOpen) {
    return <BookEditor book={editingBook} onCancel={handleCancel} onSaved={handleSaved} />;
  }

  return (
    <AdminLayout title="पुस्तके">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">📚 पुस्तके</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} पुस्तके एकूण</p>
        </div>
        <button
          type="button"
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-sm rounded-lg transition-colors shadow-lg shadow-gold-500/20"
        >
          <Plus className="w-4 h-4" />
          नवीन पुस्तक
        </button>
      </div>

      {showSeedWarning && (
        <AdminWarning
          title="Books table is empty"
          message='No books were found in Supabase. Apply migration "006_create_books_schema.sql" to create the books schema and seed the initial catalogue. The public site falls back to static data until books exist here.'
        />
      )}

      {!categoriesLoading && categories.length === 0 && (
        <AdminWarning
          title="Book categories missing"
          message='The book_categories table is empty. Run the Supabase migration "006_create_books_schema.sql" to seed categories.'
        />
      )}

      <div className="bg-navy-800 border border-navy-700 rounded-xl p-4 mb-5 flex flex-col lg:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none text-sm"
              placeholder="शीर्षक किंवा slug शोधा..."
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-gray-300 hover:text-white hover:border-navy-500 text-sm transition-colors"
          >
            शोधा
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className="px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm"
            aria-label="Filter by language"
          >
            <option value="">All Languages</option>
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-navy-700">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
                <div className="w-10 h-14 rounded-lg bg-navy-700 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-navy-700 rounded w-2/3" />
                  <div className="h-3 bg-navy-700 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-navy-600 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {hasActiveFilters
                ? 'कोणतेही निकाल आढळले नाही.'
                : showSeedWarning
                  ? 'Migration seed data not found. See the warning above.'
                  : 'अजून कोणतीही पुस्तके नाहीत.'}
            </p>
            {!hasActiveFilters && !showSeedWarning && (
              <button
                type="button"
                onClick={handleCreateNew}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 text-gold-400 rounded-lg text-sm font-medium hover:bg-gold-500/20 transition-colors"
              >
                <Plus className="w-4 h-4" /> पहिले पुस्तक जोडा
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden lg:grid grid-cols-[48px_1fr_140px_100px_100px_120px_100px] gap-4 px-5 py-2.5 bg-navy-900/50 border-b border-navy-700">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cover</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">शीर्षक</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">श्रेणी</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">भाषा</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">स्थिती</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">प्रकाशित</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">क्रिया</span>
            </div>

            <div className="divide-y divide-navy-700/60">
              {books.map((book) => (
                <BookRow
                  key={book.id}
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  deletingId={deletingId}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-navy-700 bg-navy-900/30">
                <p className="text-sm text-gray-500">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p =
                      totalPages <= 7
                        ? i + 1
                        : page <= 4
                          ? i + 1
                          : page >= totalPages - 3
                            ? totalPages - 6 + i
                            : page - 3 + i;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          p === page
                            ? 'bg-gold-500 text-navy-900'
                            : 'text-gray-400 hover:text-white hover:bg-navy-700'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function BookRow({
  book,
  onEdit,
  onDelete,
  deletingId,
}: {
  book: BookListItem;
  onEdit: (b: BookListItem) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}) {
  const isDeleting = deletingId === book.id;

  return (
    <div className={`px-5 py-3.5 hover:bg-navy-700/30 transition-colors ${isDeleting ? 'opacity-50' : ''}`}>
      <div className="hidden lg:grid grid-cols-[48px_1fr_140px_100px_100px_120px_100px] gap-4 items-center">
        <div className="w-10 h-14 rounded-lg overflow-hidden bg-navy-700 flex-shrink-0 flex items-center justify-center">
          {book.cover_image ? (
            <img src={book.cover_image} alt="" className="w-full h-full object-contain bg-white p-0.5" />
          ) : (
            <BookOpen className="w-4 h-4 text-gray-500" />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white text-sm font-medium truncate">{book.title}</p>
            {book.is_featured && <Star className="w-3 h-3 text-gold-400 fill-gold-400 flex-shrink-0" />}
            {book.is_new_release && <Sparkles className="w-3 h-3 text-gold-400 flex-shrink-0" />}
          </div>
          <p className="text-gray-500 text-xs truncate mt-0.5 font-mono">/{book.slug}</p>
        </div>

        <div>
          {book.category ? (
            <span className="text-sm text-gray-400 truncate block">{book.category.name}</span>
          ) : (
            <span className="text-gray-600 text-sm">—</span>
          )}
        </div>

        <div>
          <span className="text-sm text-gray-400">{book.language}</span>
        </div>

        <div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[book.status] ?? ''}`}
          >
            {STATUS_LABELS[book.status] ?? book.status}
          </span>
        </div>

        <div>
          <span className="text-sm text-gray-400">
            {book.publication_date
              ? format(new Date(book.publication_date), 'd MMM yyyy')
              : '—'}
          </span>
        </div>

        <div className="flex items-center justify-end gap-0.5">
          <button
            type="button"
            disabled
            title="Preview — coming in Sprint 2"
            className="p-2 rounded-lg text-gray-600 cursor-not-allowed opacity-40"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(book)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600 transition-colors"
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled
            title="Duplicate — coming in Sprint 2"
            className="p-2 rounded-lg text-gray-600 cursor-not-allowed opacity-40"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(book.id)}
            disabled={isDeleting}
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="lg:hidden flex items-center gap-3">
        <div className="w-10 h-14 rounded-lg overflow-hidden bg-navy-700 flex-shrink-0 flex items-center justify-center">
          {book.cover_image ? (
            <img src={book.cover_image} alt="" className="w-full h-full object-contain bg-white p-0.5" />
          ) : (
            <BookOpen className="w-4 h-4 text-gray-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-white text-sm font-medium truncate flex-1">{book.title}</p>
            <span
              className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[book.status] ?? ''}`}
            >
              {STATUS_LABELS[book.status] ?? book.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {book.category && <span>{book.category.name}</span>}
            <span>{book.language}</span>
            {book.publication_date && (
              <span>{format(new Date(book.publication_date), 'd MMM yyyy')}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit(book)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(book.id)}
            disabled={isDeleting}
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookManager;
