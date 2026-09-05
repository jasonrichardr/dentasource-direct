'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { applyTheme, rememberTheme, resolveTheme, watchSystemTheme } from './theme/theme';

const ThemeContext = createContext({ theme: 'dark', dark: true, toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children, initial = 'dark' }) {
  const [theme, setTheme] = useState(initial);

  // The head script already stamped <html>; read that back so the first client render
  // agrees with what is on screen, then keep listening to the device.
  useEffect(() => {
    const attr = document.documentElement.getAttribute('data-theme');
    const mode = attr === 'light' || attr === 'dark' ? attr : resolveTheme();
    applyTheme(mode);
    setTheme(mode);
    return watchSystemTheme((next) => { applyTheme(next); setTheme(next); });
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
