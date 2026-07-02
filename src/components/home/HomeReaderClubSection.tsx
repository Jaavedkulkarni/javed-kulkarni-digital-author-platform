import { FormEvent, useState } from 'react';
import { useBlog } from '../../context/BlogContext';

export function HomeReaderClubSection() {
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
    <section
      id="reader-club"
      className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900"
    >
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-gold-500/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-gold-400/30 via-transparent to-transparent pointer-events-none" />

      <div className="section-container relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">वाचक क्लब</h2>
          <p className="text-gold-300/90 text-base sm:text-lg mb-6">Reader Club</p>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            नवीन लेख, पुस्तक अपडेट्स आणि लेखन प्रवासातील बातम्या — सरळ तुमच्या ईमेलमध्ये.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="तुमचा ईमेल"
              required
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/95 text-navy-900 placeholder-navy-700/50 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm sm:text-base"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 font-semibold hover:from-gold-500 hover:to-gold-600 transition-all text-sm sm:text-base disabled:opacity-50 shadow-lg shadow-gold-500/20"
            >
              {submitting ? 'Please wait...' : 'सब्स्क्राईब करा'}
            </button>
          </form>

          {status && (
            <p className={`text-sm ${status.success ? 'text-gold-300' : 'text-red-300'}`}>{status.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default HomeReaderClubSection;
