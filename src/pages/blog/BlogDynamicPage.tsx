import { useParams } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { CategoryPage } from './CategoryPage';
import { ArticlePage } from './ArticlePage';
import { BlogLayout } from '../../components/blog/BlogLayout';

export default function BlogDynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { categories, categoriesLoaded } = useBlog();

  if (!categoriesLoaded) {
    return (
      <BlogLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </BlogLayout>
    );
  }

  const isCategory = categories.some((c) => c.slug === slug);
  return isCategory ? <CategoryPage /> : <ArticlePage />;
}
