import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { supabase } from '../../lib/supabase';
import { AdminLayout } from './AdminLayout';
import { MediaPicker } from '../../components/admin/MediaPicker';
import { RichTextEditor } from '../../components/editor/RichTextEditor';
import { Category, Tag } from '../../types/blog';
import {
  ChevronLeft,
  Save,
  Send,
  Eye,
  Star,
  Plus,
  X,
  Search,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';

interface ArticleForm {
  title: string;
  subtitle: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category_id: string;
  author_name: string;
  author_image: string;
  status: 'draft' | 'published' | 'scheduled';
  published_at: string;
  scheduled_at: string;
  is_featured: boolean;
  meta_title: string;
  meta_description: string;
  og_image: string;
}

interface ArticleData {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  category_id: string | null;
  author_name?: string;
  author_image?: string;
  status: 'draft' | 'published' | 'scheduled';
  published_at?: string;
  scheduled_at?: string;
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  tags?: Tag[];
}

interface ArticleEditorProps {
  article: ArticleData | null;
  onSaved: () => void;
  onCancel: () => void;
}

function emptyForm(): ArticleForm {
  return {
    title: '',
    subtitle: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category_id: '',
    author_name: 'जावेद कुलकर्णी',
    author_image: '',
    status: 'draft',
    published_at: '',
    scheduled_at: '',
    is_featured: false,
    meta_title: '',
    meta_description: '',
    og_image: '',
  };
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\u0900-\u097F\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

function calcReadingTime(html: string) {
  return Math.max(1, Math.ceil(html.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length / 200));
}

export function ArticleEditor({ article, onSaved, onCancel }: ArticleEditorProps) {
  const [form, setForm] = useState<ArticleForm>(() => {
    if (!article) return emptyForm();
    return {
      title: article.title,
      subtitle: article.subtitle ?? '',
      slug: article.slug,
      excerpt: article.excerpt ?? '',
      content: article.content,
      featured_image: article.featured_image ?? '',
      category_id: article.category_id ?? '',
      author_name: article.author_name ?? 'जावेद कुलकर्णी',
      author_image: article.author_image ?? '',
      status: article.status,
      published_at: article.published_at
        ? format(new Date(article.published_at), "yyyy-MM-dd'T'HH:mm")
        : '',
      scheduled_at: article.scheduled_at
        ? format(new Date(article.scheduled_at), "yyyy-MM-dd'T'HH:mm")
        : '',
      is_featured: article.is_featured,
      meta_title: article.meta_title ?? '',
      meta_description: article.meta_description ?? '',
      og_image: article.og_image ?? '',
    };
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState('');
  const [tagDropOpen, setTagDropOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [slugManual, setSlugManual] = useState(!!article);

  // Load categories + tags
  useEffect(() => {
    supabase.from('blog_categories').select('*').order('sort_order').then(({ data }) => {
      if (data) setCategories(data);
    });
    supabase.from('blog_tags').select('*').order('name').then(({ data }) => {
      if (data) setAllTags(data);
    });
  }, []);

  // Load existing tags for the article being edited
  useEffect(() => {
    if (!article?.id) return;
    supabase
      .from('blog_article_tags')
      .select('tag_id')
      .eq('article_id', article.id)
      .then(({ data }) => {
        if (data) setSelectedTagIds(data.map((r: any) => r.tag_id));
      });
  }, [article?.id]);

  const setField = <K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title' && !slugManual) {
        next.slug = generateSlug(value as string);
      }
      return next;
    });
  };

  const handleSlugChange = (val: string) => {
    setSlugManual(true);
    setField('slug', val);
  };

  const regenerateSlug = () => {
    setField('slug', generateSlug(form.title));
    setSlugManual(false);
  };

  // Tag helpers
  const toggleTag = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const createTag = async (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-\u0900-\u097F]/g, '');
    const { data, error } = await supabase
      .from('blog_tags')
      .insert({ name, slug })
      .select()
      .maybeSingle();
    if (!error && data) {
      setAllTags((prev) => [...prev, data]);
      setSelectedTagIds((prev) => [...prev, data.id]);
      setTagSearch('');
    }
  };

  const filteredTags = allTags.filter((t) =>
    t.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const selectedTags = allTags.filter((t) => selectedTagIds.includes(t.id));

  // Save helpers
  const showMsg = (type: 'success' | 'error', text: string) => {
    setSaveMsg({ type, text });
    setTimeout(() => setSaveMsg(null), 3500);
  };

  const save = async (overrideStatus?: 'draft' | 'published') => {
    if (!form.title.trim()) {
      showMsg('error', 'शीर्षक आवश्यक आहे.');
      return;
    }
    setSaving(true);
    try {
      const slug = form.slug.trim() || generateSlug(form.title);
      const status = overrideStatus ?? form.status;
      const published_at =
        status === 'published'
          ? form.published_at
            ? new Date(form.published_at).toISOString()
            : new Date().toISOString()
          : form.published_at
          ? new Date(form.published_at).toISOString()
          : null;

      const payload: Record<string, any> = {
        title: form.title,
        subtitle: form.subtitle || null,
        slug,
        excerpt: form.excerpt || null,
        content: form.content,
        featured_image: form.featured_image || null,
        category_id: form.category_id || null,
        author_name: form.author_name || 'जावेद कुलकर्णी',
        author_image: form.author_image || null,
        status,
        published_at,
        scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
        is_featured: form.is_featured,
        meta_title: form.meta_title || form.title,
        meta_description: form.meta_description || form.excerpt || null,
        og_image: form.og_image || form.featured_image || null,
        reading_time: calcReadingTime(form.content),
        updated_at: new Date().toISOString(),
      };

      let articleId = article?.id;

      if (articleId) {
        const { error } = await supabase.from('blog_articles').update(payload).eq('id', articleId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('blog_articles')
          .insert({ ...payload, views_count: 0, likes_count: 0, comments_count: 0 })
          .select('id')
          .maybeSingle();
        if (error) throw error;
        articleId = data?.id;
      }

      // Sync tags
      if (articleId) {
        await supabase.from('blog_article_tags').delete().eq('article_id', articleId);
        if (selectedTagIds.length > 0) {
          await supabase.from('blog_article_tags').insert(
            selectedTagIds.map((tag_id) => ({ article_id: articleId, tag_id }))
          );
        }
      }

      showMsg('success', status === 'published' ? 'लेख प्रकाशित झाला!' : 'ड्राफ्ट साठवला.');
      if (overrideStatus === 'published') {
        setTimeout(onSaved, 800);
      }
    } catch (err: any) {
      showMsg('error', err.message ?? 'त्रुटी आली.');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (form.slug) window.open(`/blog/${form.slug}`, '_blank');
  };

  const isEditing = !!article;

  return (
    <AdminLayout title={isEditing ? 'लेख संपादित करा' : 'नवीन लेख'}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          लेखांकडे परत जा
        </button>

        {/* Toast */}
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

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreview}
            disabled={!form.slug}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-gray-300 text-sm hover:text-white hover:border-navy-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => save('draft')}
            disabled={saving}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-gray-300 text-sm font-medium hover:text-white hover:border-navy-500 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={() => save('published')}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-900 text-sm font-semibold transition-colors disabled:opacity-50 shadow-lg shadow-gold-500/20"
          >
            <Send className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid xl:grid-cols-[1fr_300px] gap-6">
        {/* ── Left: Editor ── */}
        <div className="space-y-5 min-w-0">
          {/* Title + subtitle */}
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
            <div>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="लेखाचे शीर्षक लिहा..."
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
              <span className="text-xs text-gray-500 font-mono flex-shrink-0">/blog/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="flex-1 px-2 py-1 rounded bg-navy-700 border border-navy-600 text-white text-xs font-mono focus:border-gold-400 focus:outline-none"
                placeholder="article-slug"
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

          {/* Content editor */}
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Content</p>
            <RichTextEditor
              content={form.content}
              onChange={(val) => setField('content', val)}
            />
          </div>

          {/* Excerpt */}
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-6">
            <SectionLabel>सारांश (Excerpt)</SectionLabel>
            <textarea
              value={form.excerpt}
              onChange={(e) => setField('excerpt', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-500 focus:border-gold-400 focus:outline-none resize-none text-sm"
              placeholder="लेखाचा थोडक्यात सारांश..."
            />
          </div>

          {/* SEO */}
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
                placeholder={form.excerpt || 'Short description for search results...'}
                className={`${inputCls} resize-none`}
              />
              <CharCount value={form.meta_description} limit={160} />
            </Field>
            <Field label="OG Image URL">
              <input
                type="url"
                value={form.og_image}
                onChange={(e) => setField('og_image', e.target.value)}
                placeholder={form.featured_image || 'https://...'}
                className={inputCls}
              />
            </Field>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="space-y-4">
          {/* Publish card */}
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 space-y-4">
            <SectionLabel>Publish</SectionLabel>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => setField('status', e.target.value as ArticleForm['status'])}
                className={selectCls}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </Field>
            <Field label="Publish Date">
              <input
                type="datetime-local"
                value={form.published_at}
                onChange={(e) => setField('published_at', e.target.value)}
                className={inputCls}
              />
            </Field>
            {form.status === 'scheduled' && (
              <Field label="Scheduled At">
                <input
                  type="datetime-local"
                  value={form.scheduled_at}
                  onChange={(e) => setField('scheduled_at', e.target.value)}
                  className={inputCls}
                />
              </Field>
            )}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setField('is_featured', e.target.checked)}
                className="w-4 h-4 accent-gold-400 rounded"
              />
              <span className="text-sm text-gray-300 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-gold-400" /> Featured Article
              </span>
            </label>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => save('draft')}
                disabled={saving}
                className="flex-1 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-navy-600 transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" /> Save Draft
              </button>
              <button
                onClick={() => save('published')}
                disabled={saving}
                className="flex-1 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-900 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" /> Publish
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
            <SectionLabel>श्रेणी (Category)</SectionLabel>
            <select
              value={form.category_id}
              onChange={(e) => setField('category_id', e.target.value)}
              className={`${selectCls} mt-3`}
            >
              <option value="">-- श्रेणी निवडा --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
            <SectionLabel>Tags</SectionLabel>
            {/* Selected tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3 mb-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-gold-500/10 text-gold-400 text-xs font-medium border border-gold-500/20"
                  >
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* Tag search */}
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={tagSearch}
                onChange={(e) => { setTagSearch(e.target.value); setTagDropOpen(true); }}
                onFocus={() => setTagDropOpen(true)}
                onBlur={() => setTimeout(() => setTagDropOpen(false), 150)}
                placeholder="Tag शोधा किंवा तयार करा..."
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white text-xs placeholder-gray-500 focus:border-gold-400 focus:outline-none"
              />
              {tagDropOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-navy-900 border border-navy-600 rounded-lg overflow-hidden shadow-xl z-20 max-h-48 overflow-y-auto">
                  {filteredTags.length === 0 && !tagSearch && (
                    <p className="px-3 py-2.5 text-xs text-gray-500">कोणतेही tags नाहीत.</p>
                  )}
                  {filteredTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onMouseDown={() => toggleTag(tag.id)}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-navy-700 transition-colors flex items-center justify-between ${
                        selectedTagIds.includes(tag.id) ? 'text-gold-400' : 'text-gray-300'
                      }`}
                    >
                      {tag.name}
                      {selectedTagIds.includes(tag.id) && (
                        <span className="text-gold-400 text-xs">✓</span>
                      )}
                    </button>
                  ))}
                  {tagSearch.trim() && !filteredTags.some((t) => t.name.toLowerCase() === tagSearch.toLowerCase()) && (
                    <button
                      type="button"
                      onMouseDown={() => createTag(tagSearch.trim())}
                      className="w-full text-left px-3 py-2 text-xs text-emerald-400 hover:bg-navy-700 transition-colors flex items-center gap-1.5 border-t border-navy-700"
                    >
                      <Plus className="w-3 h-3" />
                      "{tagSearch}" तयार करा
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
            <SectionLabel>Featured Image</SectionLabel>
            <div className="mt-3">
              <MediaPicker
                value={form.featured_image}
                onChange={(url) => setField('featured_image', url)}
                acceptKinds={['image']}
                previewAspect="video"
                emptyLabel="Upload or choose a featured image from Media Library."
              />
            </div>
          </div>

          {/* Author */}
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 space-y-3">
            <SectionLabel>Author</SectionLabel>
            <Field label="Author Name">
              <input
                type="text"
                value={form.author_name}
                onChange={(e) => setField('author_name', e.target.value)}
                className={inputCls}
                placeholder="लेखकाचे नाव"
              />
            </Field>
            <Field label="Author Image URL">
              <div className="flex gap-2 items-center">
                {form.author_image && (
                  <img
                    src={form.author_image}
                    alt="Author"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <input
                  type="url"
                  value={form.author_image}
                  onChange={(e) => setField('author_image', e.target.value)}
                  className={inputCls}
                  placeholder="https://..."
                />
              </div>
            </Field>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// ── Small helpers ────────────────────────────────────────────────────────────

const inputCls =
  'w-full px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-500 focus:border-gold-400 focus:outline-none text-sm';

const selectCls =
  'w-full px-3 py-2.5 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm focus:border-gold-400 focus:outline-none';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{children}</p>
  );
}

function CharCount({ value, limit }: { value: string; limit: number }) {
  const len = value.length;
  const over = len > limit;
  return (
    <p className={`text-right text-xs mt-1 ${over ? 'text-red-400' : 'text-gray-500'}`}>
      {len}/{limit}
    </p>
  );
}

export default ArticleEditor;
