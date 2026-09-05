'use client';

// The client seam of the root layout. Two things live here and nowhere else:
//
//   ThemeProvider — one provider for the WHOLE site, so the toggle in the navbar and the
//   cinema on the page are reading the same state. ThemeScript in <head> has already
//   stamped data-theme before paint; the provider reads that back rather than guessing.
//
//   Room — the music room, mounted ONCE. It is a fixed dock, so it does not care where
//   in the tree it sits, and mounting it here is what puts it on every page instead of
//   on the home page alone.

import ThemeProvider from '@/cinema/ThemeProvider';
import Room from '@/cinema/room';

export default function SiteShell({ children }) {
  return (
    <ThemeProvider>
      {children}
      <Room />
    </ThemeProvider>
  );
}
