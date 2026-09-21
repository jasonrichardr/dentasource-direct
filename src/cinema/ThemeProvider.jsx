'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { applyTheme, rememberTheme, resolveTheme } from './theme/theme';

const ThemeContext = createContext({ theme: 'dark', dark: true, toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children, initial = 'dark' }) {
  const [theme, setTheme] = useState(initial);

  // The head script already stamped <html>; read that back so the first client render
  // agrees with what is on screen. Nothing else may change the mode: dark is the default
  // and the toggle is the only door out of it.
  useEffect(() => {
    const attr = document.documentElement.getAttribute('data-theme');
    const mode = attr === 'light' || attr === 'dark' ? attr : resolveTheme();
    applyTheme(mode);
    setTheme(mode);
  }, []);

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
