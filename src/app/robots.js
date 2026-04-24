export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
      {
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'Claude-Web',
          'anthropic-ai',
          'PerplexityBot',
          'Google-Extended',
          'CCBot',
          'OAI-SearchBot',
          'Applebot-Extended',
          'Bytespider',
          'DuckAssistBot',
          'Amazonbot',
        ],
        allow: '/',
      },
    ],
    sitemap: 'https://dentasourcedirect.com/sitemap.xml',
  };
}
