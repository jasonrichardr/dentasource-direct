'use client';

// ☠️ THE CHROME STANDS DOWN WHILE THE ROOM IS OPEN.
//
// The room hides the page with `.tx-open main { visibility: hidden }`, and that rule can
// only ever reach <main>. The Navbar, its trust marquee and the Footer are LAYOUT
// SIBLINGS of <main>, so at any stage opacity below 1 the nav links, the green Contact
// button and the marquee read straight through the open room. Measured by the room
// builder at the current .94 veil; it gets worse, not better, as the veil thins.
//
// So the chrome answers the room's own announcement instead: `dsd:room` carries
// { open: true|false }, and the only thing this component does is stamp a class on
// <html>. The hiding itself is CSS in navbar.css, which is also where the chrome's own
// paint lives. Nothing here reaches into src/cinema/room.
//
// The room dispatches open:false on unmount, but a route change that unmounts it
// mid-open would leave the class behind, so the cleanup clears it unconditionally.

import { useEffect } from 'react';

export const ROOM_OPEN_CLASS = 'dsd-room-open';

export default function RoomChrome() {
  useEffect(() => {
    const html = document.documentElement;
    const onRoom = (e) => {
      html.classList.toggle(ROOM_OPEN_CLASS, !!(e.detail && e.detail.open));
    };
    window.addEventListener('dsd:room', onRoom);
    return () => {
      window.removeEventListener('dsd:room', onRoom);
      html.classList.remove(ROOM_OPEN_CLASS);
    };
  }, []);

  return null;
}
