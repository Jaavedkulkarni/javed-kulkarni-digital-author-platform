import { FormEvent, useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { HomeReaderClubIllustration } from './HomeReaderClubIllustration';
import { HomeSectionHeader } from './HomeSectionHeader';

interface HomeReaderClubSectionProps {
  darkMode?: boolean;
}

export function HomeReaderClubSection({ darkMode = true }: HomeReaderClubSectionProps) {
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
      className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900"
    >
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-gold-500/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-gold-400/30 via-transparent to-transparent pointer-events-none" />

      <div className="section-container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <HomeReaderClubIllustration />

          <div className="text-center lg:text-left">
            <HomeSectionHeader
              titleMr="वाचक क्लब"
              subtitle="Reader Club"
              darkMode
              className="!text-left lg:!text-left [&>h2]:!text-white [&>p]:!text-gray-400 [&>div]:!mx-0 lg:[&>h2]:!text-left lg:[&>p]:!text-left"
            />
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 -mt-2">
              नवीन लेख, पुस्तक अपडेट्स आणि लेखन प्रवासातील बातम्या — सरळ तुमच्या ईमेलमध्ये.
            </p>

            <form
              onSubmit={handleSubmit}
              className={`flex flex-col gap-4 max-w-lg mx-auto lg:mx-0 p-6 sm:p-8 rounded-2xl border ${
                darkMode ? 'bg-navy-800/60 border-navy-700/80' : 'bg-white/10 border-white/20'
              }`}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="तुमचा ईमेल"
                required
                className="w-full px-5 py-4 rounded-xl bg-white/95 text-navy-900 placeholder-navy-700/50 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm sm:text-base shadow-sm"
              />
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center disabled:opacity-50"
              >
                {submitting ? 'Please wait...' : 'सब्स्क्राईब करा'}
              </button>
            </form>

            {status && (
              <p className={`text-sm mt-4 ${status.success ? 'text-gold-300' : 'text-red-300'}`}>{status.message}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeReaderClubSection;
