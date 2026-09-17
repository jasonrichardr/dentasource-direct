// Beyond the chair, with JDev Studio. Round 4 (2026-09-17): four tracks, every one opens as a sheet so the
// block stays short on scroll. Crypto and Trading are written in full; Software and Agentic Engineering is the
// ten-module FFC list; Practice Business is the clinic-business track. Education only, never financial advice.
import { SAE } from './ffcmodules';
import { TRACK_MODULES } from './trackmodules';

const M = (title, points) => ({ title, points });

export const JDEV = {
  name: 'JDev Studio',
  logo: '/images/brand/jdev-mark.png',
  person: { name: 'Jason Richard Ramirez', title: 'Founder · JDev Studio and DentaSource Direct', photo: '/gp/people/jarich.png' },
  line: 'The studio that builds DentaSource Direct\'s software teaches what it knows: the internet of money, the discipline of reading a chart, how software gets built now, and how a clinic runs as a business.',
};

export const JDEV_MODULES = [
  {
    id: 'crypto',
    label: 'Cryptocurrency and Blockchain',
    promise: 'From your first wallet to reading a whitepaper without fear.',
    leave: 'You leave able to explain a token in two minutes and spot a bad one in one.',
    lead: 'Eight modules on how the chain works, what rides on it, how to read what people publish about it, and how to keep your head. Visual first: tokens, networks, market cap and the whole ecosystem drawn out, and every node opens.',
    visuals: ['tokens', 'network', 'marketcap', 'ecosystem'],
    modules: [
      M('Module 1 · What a blockchain is', ['A ledger everyone holds a copy of, and why that matters', 'Blocks, hashes and SHA-256: how one block locks the one before it', 'Proof of work versus proof of stake, in plain words', 'Miners, validators and who gets paid for what']),
      M('Module 2 · Networks and rails', ['Bitcoin: money first, nothing else', 'Ethereum: a computer you pay by the step (gas)', 'Layer 2s: Lightning, Arbitrum, Base and why they exist', 'Solana, BNB and the other chains: what each trades off', 'How a payment actually settles, block by block']),
      M('Module 3 · Wallets and custody', ['Hot wallets, cold wallets, hardware', 'Seed phrases: the twelve words that are the money', 'Exchange custody versus self custody', 'Sending your first transaction on a testnet']),
      M('Module 4 · Reading a whitepaper', ['What a whitepaper must answer: problem, mechanism, incentive, team', 'The Bitcoin whitepaper, page by page', 'Red flags: vague mechanism, guaranteed yield, no code', 'Writing one people take seriously: structure and honesty']),
      M('Module 5 · Tokenomics and market cap', ['Supply: total, circulating, max', 'Emissions, vesting and unlock cliffs', 'Market cap = price × circulating supply, and why price alone is meaningless', 'Fully diluted value and the dilution trap', 'Utility, governance and meme tokens: what gives a token a reason to exist']),
      M('Module 6 · What moves the market', ['News: listings, hacks, lawsuits and how fast they land', 'Regulation: the SEC, the BSP and what a rule change does', 'Industry drivers: ETFs, halving cycles, institutional flows', 'Macro: rates, the dollar and risk appetite', 'Reading a news item without reacting to it']),
      M('Module 7 · NFTs and smart contracts', ['What is actually on chain, and what is just a link', 'Minting: metadata, royalties, the contract behind it', 'Creating a collection on a testnet, end to end', 'Smart contracts and DeFi basics: lending, swapping, staking']),
      M('Module 8 · Discipline, scams and taxes', ['FOMO: the physiology of a green candle', 'Rug pulls, phishing, fake support and airdrop traps', 'Position sizing: never more than you can lose entirely', 'Taxes in the Philippines: what the BIR expects, records to keep']),
    ],
  },
  {
    id: 'trading',
    label: 'Trading: candlesticks, RSI and MACD only',
    promise: 'Three tools, one plan, no noise.',
    leave: 'You leave with a rule set you can follow on a bad day, not just a good one.',
    lead: 'Seven modules and three tools. No indicators beyond these three, on purpose: a trader who reads candles, RSI and MACD well has more than most. The charts below are drawn from one series so you can see all three tell the same story.',
    visuals: ['candles', 'rsi', 'macd', 'timeframes'],
    note: 'Education only. Nothing here is financial advice. Trade only what you can afford to lose.',
    modules: [
      M('Module 1 · Japanese candlesticks', ['Open, high, low, close: what the body and the wicks say', 'Doji, hammer, engulfing, shooting star: the dozen patterns worth knowing', 'Timeframes: the same candle on the 1 hour and the 1 day', 'Support, resistance and where candles cluster']),
      M('Module 2 · RSI', ['The 0 to 100 line: momentum, not price', 'Overbought above 70, oversold below 30, and why that is not a signal on its own', 'Divergence: price makes a new high, RSI does not', 'What RSI cannot tell you']),
      M('Module 3 · MACD', ['Two moving averages and the gap between them', 'Signal line crossovers and the histogram', 'Trend versus chop: when MACD lies', 'Putting RSI and MACD side by side']),
      M('Module 4 · One written plan', ['Entry, invalidation, size, exit, before you click', 'Risk per trade as a percentage, never a feeling', 'Reward to risk and why 1:2 changes everything', 'Backtesting the plan on old charts']),
      M('Module 5 · Discipline', ['FOMO and revenge trades: recognising them in your body', 'Journaling every trade: the template', 'When not to trade: news days, tired days, angry days', 'Reviewing a month of trades honestly']),
      M('Module 6 · News, industry and time of day', ['What a headline does to a chart in the first ten minutes', 'Sessions: Asia, London, New York and volume', 'Weekends and thin books', 'Building a weekly routine']),
      M('Module 7 · Timeframes: 1m to 1W, and the timeline as a whole', ['What one candle really is on 1m, 5m, 10m, 30m, 1h, 4h, 12h, 1D and 7D: who trades it and what it can and cannot tell you', 'Top-down reading: 1W and 1D for direction, 4h and 1h for structure, 15m and 5m only for timing the entry', 'The same event on every timeframe: a crash on 5m is a wick on 1D; where to look on each chart and what the number under it means', 'Nesting: every 1h candle holds twelve 5m candles; reading the story inside a candle instead of the candle alone', 'Choosing your timeframe by your life, not by excitement: chair time, sleep and how often you can look', 'The whole timeline: cycles on 1W, trends on 1D, swings on 4h, noise below']),
    ],
  },
  {
    id: 'agentic',
    label: 'Software and Agentic Engineering',
    promise: 'Build real tools with AI agents, the way this site and DentaDesk were built.',
    leave: 'You leave with a working app of your own online and the habit of checking it.',
    lead: SAE.lead,
    modules: SAE.modules,
  },
  {
    id: 'practice',
    label: 'Practice Business',
    promise: 'Run the clinic as a business, with your numbers in one place.',
    leave: 'You leave with your numbers in one place and a plan for the year.',
    lead: TRACK_MODULES.business.lead,
    modules: TRACK_MODULES.business.modules,
  },
];

