import { Link } from 'react-router-dom';
import { Heart, Instagram, Facebook, Mail } from 'lucide-react';
import {
  AMAZON_STORE_URL,
  FOOTER_BOOK_CATEGORIES,
  FOOTER_QUICK_LINKS,
} from '../../lib/siteNavigation';
import { SITE_CONTACT } from '../../lib/siteContact';

interface SiteFooterProps {
  darkMode?: boolean;
}

export function SiteFooter({ darkMode = true }: SiteFooterProps) {
  return (
    <footer
      className={`pt-16 pb-16 mt-16 lg:mt-20 ${
        darkMode ? 'bg-navy-900 border-t border-navy-800' : 'bg-navy-800'
      }`}
    >
      <div className="section-container">
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-900 font-bold text-xl shadow-lg">
                ज
              </div>
              <div>
                <h3 className="text-white font-semibold text-xl">जावेद कुलकर्णी</h3>
                <p className="text-gold-400 text-sm">मराठी लेखक | ब्लॉगर | कथाकार</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              जिथे शब्द नाही, तर हृदय बोलतं. नातेसंबंध, पालकत्व, डिजिटल जीवन आणि आत्मविकासावर
              आधारित पुस्तके.
            </p>
            <a
              href={`mailto:${SITE_CONTACT.email}`}
              className="flex items-center gap-2 text-gray-300 hover:text-gold-400 transition-colors"
            >
              <Mail className="w-4 h-4" />
              {SITE_CONTACT.email}
            </a>
            <div className="mt-6">
              <p className="text-white font-semibold text-sm mb-3">Follow Javed Kulkarni</p>
              <div className="flex items-center gap-3">
                <a
                  href={SITE_CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-lg bg-navy-700 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={SITE_CONTACT.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-lg bg-navy-700 hover:bg-blue-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {FOOTER_QUICK_LINKS.map((item) =>
                'external' in item && item.external ? (
                  <li key={item.label}>
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gold-400 transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ) : (
                  <li key={item.label}>
                    <a href={item.path}
                     className="text-gray-400 hover:text-gold-400 transition-colors"
>                      {item.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">पुस्तक श्रेणी</h4>
            <ul className="space-y-3">
              {FOOTER_BOOK_CATEGORIES.map((name) => (
                <li key={name}>
                      <a href="/#categories"
                        className="text-gray-400 hover:text-gold-400 transition-colors"
    >                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy" className="text-gray-400 hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-gold-400 transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/refund" className="text-gray-400 hover:text-gold-400 transition-colors">Refund Policy</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-gold-400 transition-colors">Shipping Policy</Link></li>
              <li><Link to="/cookies" className="text-gray-400 hover:text-gold-400 transition-colors">Cookie Policy</Link></li>
              <li>  <a
    href="/#contact"
    className="text-gray-400 hover:text-gold-400 transition-colors"
  >
    Contact
  </a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Javed Kulkarni. All Rights Reserved.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">

              <p className="text-gray-500 text-sm flex items-center gap-1">
                Crafted with <Heart className="w-4 h-4 text-red-500" /> for Marathi Literature
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-xs text-center mt-4"></p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
