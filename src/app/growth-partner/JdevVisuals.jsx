'use client';

// Visuals for the JDev sheets (round 4): teaching drawings, all SVG, no external images.
// Token marks are drawn for teaching and are not the official logos.
import { useMemo, useState } from 'react';
import { ECOSYSTEM } from '@/data/jdev';

// Real marks from the CC0 cryptocurrency-icons set (public/gp/crypto). Tap a card to open it.
const TOKENS = [
  { tick: 'BTC', name: 'Bitcoin', logo: '/gp/crypto/btc.svg', color: '#f7931a', net: 'Own chain · proof of work', what: 'The first cryptocurrency, 2009. Digital money with a fixed supply of 21 million and a new block about every ten minutes. It does one thing: move value without a bank.', who: 'Written by "Satoshi Nakamoto", still unknown. No company, no CEO; thousands of independent nodes enforce the rules.', moves: 'Halving cycles, ETF flows, interest rates and risk appetite. It leads the market; when BTC falls, almost everything falls harder.', watch: 'Fees rise when the network is busy. Sending to a wrong address is final.' },
  { tick: 'ETH', name: 'Ether', logo: '/gp/crypto/eth.svg', color: '#627eea', net: 'Own chain · proof of stake', what: 'The coin of Ethereum, a chain that runs programs (smart contracts). Every action costs gas paid in ETH. Most tokens, NFTs and DeFi live here or on chains that copy it.', who: 'Proposed by Vitalik Buterin in 2013, live since 2015. Open source, run by a foundation and thousands of developers.', moves: 'Network activity (gas burned), upgrades, layer-2 growth, ETF flows, and BTC.', watch: 'Gas spikes during hype. Staking locks coins; unlocks add supply.' },
  { tick: 'USDT', name: 'Tether', logo: '/gp/crypto/usdt.svg', color: '#26a17b', net: 'Stablecoin · rides on ETH, TRON, others', what: 'A token pegged to the US dollar, one USDT for one dollar. Most crypto trading and remittance actually moves in this, not in Bitcoin.', who: 'Issued by Tether Ltd, a private company that holds the dollars and bonds behind it.', moves: 'It should not move. A drop below one dollar means the market doubts the reserves.', watch: 'Which chain you send it on matters: USDT on TRON and USDT on Ethereum are different rails.' },
  { tick: 'USDC', name: 'USD Coin', logo: '/gp/crypto/usdc.svg', color: '#2775ca', net: 'Stablecoin · rides on ETH, Base, Solana', what: 'A dollar token like USDT, issued in the United States with audited reserves and a bank-style attitude. Preferred by institutions and regulated exchanges.', who: 'Circle, a US company, with Coinbase as its partner.', moves: 'Also should not move. Regulation news about stablecoins hits it first.', watch: 'Circle can freeze addresses under a court order; it is a company, not a protocol.' },
  { tick: 'SOL', name: 'Solana', logo: '/gp/crypto/sol.svg', color: '#9945ff', net: 'Own chain · proof of stake', what: 'A fast, cheap chain built for high volume: payments, games, and most of the meme-coin trading of the last cycle. Transactions settle in under a second for a fraction of a cent.', who: 'Solana Labs, founded by Anatoly Yakovenko, 2020.', moves: 'Retail activity, meme cycles, exchange listings, and outages.', watch: 'Speed comes from fewer, bigger validators. The chain has halted more than once.' },
  { tick: 'BNB', name: 'BNB', logo: '/gp/crypto/bnb.svg', color: '#f0b90b', net: 'Own chain · proof of staked authority', what: 'The coin of Binance, the largest exchange, and of BNB Chain, an Ethereum-style chain with cheap fees. Pays trading-fee discounts on Binance.', who: 'Binance, founded by Changpeng Zhao, 2017.', moves: 'Binance news, regulation against the exchange, quarterly coin burns.', watch: 'Tied to one company. Its chain is fast because it is small: a few dozen validators.' },
];

