import NewsSky from './NewsSky';

/**
 * One sky for every news route: the list, every article, and the standalone PDA page.
 * Mounting it here rather than in each page means there is exactly one #sky per view,
 * which is the contract the room was ported against.
 *
 * This layout adds no markup of its own, so the metadata and JSON-LD each page exports
 * are untouched.
 */
export default function NewsLayout({ children }) {
  return (
    <>
      <NewsSky />
      {children}
    </>
  );
}
