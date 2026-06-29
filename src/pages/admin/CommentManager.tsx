import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { supabase } from '../../lib/supabase';
import { AdminLayout } from './AdminLayout';
import { MessageSquare, Check, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Comment {
  id: string;
  article_id: string;
  parent_id: string | null;
  author_name: string;
  author_email: string;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  created_at: string;
  articles?: { title: string; slug: string }[];
}

export function CommentManager() {
  const { isAuthenticated } = useAdmin();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadComments();
  }, [filter]);

  const loadComments = async () => {
    setLoading(true);
    let query = supabase
      .from('blog_comments')
      .select('*, articles:blog_articles(title, slug)')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data } = await query;
    if (data) {
      setComments(data as unknown as Comment[]);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'spam' | 'trash') => {
    await supabase.from('blog_comments').update({ status }).eq('id', id);
    loadComments();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('तुम्हाला ही टिप्पणी खात्रीने हटवायची आहे का?')) return;
    await supabase.from('blog_comments').delete().eq('id', id);
    loadComments();
  };

  if (!isAuthenticated) {
    return <div className="text-center py-12 text-white">कृपया लॉगिन करा</div>;
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-white mb-6">टिप्पण्या</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'approved', 'spam', 'trash'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-gold-500 text-navy-900'
                : 'bg-navy-800 text-gray-400 hover:text-white'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-navy-800 rounded-xl p-5">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-bold">
                      {comment.author_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{comment.author_name}</p>
                      <p className="text-gray-500 text-sm">{comment.author_email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      comment.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      comment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      comment.status === 'spam' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {comment.status}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-3">{comment.content}</p>

                  {comment.articles && (
                    <p className="text-sm text-gray-500">
                      On: <span className="text-gold-400">{comment.articles[0]?.title || 'Unknown'}</span>
                    </p>
                  )}

                  <p className="text-xs text-gray-600 mt-2">
                    {format(new Date(comment.created_at), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>

                <div className="flex gap-2">
                  {comment.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusChange(comment.id, 'approved')}
                      className="p-2 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      title="Approve"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                  {comment.status !== 'spam' && (
                    <button
                      onClick={() => handleStatusChange(comment.id, 'spam')}
                      className="p-2 rounded bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                      title="Mark as Spam"
                    >
                      <Clock className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-2 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-navy-800 rounded-xl">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400">कोणत्याही टिप्पण्या नाहीत</p>
        </div>
      )}
    </AdminLayout>
  );
}