// The crypto ecosystem, drawn as a graph. Hubs on the inner ring, topics on the outer ring; every topic opens a
// blurb and points at the module that teaches it.
export const ECOSYSTEM = [
  { id: 'consensus', label: 'Consensus', color: '#f7931a', nodes: [
    { id: 'pow', label: 'Proof of work', module: 1, blurb: 'Miners race to find a hash below a target. Whoever wins writes the next block and earns the reward. Expensive on purpose: rewriting history would cost more than it pays.' },
    { id: 'pos', label: 'Proof of stake', module: 1, blurb: 'Validators lock up coins as a bond and take turns proposing blocks. Cheat and the bond is burned. Ethereum moved here in 2022; it uses a fraction of the energy.' },
    { id: 'sha', label: 'SHA-256', module: 1, blurb: 'The hash function under Bitcoin. Any input, a fixed 64-character fingerprint, impossible to reverse. Change one letter and the whole fingerprint changes, which is how a block locks the one before it.' },
    { id: 'nodes', label: 'Nodes and miners', module: 1, blurb: 'A node keeps a full copy of the ledger and checks every rule. A miner or validator also proposes blocks. Thousands of independent copies are what makes the chain hard to fake.' },
  ] },
  { id: 'networks', label: 'Networks', color: '#627eea', nodes: [
    { id: 'btc', label: 'Bitcoin', module: 2, blurb: 'The first chain, 2009. Fixed supply of 21 million, a new block about every ten minutes. Does one thing: moves value without a bank.' },
    { id: 'eth', label: 'Ethereum', module: 2, blurb: 'A chain that runs programs (smart contracts). Every step costs gas paid in ETH. Most tokens, NFTs and DeFi live here or on chains that copy it.' },
    { id: 'l2', label: 'Layer 2s', module: 2, blurb: 'Lightning for Bitcoin; Arbitrum, Base and Optimism for Ethereum. They bundle many transactions and settle to the main chain, so fees drop from dollars to cents.' },
    { id: 'alt', label: 'Solana, BNB and others', module: 2, blurb: 'Faster and cheaper chains that trade some decentralisation for speed. Useful to understand the trade-off rather than pick a favourite.' },
    { id: 'bridge', label: 'Bridges', module: 2, blurb: 'Move an asset from one chain to another by locking it on one side and minting a copy on the other. Also where the largest hacks have happened.' },
  ] },
  { id: 'money', label: 'Money', color: '#26a17b', nodes: [
    { id: 'stable', label: 'Stablecoins', module: 2, blurb: 'Tokens pegged to a currency, usually the US dollar: USDT, USDC. Most crypto trading and remittance actually moves in these, not in Bitcoin.' },
    { id: 'settle', label: 'Payments and settlement', module: 2, blurb: 'A transfer is final once enough blocks are stacked on top of it. Minutes on Bitcoin, seconds on a layer 2. No chargebacks, so the address must be right the first time.' },
    { id: 'cex', label: 'Exchanges', module: 3, blurb: 'Centralised exchanges (Binance, Coins.ph) hold your coins for you and match orders. Decentralised exchanges (Uniswap) swap tokens from a smart contract with no company in between.' },
    { id: 'ramp', label: 'On and off ramps', module: 3, blurb: 'Where pesos become crypto and back: GCash, bank transfer, Coins.ph, and the fees and limits that come with them.' },
  ] },
  { id: 'assets', label: 'Assets', color: '#e84393', nodes: [
    { id: 'token', label: 'Tokens', module: 5, blurb: 'A token is a balance kept by a smart contract, not a chain of its own. ERC-20 is the common standard on Ethereum. Anyone can create one in an afternoon, which is the point and the problem.' },
    { id: 'nft', label: 'NFTs', module: 7, blurb: 'A token with a serial number that points at one item. What is on chain is the record and a link; the image usually lives elsewhere. Useful for tickets, certificates and provenance, not only art.' },
    { id: 'contract', label: 'Smart contracts', module: 7, blurb: 'Programs that run on the chain exactly as written. No admin can pause them unless the code says so. Bugs are permanent, which is why audits exist.' },
    { id: 'defi', label: 'DeFi', module: 7, blurb: 'Lending, borrowing, swapping and earning yield from contracts instead of banks. Real rates come from real demand; a promised 30 percent usually comes from new deposits.' },
  ] },
  { id: 'reading', label: 'Reading', color: '#c9a227', nodes: [
    { id: 'wp', label: 'Whitepapers', module: 4, blurb: 'The document that explains a project: the problem, the mechanism, the incentives, the team. Nine pages for Bitcoin. If you cannot find the mechanism in ten minutes, that is your answer.' },
    { id: 'tokenomics', label: 'Tokenomics', module: 5, blurb: 'Who holds the supply, how fast new coins are created, when locked coins unlock. A token with 80 percent held by insiders unlocking next month is a chart you can predict.' },
    { id: 'mcap', label: 'Market cap and FDV', module: 5, blurb: 'Market cap is price times circulating supply. Fully diluted value uses the max supply. A cheap price on a huge supply is not cheap; compare caps, never prices.' },
    { id: 'unlock', label: 'Emissions and unlocks', module: 5, blurb: 'The schedule that mints new coins or releases locked ones. Every unlock is supply looking for a buyer. It is published; most people never read it.' },
  ] },
  { id: 'market', label: 'Market', color: '#38bdf8', nodes: [
    { id: 'news', label: 'News and regulation', module: 6, blurb: 'Listings, hacks, lawsuits, an SEC or BSP rule: each lands on the chart within minutes. Learn which kinds fade by the next day and which change the trend.' },
    { id: 'cycle', label: 'Cycles and halving', module: 6, blurb: 'Bitcoin cuts its block reward in half every four years. Every cycle so far has followed a similar shape; every cycle, people say this one is different.' },
    { id: 'macro', label: 'Macro', module: 6, blurb: 'Interest rates, the dollar and risk appetite move crypto the way they move tech stocks, only harder. When money is cheap, everything pumps; when it is not, everything is a risk asset.' },
    { id: 'flows', label: 'Institutions and ETFs', module: 6, blurb: 'Spot ETFs let pension funds and brokers hold Bitcoin without a wallet. Their flows are published daily and now move the market more than retail does.' },
  ] },
  { id: 'risk', label: 'Risk', color: '#f87171', nodes: [
    { id: 'fomo', label: 'FOMO and discipline', module: 8, blurb: 'The green candle you chase is the one somebody else is selling into. A written plan, a fixed position size and a journal are the whole cure.' },
    { id: 'scam', label: 'Scams and custody', module: 8, blurb: 'Rug pulls, fake support accounts, airdrop links that drain a wallet. Never type a seed phrase into a website. Not your keys, not your coins; also, your keys, your responsibility.' },
    { id: 'tax', label: 'Taxes in the Philippines', module: 8, blurb: 'Gains are income to the BIR. Keep every trade, transfer and peso conversion in a spreadsheet from day one. The exchange will not do it for you.' },
  ] },
];