export function TokenRow() {
  const [open, setOpen] = useState(null);
  const t = TOKENS.find((x) => x.tick === open);
  return (
    <div className="viz">
      <p className="viz-t">Tokens and what they ride on. Tap one.</p>
      <div className="tokens">
        {TOKENS.map((k) => (
          <button type="button" key={k.tick} className={`token ${open === k.tick ? 'on' : ''}`} style={{ '--c': k.color }} onClick={() => setOpen(open === k.tick ? null : k.tick)} aria-expanded={open === k.tick}>
            <img src={k.logo} alt="" width="56" height="56" decoding="async" />
            <b>{k.tick}</b><small>{k.name}</small><em>{k.net}</em>
          </button>
        ))}
      </div>
      {t ? (
        <div className="token-open" style={{ borderColor: t.color }}>
          <div className="token-open-head"><img src={t.logo} alt="" width="40" height="40" /><div><b>{t.name} · {t.tick}</b><small>{t.net}</small></div></div>
          <p><b>What it is.</b> {t.what}</p>
          <p><b>Who is behind it.</b> {t.who}</p>
          <p><b>What moves it.</b> {t.moves}</p>
          <p><b>Watch out.</b> {t.watch}</p>
        </div>
      ) : null}
      <p className="viz-cap">A coin has its own chain. A token is a balance inside a contract on somebody else's chain. Stablecoins are tokens pegged to a currency.</p>
    </div>
  );
}

export function NetworkMap() {
  const N = [
    { id: 'btc', x: 110, y: 70, r: 34, c: '#f7931a', l: 'Bitcoin', s: 'L1', logo: '/gp/crypto/btc.svg', blurb: 'Layer 1. The base chain: slow (10 minutes a block), expensive when busy, and the most secure ledger ever run. Everything above borrows its security.' },
    { id: 'ln', x: 110, y: 170, r: 22, c: '#f7931a', l: 'Lightning', s: 'L2', blurb: 'Layer 2 on Bitcoin. Payment channels that settle instantly for almost nothing, then close back to the main chain. How Bitcoin buys coffee.' },
    { id: 'eth', x: 330, y: 70, r: 36, c: '#627eea', l: 'Ethereum', s: 'L1', logo: '/gp/crypto/eth.svg', blurb: 'Layer 1. A world computer: every node runs the same programs. Gas fees pay for the computation. Most tokens and NFTs live here.' },
    { id: 'arb', x: 250, y: 175, r: 22, c: '#627eea', l: 'Arbitrum', s: 'L2', blurb: 'Layer 2 on Ethereum (an optimistic rollup). Bundles thousands of transactions, posts a summary to Ethereum. Fees fall from dollars to cents.' },
    { id: 'base', x: 330, y: 190, r: 22, c: '#627eea', l: 'Base', s: 'L2', blurb: 'Layer 2 on Ethereum, run by Coinbase. Cheap, consumer-facing, and where much of the retail activity moved in the last cycle.' },
    { id: 'op', x: 410, y: 175, r: 22, c: '#627eea', l: 'Optimism', s: 'L2', blurb: 'Layer 2 on Ethereum. The same rollup idea as Arbitrum; Base is built on its code. Settles to Ethereum, inherits its security.' },
    { id: 'usdt', x: 530, y: 60, r: 24, c: '#26a17b', l: 'USDT', s: 'token', logo: '/gp/crypto/usdt.svg', blurb: 'A token, not a chain. The same dollar exists on Ethereum, TRON, Solana and more. Dashed lines: the rails it rides on.' },
    { id: 'usdc', x: 560, y: 140, r: 24, c: '#2775ca', l: 'USDC', s: 'token', logo: '/gp/crypto/usdc.svg', blurb: 'A token issued on many chains at once. Moving it between chains means a bridge or the issuer itself.' },
    { id: 'sol', x: 520, y: 220, r: 28, c: '#9945ff', l: 'Solana', s: 'L1', logo: '/gp/crypto/sol.svg', blurb: 'Layer 1, separate from Ethereum. Its own validators, its own tokens, its own speed. Assets cross to it only through bridges.' },
  ];
  const E = [['btc', 'ln'], ['eth', 'arb'], ['eth', 'base'], ['eth', 'op'], ['eth', 'usdt'], ['eth', 'usdc'], ['sol', 'usdc'], ['base', 'usdc']];
  const at = (id) => N.find((n) => n.id === id);
  const [sel, setSel] = useState(null);
  const S = sel ? at(sel) : null;
  const pick = (id) => setSel((c) => (c === id ? null : id));
  return (
    <div className="viz">
      <p className="viz-t">Networks: layer 1 chains, layer 2s on top, tokens riding across. Tap a node.</p>
      <svg className="viz-svg" viewBox="0 0 640 260" role="img" aria-label="Network diagram: Bitcoin with Lightning; Ethereum with Arbitrum, Base and Optimism; USDT and USDC riding on Ethereum, Base and Solana">
        {E.map(([a, b]) => { const A = at(a), B = at(b); const hot = sel && (a === sel || b === sel); return <line key={a + b} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={hot ? '#fff8e2' : 'rgba(201,162,39,.55)'} strokeWidth={hot ? 3 : 2} strokeDasharray={A.s === 'token' || B.s === 'token' ? '5 4' : '0'} />; })}
        {N.map((n) => (
          <g key={n.id} className={`net-node ${sel === n.id ? 'on' : ''}`} onClick={() => pick(n.id)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(n.id); } }} aria-label={`${n.l}, ${n.s}`}>
            <circle cx={n.x} cy={n.y} r={n.r + (sel === n.id ? 4 : 0)} fill={n.logo ? '#0d1326' : n.c} stroke={sel === n.id ? '#fff8e2' : n.c} strokeWidth={sel === n.id ? 3 : 1.5} opacity="0.95" />
            {n.logo ? <image href={n.logo} x={n.x - n.r + 4} y={n.y - n.r + 4} width={(n.r - 4) * 2} height={(n.r - 4) * 2} /> : <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="system-ui">{n.l}</text>}
            <text x={n.x} y={n.y + n.r + 14} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.75" fontFamily="system-ui">{n.logo ? `${n.l} · ${n.s}` : n.s}</text>
          </g>
        ))}
      </svg>
      {S ? <div className="eco-panel" style={{ borderColor: S.c }}><b>{S.l} · {S.s === 'token' ? 'token' : S.s === 'L1' ? 'layer 1' : 'layer 2'}</b><p>{S.blurb}</p></div>
        : <p className="viz-cap">Solid lines: a layer 2 settles to its layer 1. Dashed: a token issued on more than one chain. Fees fall as you move down; security is borrowed from the chain above.</p>}
    </div>
  );
}

