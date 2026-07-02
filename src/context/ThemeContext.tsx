import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

const STORAGE_KEY = 'darkMode';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function readStoredTheme(): boolean {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : false;
}

function applyThemeClass(darkMode: boolean) {
  document.documentElement.classList.toggle('dark', darkMode);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkModeState] = useState(readStoredTheme);

  useEffect(() => {
    applyThemeClass(darkMode);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(darkMode));
  }, [darkMode]);

  const setDarkMode = useCallback((value: boolean) => {
    setDarkModeState(value);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkModeState((prev) => !prev);
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export default ThemeProvider;
