import './index-shell.css';

// /dentalchairs and /products are index pages, not cinema: they keep their current
// catalog layouts. This only hands them the shared theme tokens so the two indexes stop
// being the light-only holes in a dark site.
//
// No ThemeProvider and no ThemeToggle: SiteShell in the root layout mounts the site's one
// provider and the navbar carries the only toggle. Nothing here is interactive, so this
// stays a server component.
export default function IndexShell({ children }) {
  return <div className="pc-index">{children}</div>;
}
