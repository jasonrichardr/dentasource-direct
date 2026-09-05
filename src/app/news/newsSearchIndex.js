// ☠️ THE WHOLE ARCHIVE LIVES BEHIND THIS MODULE, AND THAT IS THE POINT.
//
// src/data/news.js plus news-fb-2026.js is 92 articles of full markdown: 413 KB raw,
// 122 KB gzipped. It used to be imported directly by NewsContent, which is a client
// component, so every visitor to /news downloaded the entire corpus before reading a
// word of it, and every visitor to the HOME page downloaded it too because the navbar
// prefetched /news on sight.
//
// Nothing here is new code. It is the same buildIndex over the same data; the only thing
// that changed is that it sits in a module NOTHING imports statically. Next gives it its
// own chunk, and NewsContent reaches for it with import() the moment the search box is
// touched. Full text search over every word is preserved exactly: this is not a slimmer
// index, it is the same index, fetched when it is actually wanted.
//
// Keep this file free of any other export. One import() means one chunk, and anything
// else that lands in here would be dragged in with the archive.

import { newsData } from '@/data/news';
import { buildIndex } from './NewsSearch';

const index = buildIndex([...newsData].sort((a, b) => new Date(b.date) - new Date(a.date)));

export default index;
