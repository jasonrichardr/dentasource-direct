'use client';

import { createContext, useCallback, useContext, useLayoutEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { applyTheme, rememberTheme, themeFor } from './theme/theme';

const ThemeContext = createContext({ theme: 'dark', dark: true, toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children, initial = 'dark' }) {
  const [theme, setTheme] = useState(initial);

  const pathname = usePathname();

  // The head script already stamped <html> for the route the visitor landed on. This keeps
  // the stamp true as they move between routes without a reload: a light-only route (the
  // chair pages) turns the page light on arrival, and leaving it gives back the remembered
  // tap or the default. A layout effect, so the turn lands before the new route paints.
  useLayoutEffect(() => {
    const mode = themeFor(pathname);
    applyTheme(mode);
    setTheme(mode);
  }, [pathname]);

  const toggle = useCallback(() => {
    setTheme((cur) => {
      const next = cur === 'dark' ? 'light' : 'dark';
      rememberTheme(next);
      applyTheme(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, dark: theme === 'dark', toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
