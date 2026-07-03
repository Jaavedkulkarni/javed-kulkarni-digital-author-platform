import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ScrollToTopButton() {
  const { darkMode } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="वर जा"
      className={`fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
        darkMode
          ? 'bg-gold-500 text-navy-900 hover:bg-gold-400'
          : 'bg-navy-800 text-white hover:bg-navy-700 border border-gold-400/50'
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}

export default ScrollToTopButton;
