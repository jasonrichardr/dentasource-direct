'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle({ className = '' }) {
  const { dark, toggle } = useTheme();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`cinema-switch ${className}`.trim()}
      onClick={toggle}
    >
      <span className="cinema-switch-word">{dark ? 'Dark' : 'Light'}</span>
      <span className="cinema-switch-knob">
        <span className="cinema-switch-ico" aria-hidden="true">{dark ? '☾' : '☀'}</span>
      </span>
    </button>
  );
}
