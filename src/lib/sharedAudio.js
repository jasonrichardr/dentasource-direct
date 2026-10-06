// ONE AudioContext for the whole page (2026-10-06).
//
// ☠️ TWO CONTEXTS DOUBLED THE MUSIC ON A PHONE. The music room routes its player through an
// AudioContext built on the first tap (createMediaElementSource, for the wall's visualiser), and
// the glass buttons' tick (lib/glassFx) was building a SECOND context on the same tap's release.
// Jarich heard the song play twice when he pressed a button. iOS treats each new context as an
// audio session change, and a second context arriving on top of a routed media element is the
// known way to get it heard down two paths. Every sound on the site now asks for this one.
//
// It is recreated if somebody closed it (the room closes its context when it unmounts), so the
// buttons keep ticking on a route without the room.
let shared = null;

export function getAudioContext() {
  try {
    if (!shared || shared.state === 'closed') {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      shared = new AC();
    }
    return shared;
  } catch (e) {
    return null;
  }
}
