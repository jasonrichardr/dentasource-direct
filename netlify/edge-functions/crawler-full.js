// Social/link-preview crawlers (Facebook, etc.) send a `Range` header, which makes
// Netlify return a 206 Partial Content response — and crawlers WON'T parse Open Graph
// tags from a 206. Stripping Range for crawler user-agents forces a clean 200 so the
// og:image / og:video / og:title are read correctly. No effect on real visitors.
export default async (request, context) => {
  try {
    const ua = (request.headers.get("user-agent") || "").toLowerCase();
    const isCrawler = /facebookexternalhit|facebot|twitterbot|slackbot|discordbot|whatsapp|linkedinbot|telegrambot|pinterest|redditbot|skypeuripreview|embedly|applebot|googlebot|bingbot|vkshare|w3c_validator/.test(ua);
    if (isCrawler) request.headers.delete("range");
  } catch (_) { /* never break the request */ }
  return context.next();
};
