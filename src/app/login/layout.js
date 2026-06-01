// Server-component layout for /login so we can set route metadata.
// The login page itself is a client component and cannot export metadata.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }) {
  return children;
}
