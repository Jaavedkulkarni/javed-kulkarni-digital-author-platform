import { useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useBooks } from '../../context/BookContext';
import { AdminLayout } from './AdminLayout';
import { RichTextEditor } from '../../components/editor/RichTextEditor';
import { Book, BookCategory, BookFormData } from '../../types/book';
import { ChevronLeft, Star, Sparkles, Save, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BookEditorProps {
  book: Book | null;
  onCancel: () => void;
  onSaved: () => void;
}
function emptyForm(): BookFormData {
  return {
    title: '',
    subtitle: '',
    slug: '',
    short_description: '',
    full_description: '',
    cover_image: '',
    category_id: '',
    language: 'मराठी',
    isbn: '',
    total_pages: '',
    amazon_url: '',
    sample_pdf_url: '',
    publication_date: '',
    status: 'draft',
    is_featured: false,
    is_new_release: false,
    meta_title: '',
    meta_description: '',
    og_image: '',
    author_name: 'जावेद कुलकर्णी',
  };
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\u0900-\u097F\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

const inputCls =
  'w-full px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-500 focus:border-gold-400 focus:outline-none text-sm';

const selectCls =
  'w-full px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white focus:border-gold-400 focus:outline-none text-sm';

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{children}</p>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function CharCount({ value, limit }: { value: string; limit: number }) {
  return (
    <p className={`text-xs mt-1 text-right ${value.length > limit ? 'text-red-400' : 'text-gray-500'}`}>
      {value.length}/{limit}
    </p>
  );
}

export function BookEditor({ book, onCancel, onSaved }: BookEditorProps) {
  const { createBook, updateBook } = useBooks();
  const [form, setForm] = useState<BookFormData>(() => {
    if (!book) return emptyForm();
    return {
      title: book.title,
      subtitle: book.subtitle ?? '',
      slug: book.slug,
      short_description: book.short_description ?? '',
      full_description: book.full_description ?? '',
      cover_image: book.cover_image ?? '',
      category_id: book.category_id ?? '',
      language: book.language,
      isbn: book.isbn ?? '',
      total_pages: book.total_pages != null ? String(book.total_pages) : '',
      amazon_url: book.amazon_url ?? '',
      sample_pdf_url: book.sample_pdf_url ?? '',
      publication_date: book.publication_date ?? '',
      status: book.status,
      is_featured: book.is_featured,
      is_new_release: book.is_new_release,
      meta_title: book.meta_title ?? '',
      meta_description: book.meta_description ?? '',
      og_image: book.og_image ?? '',
      author_name: book.author_name,
    };
  });

  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [slugManual, setSlugManual] = useState(!!book);
  const [bookId, setBookId] = useState<string | null>(book?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    supabase
      .from('book_categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, []);

  const setField = <K extends keyof BookFormData>(key: K, value: BookFormData[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title' && !slugManual) {
        next.slug = generateSlug(value as string);
      }
      return next;
    });
  };

  const handleSlugChange = (value: string) => {
    setSlugManual(true);
    setField('slug', value);
  };

  const regenerateSlug = () => {
    setSlugManual(false);
    setField('slug', generateSlug(form.title));
  };

  const showMsg = (type: 'success' | 'error', text: string) => {
    setSaveMsg({ type, text });
    setTimeout(() => setSaveMsg(null), 3500);
  };

  const save = async (overrideStatus?: BookFormData['status']) => {
    if (!form.title.trim()) {
      showMsg('error', 'शीर्षक आवश्यक आहे.');
      return;
    }

    const slug = form.slug.trim() || generateSlug(form.title);
    if (!slug) {
      showMsg('error', 'Slug आवश्यक आहे.');
      return;
    }

    setSaving(true);
    try {
      const status = overrideStatus ?? form.status;

      if (form.is_featured) {
        let featuredQuery = supabase.from('books').update({ is_featured: false });
        if (bookId) {
          featuredQuery = featuredQuery.neq('id', bookId);
        }
        await featuredQuery;
      }

      const payload: BookFormData = {
        ...form,
        slug,
        status,
        meta_title: form.meta_title || form.title,
        meta_description: form.meta_description || form.short_description,
        og_image: form.og_image || form.cover_image,
      };

      if (bookId) {
        await updateBook(bookId, payload);
      } else {
        const created = await createBook(payload);
        if (created) setBookId(created.id);
      }

      showMsg('success', status === 'published' ? 'पुस्तक प्रकाशित झाले!' : 'ड्राफ्ट साठवले.');
      if (overrideStatus === 'published') {
        setTimeout(onSaved, 800);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'त्रुटी आली.';
      showMsg('error', message);
    } finally {
      setSaving(false);
    }
  };

  const isEditing = !!book || !!bookId;

  return (
    <AdminLayout title={isEditing ? 'पुस्तक संपादित करा' : 'नवीन पुस्तक'}>
      <div className="flex items-center justify-between mb-6 gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          पुस्तकांकडे परत जा
        </button>

        {saveMsg && (
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
              saveMsg.type === 'success'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                : 'bg-red-500/15 text-red-400 border border-red-500/25'
            }`}
          >
            {saveMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {saveMsg.text}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => save('draft')}
            disabled={saving}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-gray-300 text-sm hover:text-white hover:border-navy-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => save('published')}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-900 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold-500/20"
          >
            <Send className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-5 min-w-0">
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
            <div>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="पुस्तकाचे शीर्षक लिहा..."
                className="w-full px-0 py-1 bg-transparent border-none text-white text-2xl font-bold placeholder-navy-600 focus:outline-none"
              />
            </div>
            <div>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setField('subtitle', e.target.value)}
                placeholder="उपशीर्षक (ऐच्छिक)..."
                className="w-full px-0 py-1 bg-transparent border-none text-gold-300/70 text-base placeholder-navy-600 focus:outline-none"
              />
            </div>
            <div className="flex gap-2 items-center pt-1 border-t border-navy-700">
              <span className="text-xs text-gray-500 font-mono flex-shrink-0">/books/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="flex-1 px-2 py-1 rounded bg-navy-700 border border-navy-600 text-white text-xs font-mono focus:border-gold-400 focus:outline-none"
                placeholder="book-slug"
              />
              <button
                type="button"
                onClick={regenerateSlug}
                className="text-xs text-gray-400 hover:text-gold-400 transition-colors whitespace-nowrap px-2 py-1 rounded hover:bg-navy-700"
              >
                Auto-generate
              </button>
            </div>
          </div>

          <div className="bg-navy-800 border border-navy-700 rounded-xl p-6">
            <SectionLabel>Short Description</SectionLabel>
            <textarea
              value={form.short_description}
              onChange={(e) => setField('short_description', e.target.value)}
              rows={3}
              className={`${inputCls} mt-3 resize-none`}
              placeholder="पुस्तकाचा थोडक्यात परिचय..."
            />
          </div>

          <div className="bg-navy-800 border border-navy-700 rounded-xl p-6">
            <SectionLabel>Full Description</SectionLabel>
            <div className="mt-3">
              <RichTextEditor
                content={form.full_description}
                onChange={(val) => setField('full_description', val)}
              />
            </div>
          </div>

          <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
            <SectionLabel>Links & Details</SectionLabel>
            <Field label="Amazon URL">
              <input
                type="url"
                value={form.amazon_url}
                onChange={(e) => setField('amazon_url', e.target.value)}
                placeholder="https://www.amazon.in/..."
                className={inputCls}
              />
            </Field>
            <Field label="Sample PDF URL">
              <input
                type="url"
                value={form.sample_pdf_url}
                onChange={(e) => setField('sample_pdf_url', e.target.value)}
                placeholder="https://..."
                className={inputCls}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="ISBN">
                <input
                  type="text"
                  value={form.isbn}
                  onChange={(e) => setField('isbn', e.target.value)}
                  placeholder="978-..."
                  className={inputCls}
                />
              </Field>
              <Field label="Total Pages">
                <input
                  type="number"
                  min={1}
                  value={form.total_pages}
                  onChange={(e) => setField('total_pages', e.target.value)}
                  placeholder="200"
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
            <SectionLabel>SEO & Open Graph</SectionLabel>
            <Field label="Meta Title">
              <input
                type="text"
                value={form.meta_title}
                onChange={(e) => setField('meta_title', e.target.value)}
                placeholder={form.title || 'Page title for search engines...'}
                className={inputCls}
              />
              <CharCount value={form.meta_title} limit={60} />
            </Field>
            <Field label="Meta Description">
              <textarea
                value={form.meta_description}
                onChange={(e) => setField('meta_description', e.target.value)}
                rows={2}
                placeholder={form.short_description || 'Short description for search results...'}
                className={`${inputCls} resize-none`}
              />
              <CharCount value={form.meta_description} limit={160} />
            </Field>
            <Field label="OG Image URL">
              <input
                type="url"
                value={form.og_image}
                onChange={(e) => setField('og_image', e.target.value)}
                placeholder={form.cover_image || 'https://...'}
                className={inputCls}
              />
            </Field>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 space-y-4">
            <SectionLabel>Publish</SectionLabel>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => setField('status', e.target.value as BookFormData['status'])}
                className={selectCls}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
            <Field label="Publication Date">
              <input
                type="date"
                value={form.publication_date}
                onChange={(e) => setField('publication_date', e.target.value)}
                className={inputCls}
              />
            </Field>
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setField('is_featured', e.target.checked)}
                className="w-4 h-4 accent-gold-400 rounded"
              />
              <span className="text-sm text-gray-300 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-gold-400" /> Featured Book
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.is_new_release}
                onChange={(e) => setField('is_new_release', e.target.checked)}
                className="w-4 h-4 accent-gold-400 rounded"
              />
              <span className="text-sm text-gray-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" /> New Release
              </span>
            </label>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => save('draft')}
                disabled={saving}
                className="flex-1 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-navy-600 transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" /> Save Draft
              </button>
              <button
                type="button"
                onClick={() => save('published')}
                disabled={saving}
                className="flex-1 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-900 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" /> Publish
              </button>
            </div>
          </div>

          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
            <SectionLabel>श्रेणी (Category)</SectionLabel>
            <select
              value={form.category_id}
              onChange={(e) => setField('category_id', e.target.value)}
              className={`${selectCls} mt-3`}
            >
              <option value="">-- श्रेणी निवडा --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 space-y-4">
            <SectionLabel>Language</SectionLabel>
            <select
              value={form.language}
              onChange={(e) => setField('language', e.target.value)}
              className={selectCls}
            >
              <option value="मराठी">मराठी</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
            <SectionLabel>Cover Image</SectionLabel>
            <input
              type="url"
              value={form.cover_image}
              onChange={(e) => setField('cover_image', e.target.value)}
              placeholder="https://..."
              className={`${inputCls} mt-3`}
            />
            {form.cover_image ? (
              <div className="mt-3 relative aspect-[2/3] rounded-lg overflow-hidden bg-navy-700 border border-navy-600">
                <img
                  src={form.cover_image}
                  alt="Cover preview"
                  className="w-full h-full object-contain bg-white p-2"
                />
              </div>
            ) : (
              <div className="mt-3 aspect-[2/3] rounded-lg bg-navy-700 border border-dashed border-navy-600 flex items-center justify-center text-gray-500 text-xs">
                Cover preview
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default BookEditor;