export function MarketCapChart() {
  const rows = [
    { name: 'Coin A', price: 60000, supply: 20, cap: 1200 },
    { name: 'Coin B', price: 3, supply: 500, cap: 1500 },
    { name: 'Coin C', price: 0.002, supply: 900000, cap: 1800 },
  ];
  const max = 1800; const W = 640;
  return (
    <div className="viz">
      <p className="viz-t">Market cap = price × circulating supply</p>
      <svg className="viz-svg" viewBox={`0 0 ${W} 180`} role="img" aria-label="Three coins with very different prices and similar market caps">
        {rows.map((r, i) => {
          const y = 18 + i * 54; const w = (r.cap / max) * (W - 260);
          return (
            <g key={r.name}>
              <text x="0" y={y + 22} fontSize="14" fontWeight="700" fill="currentColor" fontFamily="system-ui">{r.name}</text>
              <text x="0" y={y + 40} fontSize="11" fill="currentColor" opacity="0.7" fontFamily="system-ui">price ${r.price.toLocaleString()} × {r.supply.toLocaleString()}M supply</text>
              <rect x="220" y={y} width={w} height="34" rx="8" fill={['#f7931a', '#627eea', '#e84393'][i]} opacity="0.9" />
              <text x={220 + w + 8} y={y + 22} fontSize="13" fontWeight="700" fill="currentColor" fontFamily="system-ui">${(r.cap / 1000).toFixed(1)}B cap</text>
            </g>
          );
        })}
      </svg>
      <p className="viz-cap">The $0.002 coin is the most valuable of the three. A low price is not a cheap coin. Compare caps; then check the fully diluted value, which counts the coins not yet released.</p>
    </div>
  );
}

