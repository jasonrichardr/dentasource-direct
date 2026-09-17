// Beyond the chair, with JDev Studio (2026-09-17). Three modules; the trading one is education only.
export const JDEV = {
  name: 'JDev Studio',
  logo: '/images/brand/jdev-mark.png',
  line: 'The studio that builds DentaSource Direct\'s software teaches what it knows: the internet of money, the discipline of reading a chart, and how software gets built now.',
};

export const JDEV_MODULES = [
  {
    id: 'crypto',
    label: 'Cryptocurrency and Blockchain basics',
    promise: 'From your first wallet to reading a whitepaper without fear.',
    topics: [
      'How a blockchain works: blocks, hashes, SHA-256, proof of work and proof of stake',
      'Networks and rails: Bitcoin, Ethereum, layer 2s, stablecoins, how a payment settles',
      'Reading a whitepaper, and how to write one people take seriously',
      'Tokenomics: supply, emissions, unlocks, market cap versus fully diluted value',
      'What moves the market: news, regulation, industry cycles, macro',
      'NFTs: minting, metadata, royalties, what is actually on chain',
      'Wallet hygiene: seed phrases, scams, custody, taxes in the Philippines',
    ],
    leave: 'You leave able to explain a token in two minutes and spot a bad one in one.',
  },
  {
    id: 'trading',
    label: 'Trading with Japanese candlesticks, RSI and MACD only',
    promise: 'Three tools, one plan, no noise.',
    topics: [
      'Candlesticks: what each body and wick says, the dozen patterns worth knowing',
      'RSI: overbought and oversold, divergence, what it cannot tell you',
      'MACD: crossovers, histogram, trend versus chop',
      'One written plan: entry, invalidation, size, exit, before you click',
      'Discipline: FOMO, revenge trades, journaling every trade, when not to trade',
      'What news, industry, and time of day do to a chart',
    ],
    leave: 'You leave with a rule set you can follow on a bad day, not just a good one.',
    note: 'Education only. Nothing here is financial advice. Trade only what you can afford to lose.',
  },
  {
    id: 'agentic',
    label: 'Software and Agentic Engineering',
    promise: 'Build real tools with AI agents, the way this site and DentaDesk were built.',
    topics: [
      'Vibe coding that ships: spec first, then build, then verify with evidence',
      'Agents that use tools: browsers, terminals, databases, your own APIs',
      'Claude Code, skills, memory, and the loop that keeps an agent honest',
      'Web apps from zero: Next.js, a database, a deploy, a domain, in a day',
      'Automations for a clinic or a shop: intake, follow-ups, reports',
      'Security and privacy basics for anything that touches patients or money',
    ],
    leave: 'You leave with a working app of your own online and the habit of checking it.',
  },
];
