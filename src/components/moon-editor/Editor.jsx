'use client';

// The home page's marquee editor: the root that MoonGate imports after seven taps on the moon.
//
//   not signed in  a GlassSheet, "Edit the marquees", one glass button that opens the
//                  console's /www-bridge popup and takes back the seat's token
//   signed in      every home strip the console holds (people, showroom, training,
//                  nationwide, crew, heart) is drawn by EditStrip in place of its marquee,
//                  through the moonEdit seam, and a floating glass bar reads
//                  "Editing · Done · Sign out"
//
// Done leaves edit mode and keeps the sign-in for this tab (the next seven taps go straight
// in); Sign out forgets it.

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Check, LogOut, PencilLine, Undo2, X } from 'lucide-react';
import { GlassSheet } from '@/components/site/FfcSheets';
import { setMoonEditor } from '@/lib/cinema/moonEdit';
import EditStrip from './EditStrip';
import { openBridge, tokenFresh } from './wwwClient';
import { dismissToast, getEdit, loadDecks, signOut, signedIn, toast, useEdit } from './editStore';
import './moon-editor.css';

const EDITOR = { Strip: EditStrip };

function useSignIn() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  // must run inside the tap: a popup opened after an await is blocked
  const start = () => {
    setError(null);
    setBusy(true);
    openBridge()
      // a first sign-in reads the strips through the effect below; a second one (the sign-in
      // ran out mid-edit) re-reads them here so the view matches the console again
      .then((session) => { const had = !!getEdit().decks; signedIn(session); return had ? loadDecks() : null; })
      .catch((e) => setError(e && e.message ? e.message : 'Sign-in did not finish.'))
      .finally(() => setBusy(false));
  };
  return { busy, error, start };
}

function Toast() {
  const { toast: t } = useEdit();
  if (!t) return null;
  return (
    <div className={`me-toast is-${t.tone}`} role="status" aria-live="polite">
      <span>{t.text}</span>
      {t.undo ? (
        <button type="button" className="lg lg-sm" onClick={() => { void t.undo(); }}>
          <Undo2 size={14} /> Undo
        </button>
      ) : null}
      <button type="button" className="me-toast-x" aria-label="Dismiss" onClick={dismissToast}><X size={14} /></button>
    </div>
  );
}

export default function Editor({ onClose }) {
  const st = useEdit();
  const signIn = useSignIn();
  const [leaving, setLeaving] = useState(false);
  const signed = !!st.session && tokenFresh(st.session.token);
  const editing = signed && !!st.decks;

  // a sign-in kept from earlier in this tab: read the strips straight away
  useEffect(() => {
    if (signed && !st.decks && !st.loading && !st.loadError) void loadDecks();
  }, [signed, st.decks, st.loading, st.loadError]);

  // edit mode on every panel while signed in with the strips loaded; off on the way out
  useEffect(() => {
    setMoonEditor(editing && !leaving ? EDITOR : null);
  }, [editing, leaving]);
  useEffect(() => () => setMoonEditor(null), []);

  // Done: the strips go back to the marquees at once, the sentence stays a moment, then the
  // editor unmounts (the sign-in stays for this tab, so seven taps go straight back in)
  useEffect(() => {
    if (!leaving) return undefined;
    const id = setTimeout(onClose, 4200);
    return () => clearTimeout(id);
  }, [leaving, onClose]);

  const done = () => {
    setMoonEditor(null);
    toast('Saved. Visitors see your changes within a minute; reload then to see them here.', 'ok');
    setLeaving(true);
  };
  const leave = () => {
    signOut();
    setMoonEditor(null);
    onClose();
  };

  if (!signed) {
    return (
      <GlassSheet open onClose={onClose} label="Edit the marquees">
        <Image className="as-logo" src="/cinema/brand/dsd-round.png" alt="" width={84} height={84} />
        <div className="as-kicker">Home page</div>
        <h2 className="as-head">Edit the marquees</h2>
        <p className="as-p">
          Sign in with your console seat to remove, swap and add photos and set the timing of every strip on this
          page. Each change saves at once and visitors see it within a minute.
        </p>
        <button type="button" className="lg lg-primary me-signin" onClick={signIn.start} disabled={signIn.busy}>
          {signIn.busy ? 'Waiting for the console...' : 'Sign in with the console'}
        </button>
        {signIn.error ? <p className="me-err" role="alert">{signIn.error}</p> : null}
      </GlassSheet>
    );
  }

  // only ever rendered in the browser (MoonGate imports this after a tap), so document is there
  if (leaving) return createPortal(<Toast />, document.body);
  return createPortal(
    <>
      <Toast />
      <div className="me-bar" role="toolbar" aria-label="Marquee editor">
        <span className="me-bar-state">
          <PencilLine size={15} aria-hidden="true" />
          <span>Editing</span>
          {st.session.name ? <span className="me-bar-who">{st.session.name}</span> : null}
        </span>
        {st.loadError ? <button type="button" className="lg lg-sm" onClick={() => void loadDecks()}>Retry</button> : null}
        {st.signInLost ? (
          <button type="button" className="lg lg-sm lg-gold" onClick={signIn.start} disabled={signIn.busy}>Sign in again</button>
        ) : null}
        <button type="button" className="lg lg-sm lg-primary" onClick={done}><Check size={14} /> Done</button>
        <button type="button" className="lg lg-sm" onClick={leave}><LogOut size={14} /> Sign out</button>
      </div>
      {signIn.error && st.signInLost ? <p className="me-err me-err-float" role="alert">{signIn.error}</p> : null}
    </>,
    document.body,
  );
}
