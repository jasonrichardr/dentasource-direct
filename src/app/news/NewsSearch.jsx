'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, m as motion } from 'framer-motion';

// Full-text search over every word of every article, built in the browser from newsData.
// Each article is split into its ## sections so a hit can say WHERE it was found.

const IMG_RE = /!\[[^\]]*\]\([^)]*\)/g;
const LINK_RE = /\[([^\]]*)\]\([^)]*\)/g;
const MARK_RE = /\*\*/g;

function clean(md) {
    return md.replace(IMG_RE, ' ').replace(LINK_RE, '$1').replace(MARK_RE, '').replace(/\s+/g, ' ').trim();
}

function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function buildIndex(articles) {
    return articles.map((a) => {
        const sections = [];
        let heading = 'Introduction';
        let buf = [];
        for (const block of a.content.split('\n\n')) {
            const t = block.trim();
            if (t.startsWith('## ')) {
                if (buf.length) sections.push({ heading, id: slugify(heading), text: clean(buf.join(' ')) });
                heading = t.slice(3).trim();
                buf = [];
            } else if (t.startsWith('[facebook](') || t === '[marbles]') {
                continue;
            } else {
                buf.push(t);
            }
        }
        if (buf.length) sections.push({ heading, id: slugify(heading), text: clean(buf.join(' ')) });
        const all = [a.title, a.abstract, ...sections.map((s) => s.heading + ' ' + s.text)].join(' ').toLowerCase();
        return { article: a, sections, all, titleLc: a.title.toLowerCase(), abstractLc: a.abstract.toLowerCase(), time: new Date(a.date).getTime() };
    });
}

function tokens(q) {
    return q.toLowerCase().split(/\s+/).map((t) => t.trim()).filter((t) => t.length >= 2);
}

function snippetAround(text, term, width = 150) {
    const lc = text.toLowerCase();
    const i = lc.indexOf(term);
    if (i < 0) return text.slice(0, width) + (text.length > width ? '…' : '');
    const start = Math.max(0, i - Math.floor(width / 2));
    const end = Math.min(text.length, start + width);
    return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
}

export function search(index, q, limit = 8) {
    const terms = tokens(q);
    if (!terms.length) return { terms, hits: [], matchedSlugs: null };
    const hits = [];
    for (const entry of index) {
        if (!terms.every((t) => entry.all.includes(t))) continue;
        let score = 0;
        for (const t of terms) {
            if (entry.titleLc.includes(t)) score += 120;
            if (entry.abstractLc.includes(t)) score += 30;
        }
        let best = null;
        for (const s of entry.sections) {
            const hl = s.heading.toLowerCase();
            const tl = s.text.toLowerCase();
            let sScore = 0;
            for (const t of terms) {
                if (hl.includes(t)) sScore += 60;
                if (tl.includes(t)) sScore += 12;
            }
            if (sScore > 0 && (!best || sScore > best.score)) best = { section: s, score: sScore };
        }
        if (best) score += best.score;
        const where = best ? best.section : entry.sections[0];
        const term = terms.find((t) => where && (where.text.toLowerCase().includes(t) || where.heading.toLowerCase().includes(t))) || terms[0];
        hits.push({
            slug: entry.article.slug,
            title: entry.article.title,
            date: entry.article.date,
            image: entry.article.ogImage || entry.article.image,
            heading: where ? where.heading : '',
            anchor: where ? where.id : '',
            snippet: where ? snippetAround(where.text, term) : entry.article.abstract,
            score,
            time: entry.time,
        });
    }
    hits.sort((a, b) => b.score - a.score || b.time - a.time);
    return { terms, hits: hits.slice(0, limit), matchedSlugs: new Set(hits.map((h) => h.slug)), total: hits.length };
}

function Highlight({ text, terms }) {
    if (!terms.length) return text;
    const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'ig');
    const parts = text.split(re);
    return parts.map((p, i) =>
        re.test(p) && terms.some((t) => t === p.toLowerCase())
            ? <mark key={i} style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(196,153,60,0.55) 55%)', color: 'inherit', padding: '0 1px', borderRadius: 2 }}>{p}</mark>
            : <span key={i}>{p}</span>
    );
}

