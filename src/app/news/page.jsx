'use client';

import { newsData } from '@/data/news';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NewsPage() {
  const sortedNews = [...newsData].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <main style={{
        minHeight: '100vh',
        background: '#faf8f5',
        paddingTop: 130,
        paddingBottom: 80,
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        WebkitFontSmoothing: 'antialiased',
      }}>
        {/* Header */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', marginBottom: 48 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '2.5px',
              textTransform: 'uppercase', color: '#2d6a5a', marginBottom: 12,
            }}>
              DentaSource Direct
            </p>
            <h1 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 400,
              color: '#1a1a1a',
              marginBottom: 12,
              letterSpacing: '-0.5px',
            }}>
              News & Insights
            </h1>
            <p style={{
              fontSize: 17, color: '#7a7a7a', maxWidth: 560, lineHeight: 1.6,
            }}>
              The latest from the Philippine dental industry — product launches, PDA updates, technology trends, and expert buying guides.
            </p>
          </motion.div>
        </div>

        {/* Featured Article */}
        {sortedNews.length > 0 && (
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', marginBottom: 48 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href={`/news/${sortedNews[0].slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  position: 'relative',
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: '1px solid #e5e0d8',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                }}>
                  {sortedNews[0].image && (
                    <div style={{ position: 'relative', height: 'clamp(240px, 40vw, 400px)', width: '100%', overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sortedNews[0].image}
                        alt={sortedNews[0].title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(26,60,52,0.85) 0%, rgba(26,60,52,0.3) 40%, transparent 100%)',
                      }} />
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        padding: 'clamp(20px, 4vw, 36px)',
                      }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: 10, fontWeight: 700, letterSpacing: '2px',
                          textTransform: 'uppercase',
                          background: '#c4993c', color: '#1a3c34',
                          padding: '5px 14px', borderRadius: 100,
                          marginBottom: 14,
                        }}>
                          Featured
                        </span>
                        <h2 style={{
                          fontFamily: "'DM Serif Display', Georgia, serif",
                          fontSize: 'clamp(22px, 3.5vw, 34px)',
                          fontWeight: 400,
                          color: 'white',
                          lineHeight: 1.2,
                          marginBottom: 8,
                        }}>
                          {sortedNews[0].title}
                        </h2>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                          {sortedNews[0].date}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          </div>
        )}

        {/* Article Grid */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
            gap: 24,
          }}>
            {sortedNews.slice(1).map((article, index) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
              >
                <Link href={`/news/${article.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                  <div style={{
                    background: 'white',
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid #e5e0d8',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    {article.image && (
                      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={article.image}
                          alt={article.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <p style={{
                        fontSize: 12, color: '#999', fontWeight: 500, marginBottom: 8,
                      }}>
                        {article.date}
                      </p>
                      <h3 style={{
                        fontFamily: "'DM Serif Display', Georgia, serif",
                        fontSize: 19,
                        fontWeight: 400,
                        color: '#1a1a1a',
                        lineHeight: 1.3,
                        marginBottom: 10,
                      }}>
                        {article.title}
                      </h3>
                      <p style={{
                        fontSize: 14, color: '#7a7a7a', lineHeight: 1.6,
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {article.abstract}
                      </p>
                      <div style={{
                        marginTop: 16,
                        fontSize: 14, fontWeight: 600, color: '#2d6a5a',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                        Read article →
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
