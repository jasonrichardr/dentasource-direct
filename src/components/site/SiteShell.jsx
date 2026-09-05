'use client';

// The client seam of the root layout. Three things live here and nowhere else:
//
//   ThemeProvider — one provider for the WHOLE site, so the toggle in the navbar and the
//   cinema on the page are reading the same state. ThemeScript in <head> has already
//   stamped data-theme before paint; the provider reads that back rather than guessing.
//   It stays site-wide even on the working routes below: the navbar's toggle is rendered
//   there too, and a toggle with no provider is a dead control.
//
//   Room — the music room, mounted ONCE, and NOT everywhere. See the gate.
//
//   RoomChrome — the listener that stands the header and footer down while the room is
//   open. It only ships where the room does, because nothing else dispatches dsd:room.

import { usePathname } from 'next/navigation';
import ThemeProvider from '@/cinema/ThemeProvider';
import Room from '@/cinema/room';
import RoomChrome from './RoomChrome';

/**
 * ☠️ THE WORKING ROUTES GET NO ROOM.
 *
 * /portal, /admin, /attendance and the sign-in doors are somebody's JOB, not a page they
 * are browsing: a music dock floating over the leads inbox or the attendance sheet is a
 * toy in a workplace, and the overhaul plan says those routes stay exactly as they were.
 * The marketing pages, /news and /classic keep the room.
 *
 * Prefix matching, not equality, because these are route TREES: /admin/leads and
 * /auth/callback have to be caught as surely as /admin and /auth.
 */
const ROOM_FREE_PREFIXES = ['/portal', '/admin', '/attendance', '/login', '/auth', '/api', '/team'];

export function isRoomFree(pathname) {
  if (!pathname) return false;
  return ROOM_FREE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default function SiteShell({ children }) {
  const pathname = usePathname();
  const roomFree = isRoomFree(pathname);

  return (
    <ThemeProvider>
      {children}
      {!roomFree && <Room />}
      {!roomFree && <RoomChrome />}
    </ThemeProvider>
  );
}
