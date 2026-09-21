import { THEME_SCRIPT } from './theme/theme';

// Stamps data-theme on <html> before hydration, so there is no flash of the wrong theme.
export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
