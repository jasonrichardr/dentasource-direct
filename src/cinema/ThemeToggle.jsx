'use client';

import { useTheme } from './ThemeProvider';

// `id` is optional and exists for one reason: the room's 🌗 proxy looks for
// #theme-switch first, so the navbar's toggle claims that id and the room drives it.
export default function ThemeToggle({ className = '', id }) {
  const { dark, toggle } = useTheme();
  return (
    <button
      id={id}
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
