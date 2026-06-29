import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Category, Article, Tag, Comment, ArticleFilters, PaginatedResult } from '../types/blog';

interface BlogContextType {
  categories: Category[];
  categoriesLoaded: boolean;
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchArticles: (filters?: ArticleFilters) => Promise<PaginatedResult<Article>>;
  fetchArticleBySlug: (slug: string) => Promise<Article | null>;
  fetchTrendingArticles: (limit?: number) => Promise<Article[]>;
  fetchFeaturedArticles: (limit?: number) => Promise<Article[]>;
  fetchArticlesByCategory: (categorySlug: string, page?: number, limit?: number) => Promise<PaginatedResult<Article>>;
  fetchAdjacentArticles: (articleId: string, publishedAt: string) => Promise<{ prev: Article | null; next: Article | null }>;
  fetchRelatedArticles: (articleId: string, categoryId: string | null, limit?: number) => Promise<Article[]>;
  searchArticles: (query: string, page?: number) => Promise<PaginatedResult<Article>>;
  likeArticle: (articleId: string) => Promise<boolean>;
  unlikeArticle: (articleId: string) => Promise<boolean>;
  bookmarkArticle: (articleId: string) => Promise<boolean>;
  unbookmarkArticle: (articleId: string) => Promise<boolean>;
  isLiked: (articleId: string) => Promise<boolean>;
  isBookmarked: (articleId: string) => Promise<boolean>;
  subscribeNewsletter: (email: string) => Promise<{ success: boolean; message: string }>;
  addComment: (articleId: string, name: string, email: string, content: string, parentId?: string) => Promise<Comment | null>;
  fetchComments: (articleId: string) => Promise<Comment[]>;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev: boolean) => !prev);

  const fetchCategories = async () => {
    try {
      const { data, error: err } = await supabase
        .from('blog_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (err) throw err;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setCategoriesLoaded(true);
    }
  };

  const fetchArticles = async (filters?: ArticleFilters): Promise<PaginatedResult<Article>> => {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('blog_articles')
      .select('*, category:blog_categories(*)', { count: 'exact' })
      .eq('status', 'published');

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters?.is_featured) {
      query = query.eq('is_featured', true);
    }

    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%,subtitle.ilike.%${filters.search}%`
      );
    }

    const sortColumn = filters?.sort_by || 'published_at';
    const sortAscending = filters?.sort_order === 'asc';
    query = query.order(sortColumn, { ascending: sortAscending }).range(offset, offset + limit - 1);

    const { data, error: err, count } = await query;
    if (err) throw err;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    };
  };

  const fetchArticleBySlug = async (slug: string): Promise<Article | null> => {
    const { data, error: err } = await supabase
      .from('blog_articles')
      .select('*, category:blog_categories(*)')
      .eq('slug', slug)
      .maybeSingle();

    if (err || !data) return null;

    if (data.status === 'published') {
      await supabase
        .from('blog_articles')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', data.id);
    }

    const { data: tagRows } = await supabase
      .from('blog_article_tags')
      .select('tag:blog_tags(*)')
      .eq('article_id', data.id);

    return {
      ...data,
      views_count: (data.views_count || 0) + 1,
      tags: tagRows?.map((t: any) => t.tag as Tag).filter(Boolean) || [],
    } as Article;
  };

  const fetchTrendingArticles = async (limit = 5): Promise<Article[]> => {
    const { data, error: err } = await supabase
      .from('blog_articles')
      .select('*, category:blog_categories(*)')
      .eq('status', 'published')
      .order('views_count', { ascending: false })
      .limit(limit);

    if (err) throw err;
    return data || [];
  };

  const fetchFeaturedArticles = async (limit = 3): Promise<Article[]> => {
    const { data, error: err } = await supabase
      .from('blog_articles')
      .select('*, category:blog_categories(*)')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (err) throw err;
    return data || [];
  };

  const fetchArticlesByCategory = async (
    categorySlug: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResult<Article>> => {
    const { data: category } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();

    if (!category) return { data: [], total: 0, page, limit, total_pages: 0 };
    return fetchArticles({ category: category.id, page, limit });
  };

  const fetchAdjacentArticles = async (
    articleId: string,
    publishedAt: string
  ): Promise<{ prev: Article | null; next: Article | null }> => {
    const [prevRes, nextRes] = await Promise.all([
      supabase
        .from('blog_articles')
        .select('id, title, slug, featured_image, category:blog_categories(name, slug)')
        .eq('status', 'published')
        .lt('published_at', publishedAt)
        .neq('id', articleId)
        .order('published_at', { ascending: false })
        .limit(1),
      supabase
        .from('blog_articles')
        .select('id, title, slug, featured_image, category:blog_categories(name, slug)')
        .eq('status', 'published')
        .gt('published_at', publishedAt)
        .neq('id', articleId)
        .order('published_at', { ascending: true })
        .limit(1),
    ]);

    return {
      prev: (prevRes.data?.[0] as Article) ?? null,
      next: (nextRes.data?.[0] as Article) ?? null,
    };
  };

  const fetchRelatedArticles = async (
    articleId: string,
    categoryId: string | null,
    limit = 3
  ): Promise<Article[]> => {
    if (!categoryId) return [];
    const { data, error: err } = await supabase
      .from('blog_articles')
      .select('*, category:blog_categories(*)')
      .eq('status', 'published')
      .eq('category_id', categoryId)
      .neq('id', articleId)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (err) return [];
    return data || [];
  };

  const searchArticles = async (query: string, page = 1): Promise<PaginatedResult<Article>> => {
    return fetchArticles({ search: query, page });
  };

  const likeArticle = async (articleId: string): Promise<boolean> => {
    const { error: err } = await supabase.from('blog_article_likes').insert({ article_id: articleId });
    if (err) return false;
    return true;
  };

  const unlikeArticle = async (articleId: string): Promise<boolean> => {
    const { error: err } = await supabase.from('blog_article_likes').delete().match({ article_id: articleId });
    return !err;
  };

  const bookmarkArticle = async (articleId: string): Promise<boolean> => {
    const { error: err } = await supabase.from('blog_article_bookmarks').insert({ article_id: articleId });
    return !err;
  };

  const unbookmarkArticle = async (articleId: string): Promise<boolean> => {
    const { error: err } = await supabase.from('blog_article_bookmarks').delete().match({ article_id: articleId });
    return !err;
  };

  const isLiked = async (articleId: string): Promise<boolean> => {
    const { data } = await supabase.from('blog_article_likes').select('id').eq('article_id', articleId).maybeSingle();
    return !!data;
  };

  const isBookmarked = async (articleId: string): Promise<boolean> => {
    const { data } = await supabase.from('blog_article_bookmarks').select('id').eq('article_id', articleId).maybeSingle();
    return !!data;
  };

  const subscribeNewsletter = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { error: err } = await supabase.from('blog_newsletter_subscribers').insert({ email });
      if (err) {
        if (err.code === '23505') return { success: false, message: 'हा ईमेल आधीच सब्स्क्राईब केला आहे.' };
        throw err;
      }
      return { success: true, message: 'बधाई! आपण यशस्वीरित्या सब्स्क्राईब केले.' };
    } catch {
      return { success: false, message: 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.' };
    }
  };

  const addComment = async (
    articleId: string,
    name: string,
    email: string,
    content: string,
    parentId?: string
  ): Promise<Comment | null> => {
    const { data, error: err } = await supabase
      .from('blog_comments')
      .insert({ article_id: articleId, author_name: name, author_email: email, content, parent_id: parentId || null, status: 'pending' })
      .select()
      .single();
    if (err) return null;
    return data;
  };

  const fetchComments = async (articleId: string): Promise<Comment[]> => {
    const { data, error: err } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('article_id', articleId)
      .eq('status', 'approved')
      .order('created_at', { ascending: true });

    if (err) throw err;
    const comments = data || [];
    const parentComments = comments.filter((c) => !c.parent_id);
    const childComments = comments.filter((c) => c.parent_id);
    const buildTree = (parentId: string | null): Comment[] =>
      childComments.filter((c) => c.parent_id === parentId).map((c) => ({ ...c, replies: buildTree(c.id) }));
    return parentComments.map((c) => ({ ...c, replies: buildTree(c.id) }));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const value: BlogContextType = {
    categories,
    categoriesLoaded,
    loading,
    error,
    fetchCategories,
    fetchArticles,
    fetchArticleBySlug,
    fetchTrendingArticles,
    fetchFeaturedArticles,
    fetchArticlesByCategory,
    fetchAdjacentArticles,
    fetchRelatedArticles,
    searchArticles,
    likeArticle,
    unlikeArticle,
    bookmarkArticle,
    unbookmarkArticle,
    isLiked,
    isBookmarked,
    subscribeNewsletter,
    addComment,
    fetchComments,
    darkMode,
    toggleDarkMode,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) throw new Error('useBlog must be used within a BlogProvider');
  return context;
}