export default function NewsSearch({ query, setQuery, result, totalArticles }) {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const inputRef = useRef(null);
    const boxRef = useRef(null);
    const { terms, hits, total } = result;

    useEffect(() => {
        function onDoc(e) { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); }
        function onKey(e) {
            if (e.key === '/' && document.activeElement !== inputRef.current && !/input|textarea/i.test(document.activeElement?.tagName || '')) {
                e.preventDefault(); inputRef.current?.focus();
            }
        }
        document.addEventListener('mousedown', onDoc);
        document.addEventListener('keydown', onKey);
        return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
    }, []);

    useEffect(() => { setActive(-1); }, [query]);

    const showList = open && terms.length > 0;

    function onKeyDown(e) {
        if (!showList) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, hits.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, -1)); }
        else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); window.location.href = `/news/${hits[active].slug}#${hits[active].anchor}`; }
        else if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
    }

    return (
        <div ref={boxRef} style={{ position: 'relative', maxWidth: 720, marginTop: 28 }}>
            <label htmlFor="news-search" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                Search the news
            </label>
            <div
                style={{
                    position: 'relative',
                    borderRadius: 999,
                    padding: 2,
                    background: open
                        ? 'linear-gradient(120deg, #2d6a5a, #c4993c 55%, #2d6a5a)'
                        : 'linear-gradient(120deg, #e5e0d8, #e5e0d8)',
                    transition: 'background 0.35s ease',
                    boxShadow: open ? '0 18px 50px rgba(45,106,90,0.18)' : '0 4px 18px rgba(0,0,0,0.04)',
                }}
            >
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)',
                    borderRadius: 999, padding: '0 14px 0 18px', height: 54,
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d6a5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
                    </svg>
                    <input
                        id="news-search"
                        ref={inputRef}
                        type="text"
                        role="searchbox"
                        autoComplete="off"
                        spellCheck={false}
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                        onFocus={() => setOpen(true)}
                        onKeyDown={onKeyDown}
                        placeholder={`Search every word in ${totalArticles} articles. Try "apex locator", "Pampanga", "TADS"`}
                        style={{
                            flex: 1, border: 0, outline: 'none', background: 'transparent',
                            fontSize: 16, color: '#1a1a1a', fontFamily: 'inherit', minWidth: 0,
                        }}
                    />
                    {query ? (
                        <button
                            type="button"
                            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                            aria-label="Clear search"
                            style={{ border: 0, background: '#f1efea', color: '#555', borderRadius: 999, width: 28, height: 28, cursor: 'pointer', fontSize: 14 }}
                        >
                            ×
                        </button>
                    ) : (
                        <kbd style={{
                            fontFamily: 'inherit', fontSize: 11, color: '#8a8a8a',
                            border: '1px solid #e5e0d8', borderBottomWidth: 2, borderRadius: 6, padding: '2px 7px', background: '#faf8f5',
                        }}>/</kbd>
                    )}
                </div>
            </div>

            {terms.length > 0 && (
                <p style={{ fontSize: 12, color: '#7a7a7a', margin: '10px 0 0 20px', letterSpacing: '0.3px' }}>
                    {total === 0
                        ? <>No article mentions <strong style={{ color: '#1a1a1a' }}>{query.trim()}</strong> yet.</>
                        : <>{total} {total === 1 ? 'article mentions' : 'articles mention'} <strong style={{ color: '#1a1a1a' }}>{query.trim()}</strong>. Newest first below, best matches here.</>}
                </p>
            )}

            <AnimatePresence>
                {showList && hits.length > 0 && (
                    <motion.ul
                        role="listbox"
                        initial={{ opacity: 0, y: 8, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.99 }}
                        transition={{ duration: 0.18 }}
                        style={{
                            position: 'absolute', zIndex: 40, left: 0, right: 0, top: 'calc(100% - 4px)',
                            listStyle: 'none', margin: '10px 0 0', padding: 8,
                            background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(14px)',
                            border: '1px solid #e5e0d8', borderRadius: 20,
                            boxShadow: '0 30px 80px rgba(26,60,52,0.16)',
                            maxHeight: '68vh', overflowY: 'auto',
                        }}
                    >
                        {hits.map((h, i) => (
                            <li key={h.slug} role="option" aria-selected={i === active}>
                                <Link
                                    href={`/news/${h.slug}#${h.anchor}`}
                                    onMouseEnter={() => setActive(i)}
                                    style={{
                                        display: 'grid', gridTemplateColumns: '72px 1fr', gap: 14, alignItems: 'start',
                                        padding: '12px 12px', borderRadius: 14, textDecoration: 'none', color: 'inherit',
                                        background: i === active ? 'linear-gradient(90deg, rgba(45,106,90,0.09), rgba(196,153,60,0.08))' : 'transparent',
                                        transition: 'background 0.15s',
                                    }}
                                >
                                    <span style={{ display: 'block', width: 72, height: 54, borderRadius: 10, overflow: 'hidden', background: '#eee' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        {h.image && <img src={h.image} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />}
                                    </span>
                                    <span style={{ minWidth: 0 }}>
                                        <span style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                                            <span style={{
                                                fontSize: 10, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase',
                                                color: '#1a3c34', background: 'rgba(196,153,60,0.28)', padding: '3px 9px', borderRadius: 999, whiteSpace: 'nowrap',
                                            }}>{h.date}</span>
                                            <span style={{ fontSize: 11, color: '#2d6a5a', letterSpacing: '1.2px', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                in: {h.heading}
                                            </span>
                                        </span>
                                        <span style={{
                                            display: 'block', fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 17, lineHeight: 1.25, color: '#1a1a1a', marginBottom: 4,
                                        }}>
                                            <Highlight text={h.title} terms={terms} />
                                        </span>
                                        <span style={{ display: 'block', fontSize: 13, color: '#6b6b6b', lineHeight: 1.5 }}>
                                            <Highlight text={h.snippet} terms={terms} />
                                        </span>
                                    </span>
                                </Link>
                            </li>
                        ))}
                        <li aria-hidden="true" style={{ padding: '8px 12px 4px', fontSize: 11, color: '#9a9a9a', display: 'flex', gap: 14, justifyContent: 'flex-end' }}>
                            <span>↑ ↓ to move</span><span>↵ to open at that section</span><span>esc to close</span>
                        </li>
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}
