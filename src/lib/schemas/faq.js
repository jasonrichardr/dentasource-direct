export function faqGraph(questions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question || q.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer || q.a,
      },
    })),
  };
}
