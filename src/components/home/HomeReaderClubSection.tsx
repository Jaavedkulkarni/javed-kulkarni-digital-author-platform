import { FormEvent, useState } from 'react';
import { useBlog } from '../../context/BlogContext';

interface HomeReaderClubSectionProps {
  darkMode: boolean;
}

export function HomeReaderClubSection({ darkMode }: HomeReaderClubSectionProps) {
  const { subscribeNewsletter } = useBlog();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await subscribeNewsletter(email);
    setStatus(result);
    setSubmitting(false);
    if (result.success) setEmail('');
  };

  return (
    <section id="reader-club" className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-800/50' : 'bg-gray-50'}`}>
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">वाचक क्लब</h2>
            <p className="text-navy-800/80 mb-6">नवीन लेख आणि अपडेट्स सरळ तुमच्या ईमेलमध्ये.</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="तुमचा ईमेल"
                required
                className="flex-1 px-4 py-3 rounded-lg text-navy-800 placeholder-navy-800/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-lg bg-navy-900 text-white font-semibold hover:bg-navy-800 transition-colors text-sm disabled:opacity-50"
              >
                {submitting ? 'Please wait...' : 'सब्स्क्राईब करा'}
              </button>
            </form>
            {status && (
              <p className={`mt-4 text-sm ${status.success ? 'text-navy-900' : 'text-red-900'}`}>{status.message}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeReaderClubSection;
