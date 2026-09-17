'use client';

// Visuals for the JDev sheets (round 4): teaching drawings, all SVG, no external images.
// Token marks are drawn for teaching and are not the official logos.
import { useMemo, useState } from 'react';
import { ECOSYSTEM } from '@/data/jdev';

const TOKENS = [
  { sym: '₿', name: 'Bitcoin', tick: 'BTC', color: '#f7931a', net: 'Own chain · proof of work' },
  { sym: 'Ξ', name: 'Ether', tick: 'ETH', color: '#627eea', net: 'Own chain · proof of stake' },
  { sym: '₮', name: 'Tether', tick: 'USDT', color: '#26a17b', net: 'Stablecoin · rides on ETH, TRON, others' },
  { sym: '$', name: 'USD Coin', tick: 'USDC', color: '#2775ca', net: 'Stablecoin · rides on ETH, Base, Solana' },
  { sym: '◎', name: 'Solana', tick: 'SOL', color: '#9945ff', net: 'Own chain · proof of stake' },
  { sym: '⬡', name: 'BNB', tick: 'BNB', color: '#f0b90b', net: 'Own chain · proof of staked authority' },
];

export function TokenRow() {
  return (
    <div className="viz">
      <p className="viz-t">Tokens and what they ride on</p>
      <div className="tokens">
        {TOKENS.map((t) => (
          <div key={t.tick} className="token">
            <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden><circle cx="32" cy="32" r="30" fill={t.color} /><text x="32" y="43" textAnchor="middle" fontSize="30" fontWeight="800" fill="#fff" fontFamily="system-ui">{t.sym}</text></svg>
            <b>{t.tick}</b><small>{t.name}</small><em>{t.net}</em>
          </div>
        ))}
      </div>
      <p className="viz-cap">A coin has its own chain. A token is a balance inside a contract on somebody else's chain. Stablecoins are tokens pegged to a currency.</p>
    </div>
  );
}

export function NetworkMap() {
  const N = [
    { id: 'btc', x: 110, y: 70, r: 34, c: '#f7931a', l: 'Bitcoin', s: 'L1' },
    { id: 'ln', x: 110, y: 170, r: 22, c: '#f7931a', l: 'Lightning', s: 'L2' },
    { id: 'eth', x: 330, y: 70, r: 36, c: '#627eea', l: 'Ethereum', s: 'L1' },
    { id: 'arb', x: 250, y: 175, r: 22, c: '#627eea', l: 'Arbitrum', s: 'L2' },
    { id: 'base', x: 330, y: 190, r: 22, c: '#627eea', l: 'Base', s: 'L2' },
    { id: 'op', x: 410, y: 175, r: 22, c: '#627eea', l: 'Optimism', s: 'L2' },
    { id: 'usdt', x: 530, y: 60, r: 24, c: '#26a17b', l: 'USDT', s: 'token' },
    { id: 'usdc', x: 560, y: 140, r: 24, c: '#2775ca', l: 'USDC', s: 'token' },
    { id: 'sol', x: 520, y: 220, r: 28, c: '#9945ff', l: 'Solana', s: 'L1' },
  ];
  const E = [['btc', 'ln'], ['eth', 'arb'], ['eth', 'base'], ['eth', 'op'], ['eth', 'usdt'], ['eth', 'usdc'], ['sol', 'usdc'], ['base', 'usdc']];
  const at = (id) => N.find((n) => n.id === id);
  return (
    <div className="viz">
      <p className="viz-t">Networks: layer 1 chains, layer 2s on top, tokens riding across</p>
      <svg className="viz-svg" viewBox="0 0 640 260" role="img" aria-label="Network diagram: Bitcoin with Lightning; Ethereum with Arbitrum, Base and Optimism; USDT and USDC riding on Ethereum, Base and Solana">
        {E.map(([a, b]) => { const A = at(a), B = at(b); return <line key={a + b} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgba(201,162,39,.55)" strokeWidth="2" strokeDasharray={A.s === 'token' || B.s === 'token' ? '5 4' : '0'} />; })}
        {N.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.c} opacity="0.92" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={n.r > 30 ? 13 : 11} fontWeight="700" fill="#fff" fontFamily="system-ui">{n.l}</text>
            <text x={n.x} y={n.y + n.r + 14} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7" fontFamily="system-ui">{n.s}</text>
          </g>
        ))}
      </svg>
      <p className="viz-cap">Solid lines: a layer 2 settles to its layer 1. Dashed: a token issued on more than one chain. Fees fall as you move down; security is borrowed from the chain above.</p>
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
