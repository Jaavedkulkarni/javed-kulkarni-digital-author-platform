import { FormEvent, useState } from 'react';
import { Facebook, Instagram, Mail, MapPin, Phone, Send } from 'lucide-react';
import { HomeSectionHeader } from './HomeSectionHeader';
import { SITE_CONTACT } from '../../lib/siteContact';

interface HomeContactSectionProps {
  darkMode: boolean;
}

export function HomeContactSection({ darkMode }: HomeContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Website Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${SITE_CONTACT.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-800/50' : 'bg-gray-50'}`}>
      <div className="section-container">
        <HomeSectionHeader titleMr="संपर्क" subtitle="Contact" darkMode={darkMode} />
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 max-w-5xl mx-auto">
          <div className="space-y-6">
            <a
              href={`mailto:${SITE_CONTACT.email}`}
              className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
                darkMode ? 'bg-navy-800 border border-navy-700 hover:border-gold-500/30' : 'bg-white shadow-md border border-gray-100'
              }`}
            >
              <Mail className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <div>
                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-navy-800'}`}>{SITE_CONTACT.email}</p>
              </div>
            </a>
            <div
              className={`flex items-center gap-3 p-4 rounded-xl ${
                darkMode ? 'bg-navy-800 border border-navy-700' : 'bg-white shadow-md border border-gray-100'
              }`}
            >
              <Phone className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <div>
                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                  <a href={`mailto:${SITE_CONTACT.email}`} className="hover:text-gold-400 transition-colors">
                    Contact via Email
                  </a>
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-3 p-4 rounded-xl ${
                darkMode ? 'bg-navy-800 border border-navy-700' : 'bg-white shadow-md border border-gray-100'
              }`}
            >
              <MapPin className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <div>
                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location</p>
                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-navy-800'}`}>{SITE_CONTACT.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={SITE_CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-lg bg-brand text-white hover:bg-brand-hover flex items-center justify-center transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONTACT.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-lg bg-brand text-white hover:bg-brand-hover flex items-center justify-center transition-all duration-300"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`p-6 sm:p-8 rounded-2xl space-y-4 ${
              darkMode ? 'bg-navy-800 border border-navy-700' : 'bg-white shadow-lg border border-gray-100'
            }`}
          >
            <div>
              <label htmlFor="contact-name" className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-navy-700'}`}>
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                  darkMode ? 'bg-navy-900 border border-navy-700 text-white' : 'bg-gray-50 border border-gray-200 text-navy-900'
                }`}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-navy-700'}`}>
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                  darkMode ? 'bg-navy-900 border border-navy-700 text-white' : 'bg-gray-50 border border-gray-200 text-navy-900'
                }`}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-navy-700'}`}>
                Message
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className={`w-full px-4 py-3 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                  darkMode ? 'bg-navy-900 border border-navy-700 text-white' : 'bg-gray-50 border border-gray-200 text-navy-900'
                }`}
              />
            </div>
            <button type="submit" className="btn-primary w-full sm:w-auto">
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default HomeContactSection;
