import { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';

interface BookMenuProps {
  bookTitle?: string;
  disabled?: boolean;
  className?: string;
}

const MENU_ITEMS = ['View Details', 'Add to Wishlist', 'Share', 'Remove'] as const;

export function BookMenu({ bookTitle = 'book', disabled = true, className = '' }: BookMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          if (!disabled) setOpen((prev) => !prev);
        }}
        aria-label={`More options for ${bookTitle}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-disabled={disabled}
        className="rounded-lg bg-white/90 p-1.5 text-gray-400 shadow-sm transition-colors hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-navy-800/90 dark:text-gray-500 dark:hover:text-gray-300"
      >
        <MoreVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && !disabled ? (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-navy-700 dark:bg-navy-800"
        >
          {MENU_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              role="menuitem"
              disabled
              className="block w-full px-4 py-2 text-left text-sm text-gray-600 opacity-70 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold-400/50 dark:text-gray-300"
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default BookMenu;
