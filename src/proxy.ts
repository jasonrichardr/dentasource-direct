import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Refreshes the Supabase session on every request and gates /admin/* and /portal/*
// to signed-in users (redirecting to /login). Per-page checks then narrow further:
// /admin pages require an owner email (src/lib/admin.js); /portal is any signed-in user.
// Social/link-preview crawlers send a Range header and will not parse OG tags
// from a 206 Partial Content response. Strip Range for crawler user-agents so
// they get clean 200s (ported from the Netlify edge function on migration to
// Vercel, 2026-09-02). Crawlers need no session, so this returns early.
const CRAWLER_UA =
  /facebookexternalhit|facebot|twitterbot|slackbot|discordbot|whatsapp|linkedinbot|telegrambot|pinterest|redditbot|skypeuripreview|embedly|applebot|googlebot|bingbot|vkshare|w3c_validator/;

export default async function proxy(request: NextRequest) {
  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  if (CRAWLER_UA.test(ua) && request.headers.has('range')) {
    const stripped = new Headers(request.headers);
    stripped.delete('range');
    return NextResponse.next({ request: { headers: stripped } });
  }

  // ☠️ THE STUDIO DOES NOT EXIST IN PRODUCTION. /studio and /api/studio/* are a
  // localhost editor that WRITES TO THE SOURCE TREE. The page and every route
  // handler already refuse in production on their own, but notFound() inside a
  // streamed page can only render the not-found body AFTER the 200 has been
  // committed, which leaves a soft 404. This is the hard one, and it is first
  // in the file on purpose: there is no reason to refresh a session for a
  // request that is about to be refused.
  if (process.env.NODE_ENV === 'production') {
    const p = request.nextUrl.pathname;
    if (p === '/studio' || p.startsWith('/studio/') || p.startsWith('/api/studio')) {
      return new NextResponse(null, { status: 404 });
    }
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do NOT run logic between createServerClient and getUser() — it refreshes the token.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const protectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/portal');
  if (protectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    // crawler Range-strip coverage for the OG image + share video statics
    '/images/og/:path*',
    '/videos/dsd-share-grid.mp4',
  ],
};
