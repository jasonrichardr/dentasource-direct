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
import ThemeToggle from '@/cinema/ThemeToggle';
import MarqueeSpeed from './MarqueeSpeed';

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
// /studio is the localhost editor: the room's dock over a text field is noise,
// and its document-level gesture listeners would start the music on the first
// click into a headline.
const ROOM_FREE_PREFIXES = ['/portal', '/admin', '/attendance', '/login', '/auth', '/api', '/team', '/studio'];

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
      {/* ☠️ ONE SWITCH, SITE WIDE, AND IT KEEPS THE ID. With the navbar gone this corner
          control is the only way to change register, so it mounts on every route; the
          room's 🌗 button proxies whatever carries id="theme-switch", and CSS in
          trust-marquee.css hides it while the room holds the screen. */}
      <ThemeToggle id="theme-switch" />
      {/* Every marquee, site wide, held at the speed measured on ffcdentalclinic.com.
          See src/lib/cinema/marquee.js for the numbers and how they were taken. */}
      <MarqueeSpeed />
      {!roomFree && <Room />}
      {!roomFree && <RoomChrome />}
    </ThemeProvider>
  );
}
