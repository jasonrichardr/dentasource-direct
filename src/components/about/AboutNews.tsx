"use client";

import { m as motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { newsData } from "@/data/news";

export default function AboutNews() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
              Stay Updated
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Latest Global News
            </h2>
            <p className="text-lg text-gray-600">
              Stay updated with our manufacturing partners&apos; latest
              breakthroughs and global events.
            </p>
          </motion.div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {newsData.map((news, i) => (
            <Link
              href={`/news/${news.slug}`}
              key={news.slug}
              className="group block"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-gray-100 bg-zinc-50 overflow-hidden h-full transition-shadow duration-300 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                {/* Content */}
                <div className="p-6">
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                    {news.date}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 mt-2 mb-3 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {news.title}
                  </h3>
                  <span className="text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                    Read Full Story &rarr;
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
