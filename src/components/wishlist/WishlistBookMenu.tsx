import { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';

interface WishlistBookMenuProps {
  bookTitle?: string;
  disabled?: boolean;
}

export function WishlistBookMenu({ bookTitle = 'book', disabled = true }: WishlistBookMenuProps) {
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
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        aria-label={`More options for ${bookTitle}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-disabled={disabled}
        className="rounded-lg bg-white/90 p-1.5 text-gray-400 shadow-sm transition-colors hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-navy-800/90 dark:text-gray-500 dark:hover:text-gray-300"
      >
        <MoreVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && !disabled ? (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-navy-700 dark:bg-navy-800"
        >
          <button
            type="button"
            role="menuitem"
            aria-disabled="true"
            title="Coming soon"
            className="block w-full cursor-default px-4 py-2 text-left text-sm text-red-500 opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-400/50 dark:text-red-400"
          >
            Remove from Wishlist
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default WishlistBookMenu;