// One price series, three tools. Deterministic so the drawing is the same for everyone.
function makeSeries(n = 64, seed = 11) {
  let s = seed; const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  let p = 100; const out = [];
  for (let i = 0; i < n; i++) {
    const drift = i < 22 ? 0.55 : i < 42 ? -0.85 : 0.75;
    const o = p; const c = o + drift + (rnd() - 0.5) * 3.6;
    const h = Math.max(o, c) + rnd() * 1.4; const l = Math.min(o, c) - rnd() * 1.4;
    out.push({ o, h, l, c }); p = c;
  }
  return out;
}
function ema(vals, k) { const a = 2 / (k + 1); const out = []; let e = vals[0]; vals.forEach((v, i) => { e = i === 0 ? v : v * a + e * (1 - a); out.push(e); }); return out; }
function rsi(closes, n = 14) {
  const out = new Array(closes.length).fill(null); let g = 0, l = 0;
  for (let i = 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1]; const up = Math.max(d, 0), dn = Math.max(-d, 0);
    if (i <= n) { g += up / n; l += dn / n; if (i === n) out[i] = 100 - 100 / (1 + g / (l || 1e-9)); }
    else { g = (g * (n - 1) + up) / n; l = (l * (n - 1) + dn) / n; out[i] = 100 - 100 / (1 + g / (l || 1e-9)); }
  }
  return out;
}
function macd(closes) { const a = ema(closes, 12), b = ema(closes, 26); const m = a.map((v, i) => v - b[i]); const sig = ema(m, 9); return { m, sig, hist: m.map((v, i) => v - sig[i]) }; }

export function TradingCharts() {
  const d = useMemo(() => {
    const s = makeSeries(); const closes = s.map((c) => c.c);
    return { s, closes, rsi: rsi(closes), macd: macd(closes) };
  }, []);
  const W = 640, n = d.s.length, cw = W / n;
  const lo = Math.min(...d.s.map((c) => c.l)), hi = Math.max(...d.s.map((c) => c.h));
  const py = (v) => 10 + (hi - v) / (hi - lo) * 180;
  const path = (vals, y) => vals.map((v, i) => (v == null ? null : `${i === 0 || vals[i - 1] == null ? 'M' : 'L'}${(i + 0.5) * cw},${y(v)}`)).filter(Boolean).join(' ');
  const ry = (v) => 10 + (100 - v) / 100 * 80;
  const mm = Math.max(...d.macd.m.map(Math.abs), ...d.macd.hist.map(Math.abs)) || 1;
  const my = (v) => 50 - (v / mm) * 38;
  return (
    <div className="viz">
      <p className="viz-t">Candlesticks</p>
      <svg className="viz-svg" viewBox={`0 0 ${W} 200`} role="img" aria-label="Candlestick chart: an uptrend, a downtrend, then recovery">
        {d.s.map((c, i) => { const x = (i + 0.5) * cw; const up = c.c >= c.o; const col = up ? '#34d399' : '#f87171'; return (
          <g key={i}><line x1={x} x2={x} y1={py(c.h)} y2={py(c.l)} stroke={col} strokeWidth="1.2" /><rect x={x - cw * 0.32} y={py(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(1.5, Math.abs(py(c.o) - py(c.c)))} fill={col} /></g>); })}
      </svg>
      <p className="viz-cap">Green: closed above the open. Red: closed below. The wick is the range; the body is the fight. Long wicks at a turn are the patterns Module 1 teaches.</p>
      <p className="viz-t">RSI (14)</p>
      <svg className="viz-svg" viewBox={`0 0 ${W} 100`} role="img" aria-label="RSI line with 70 and 30 bands">
        <rect x="0" y={ry(70)} width={W} height={ry(30) - ry(70)} fill="rgba(201,162,39,.08)" />
        <line x1="0" x2={W} y1={ry(70)} y2={ry(70)} stroke="#f87171" strokeDasharray="4 4" opacity=".7" /><line x1="0" x2={W} y1={ry(30)} y2={ry(30)} stroke="#34d399" strokeDasharray="4 4" opacity=".7" />
        <text x="4" y={ry(70) - 3} fontSize="10" fill="currentColor" opacity=".7" fontFamily="system-ui">70 overbought</text><text x="4" y={ry(30) + 12} fontSize="10" fill="currentColor" opacity=".7" fontFamily="system-ui">30 oversold</text>
        <path d={path(d.rsi, ry)} fill="none" stroke="#c9a227" strokeWidth="2" />
      </svg>
      <p className="viz-cap">RSI measures the speed of the move, not the price. Above 70 the move is stretched; below 30 it is exhausted. Neither is a signal alone: see how RSI sat over 70 for most of the first rally.</p>
      <p className="viz-t">MACD (12, 26, 9)</p>
      <svg className="viz-svg" viewBox={`0 0 ${W} 100`} role="img" aria-label="MACD line, signal line and histogram">
        <line x1="0" x2={W} y1="50" y2="50" stroke="currentColor" opacity=".25" />
        {d.macd.hist.map((h, i) => <rect key={i} x={(i + 0.5) * cw - cw * 0.3} y={h >= 0 ? my(h) : 50} width={cw * 0.6} height={Math.abs(my(h) - 50)} fill={h >= 0 ? '#34d399' : '#f87171'} opacity=".6" />)}
        <path d={path(d.macd.m, my)} fill="none" stroke="#38bdf8" strokeWidth="2" /><path d={path(d.macd.sig, my)} fill="none" stroke="#f0b90b" strokeWidth="1.6" />
      </svg>
      <p className="viz-cap">Blue: MACD line (12-day average minus 26-day). Yellow: its 9-day signal. Bars: the gap between them. A cross with the bars growing is a trend; a cross with tiny bars is chop, and Module 3 teaches you to leave chop alone.</p>
    </div>
  );
}

function agg(cands, n) { const out = []; for (let i = 0; i + n <= cands.length; i += n) { const g = cands.slice(i, i + n); out.push({ o: g[0].o, c: g[g.length - 1].c, h: Math.max(...g.map((x) => x.h)), l: Math.min(...g.map((x) => x.l)) }); } return out; }
const TF = [
  { tf: '1m', who: 'Scalpers, bots', one: 'sixty seconds of orders', look: 'Volume bursts, spread, the last few candles only', means: 'The crowd\'s reflex. Almost pure noise; only for timing an entry the bigger charts already agreed on.' },
  { tf: '5m', who: 'Day traders', one: 'five minutes', look: 'Candle close, not the wick; small support and resistance inside the session', means: 'The first timeframe where a pattern can be trusted at all, and only after the candle closes.' },
  { tf: '10m · 15m', who: 'Day traders', one: 'a quarter hour', look: 'Session structure: the morning high and low, breaks and retests', means: 'Where intraday entries are timed once 1h and 4h have given the direction.' },
  { tf: '30m', who: 'Intraday swing', one: 'half an hour', look: 'The session\'s bias; whether the last 30m closed above or below the level that mattered', means: 'The bridge between noise and trend. A 30m close through a level is the first real signal.' },
  { tf: '1h', who: 'Day and swing traders', one: 'twelve 5m candles', look: 'RSI and MACD start to mean something here; the trend of the day', means: 'What the day is doing. One 1h candle holds the whole story of twelve 5m candles.' },
  { tf: '4h', who: 'Swing traders', one: 'a trading session', look: 'Clean patterns, divergences, the levels most traders actually watch', means: 'Where most trades should be planned. Six of these make a day; the 4h chart is the day in slow motion.' },
  { tf: '12h', who: 'Swing traders', one: 'Asia or the West', look: 'Which half of the world moved price: the Asian session or the US session', means: 'The two moods of a day. Divergence between the halves often precedes a turn.' },
  { tf: '1D', who: 'Everyone who matters', one: 'one full day', look: 'The trend, the 50 and 200-day averages, weekly opens; institutions read this chart', means: 'The chart of record. A crash on 5m is a wick here. If 1D says up, the 5m shorts are fighting the tide.' },
  { tf: '7D · 1W', who: 'Investors, cycle readers', one: 'one week', look: 'Cycle position, halving distance, all-time highs, the long averages', means: 'The story of the asset. Years fit on one screen; this is where "is it early or late" is answered.' },
];

export function TimeframeLadder() {
  const d = useMemo(() => {
    // 480 "5-minute" candles = 40 hours. A real day: chop, a sharp news drop inside the gold band, a V recovery,
    // then a grind up. Deterministic so every reader sees the same chart.
    let x = 7; const rnd = () => { x = (x * 1103515245 + 12345) & 0x7fffffff; return x / 0x7fffffff; };
    let p = 100; const base = [];
    for (let i = 0; i < 480; i++) {
      let drift = i < 216 ? 0.02 : i < 236 ? -0.9 : i < 264 ? 0.75 : 0.06;   // band = 216..264
      const vol = i >= 216 && i < 264 ? 1.6 : 0.7;
      const o = p; const c = o + drift + (rnd() - 0.5) * vol * 2;
      const h = Math.max(o, c) + rnd() * vol; const l = Math.min(o, c) - rnd() * vol;
      base.push({ o, h, l, c }); p = c;
    }
    return { m5: base, h1: agg(base, 12), h4: agg(base, 48) };
  }, []);
  const W = 640, H = 150;
  const all = d.m5; const lo = Math.min(...all.map((c) => c.l)), hi = Math.max(...all.map((c) => c.h));
  const py = (v) => 8 + (hi - v) / (hi - lo) * (H - 16);
  const win = [216, 264]; // the same 4 hours highlighted on every row
  const Row = ({ cands, label, note }) => { const cw = W / cands.length; const per = 480 / cands.length; return (
    <>
      <p className="viz-t" style={{ marginTop: 10 }}>{label} <span style={{ opacity: 0.6, letterSpacing: 0, textTransform: 'none', fontWeight: 500 }}>· {cands.length} candles · {note}</span></p>
      <svg className="viz-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        <rect x={(win[0] / per) * cw} y="0" width={((win[1] - win[0]) / per) * cw} height={H} fill="rgba(201,162,39,.14)" />
        {cands.map((c, i) => { const x = (i + 0.5) * cw; const up = c.c >= c.o; const col = up ? '#34d399' : '#f87171'; return <g key={i}><line x1={x} x2={x} y1={py(c.h)} y2={py(c.l)} stroke={col} strokeWidth={cands.length > 100 ? 0.8 : 1.4} /><rect x={x - cw * 0.32} y={py(Math.max(c.o, c.c))} width={Math.max(1, cw * 0.64)} height={Math.max(1.2, Math.abs(py(c.o) - py(c.c)))} fill={col} /></g>; })}
      </svg>
    </>
  ); };
  return (
    <div className="viz">
      <p className="viz-t">The same forty hours, three ways. The gold band is the same four hours on every row.</p>
      <Row cands={d.m5} label="5m" note="the noise" />
      <Row cands={d.h1} label="1h" note="the day" />
      <Row cands={d.h4} label="4h" note="the swing" />
      <p className="viz-cap">Look at the gold band. On 5m it is forty-eight candles of panic and relief. On 1h it is four candles. On 4h it is one candle with a wick. Nothing changed except how much time each candle holds. Read top-down: 1W and 1D for direction, 4h and 1h for structure, 15m and 5m only to time the entry, and never against the row above.</p>
      <div className="tf-ladder">
        {TF.map((r) => <details key={r.tf} className="tf-row"><summary><b>{r.tf}</b><span>{r.who}</span></summary><p><b>One candle is</b> {r.one}.</p><p><b>Where to look:</b> {r.look}.</p><p><b>What it means:</b> {r.means}</p></details>)}
      </div>
    </div>
  );
}

export function EcosystemGraph({ onModule }) {
  const [hub, setHub] = useState(ECOSYSTEM[0].id);
  const [node, setNode] = useState(null);
  const C = 280, R1 = 128, R2 = 226, VB = 560;
  const hubs = ECOSYSTEM.map((g, i) => { const a = -Math.PI / 2 + (i / ECOSYSTEM.length) * Math.PI * 2; return { ...g, a, x: C + Math.cos(a) * R1, y: C + Math.sin(a) * R1 }; });
  const H = hubs.find((h) => h.id === hub);
  const spread = 0.46;
  const outer = H.nodes.map((n, i) => { const a = H.a + (i - (H.nodes.length - 1) / 2) * spread; return { ...n, x: C + Math.cos(a) * R2, y: C + Math.sin(a) * R2 }; });
  const sel = node ? outer.find((n) => n.id === node) || null : null;
  const pick = (id) => setNode((cur) => (cur === id ? null : id));
  return (
    <div className="viz eco">
      <p className="viz-t">The ecosystem. Tap a hub, then a topic.</p>
      <svg className="viz-svg eco-svg" viewBox={`0 0 ${VB} ${VB}`} role="img" aria-label="Crypto ecosystem graph">
        {hubs.map((h) => <line key={`c${h.id}`} x1={C} y1={C} x2={h.x} y2={h.y} stroke={h.id === hub ? h.color : 'currentColor'} strokeOpacity={h.id === hub ? 0.9 : 0.18} strokeWidth={h.id === hub ? 2.5 : 1.2} />)}
        {outer.map((n) => <line key={`h${n.id}`} x1={H.x} y1={H.y} x2={n.x} y2={n.y} stroke={H.color} strokeOpacity="0.6" strokeWidth="1.6" />)}
        <g className="eco-center"><circle cx={C} cy={C} r="40" fill="#c9a227" /><text x={C} y={C + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill="#1a1406" fontFamily="system-ui">Blockchain</text></g>
        {hubs.map((h) => (
          <g key={h.id} className={`eco-hub ${h.id === hub ? 'on' : ''}`} onClick={() => { setHub(h.id); setNode(null); }} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setHub(h.id); setNode(null); } }} aria-label={`${h.label}, ${h.nodes.length} topics`}>
            <circle cx={h.x} cy={h.y} r={h.id === hub ? 34 : 28} fill={h.color} opacity={h.id === hub ? 1 : 0.55} />
            <text x={h.x} y={h.y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily="system-ui">{h.label}</text>
          </g>
        ))}
        {outer.map((n) => (
          <g key={n.id} className={`eco-node ${sel && sel.id === n.id ? 'on' : ''}`} onClick={() => pick(n.id)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(n.id); } }} aria-label={n.label}>
            <circle cx={n.x} cy={n.y} r={sel && sel.id === n.id ? 32 : 27} fill="#0d1326" stroke={H.color} strokeWidth={sel && sel.id === n.id ? 3 : 1.5} />
            {(() => { const w = n.label.split(' '); const a = w.length > 1 ? w.slice(0, Math.ceil(w.length / 2)).join(' ') : n.label; const b = w.length > 1 ? w.slice(Math.ceil(w.length / 2)).join(' ') : ''; return (
              <text x={n.x} y={b ? n.y - 1 : n.y + 4} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#fff" fontFamily="system-ui">{a}{b ? <tspan x={n.x} dy="12">{b}</tspan> : null}</text>); })()}
          </g>
        ))}
      </svg>
      <div className="eco-panel" style={{ borderColor: H.color }}>
        {sel ? (
          <>
            <b>{sel.label}</b>
            <p>{sel.blurb}</p>
            <button type="button" className="gp-btn ghost small" onClick={() => onModule?.(sel.module)}>Taught in Module {sel.module}</button>
          </>
        ) : (
          <>
            <b>{H.label}</b>
            <p>{H.nodes.map((n) => n.label).join(' · ')}. Tap one.</p>
          </>
        )}
      </div>
    </div>
  );
}
