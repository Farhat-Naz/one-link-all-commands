"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { type LangItem, CATEGORIES } from "@/lib/data";

function categoryColor(cat: string) {
  const map: Record<string, string> = {
    Language: "bg-blue-500/10 text-blue-400",
    "Package Manager": "bg-orange-500/10 text-orange-400",
    Framework: "bg-purple-500/10 text-purple-400",
    "AI/ML": "bg-green-500/10 text-green-400",
    DevOps: "bg-red-500/10 text-red-400",
    Database: "bg-teal-500/10 text-teal-400",
  };
  return map[cat] ?? "bg-white/5 text-[var(--muted)]";
}

function totalCmds(item: LangItem) {
  return item.sections.reduce((sum, s) => sum + s.commands.length, 0);
}

function Card({ item }: { item: LangItem }) {
  const cmds = totalCmds(item);
  return (
    <Link
      href={`/${item.id}`}
      className="group/card card-animate block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5
        transition-all duration-200 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/50
        focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/40"
      style={
        {
          "--card-clr": item.color,
        } as React.CSSProperties
      }
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl opacity-60 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:h-[3px]"
        style={{ background: item.color }}
      />

      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover/card:opacity-[0.04]"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${item.color} 0%, transparent 70%)`,
        }}
      />

      <div className="relative flex flex-col gap-3 h-full">
        <span className="text-4xl leading-none">{item.icon}</span>
        <h3 className="font-bold text-[var(--text)] text-base leading-snug">{item.name}</h3>
        <span
          className={`w-fit text-[0.68rem] px-2 py-0.5 rounded-full font-medium ${categoryColor(item.category)}`}
        >
          {item.category}
        </span>
        <p className="text-xs text-[var(--muted)] leading-relaxed flex-1">{item.shortDesc}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[0.68rem] text-[var(--dim)]">{cmds} commands</span>
          <span
            className="text-xs text-[var(--dim)] transition-all duration-200 group-hover/card:translate-x-1"
            style={{ color: `${item.color}99` }}
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomeClient({
  items,
  totalCommands,
}: {
  items: LangItem[];
  totalCommands: number;
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((item) => {
      const matchCat = activeCategory === "All" || item.category === activeCategory;
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [items, search, activeCategory]);

  const grouped = useMemo(() => {
    if (activeCategory !== "All" || search) return null;
    const map = new Map<string, LangItem[]>();
    for (const cat of CATEGORIES.slice(1)) {
      const group = items.filter((i) => i.category === cat);
      if (group.length) map.set(cat, group);
    }
    return map;
  }, [items, activeCategory, search]);

  return (
    <>
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 text-center">
          <h1 className="gradient-text text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none mb-3">
            DevCommands Hub
          </h1>
          <p className="text-[var(--muted)] text-base sm:text-lg mb-6">
            All programming commands for every language, framework & tool — in one place
          </p>

          {/* Stats pill */}
          <div className="inline-flex items-center gap-4 text-xs text-[var(--muted)] bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-1.5 mb-7">
            <span>🗂 {items.length} languages &amp; tools</span>
            <span className="text-[var(--border)]">|</span>
            <span>⌨️ {totalCommands}+ commands</span>
          </div>

          {/* Search */}
          <div className="relative max-w-lg mx-auto mb-5">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Python, React, Docker, OpenAI..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[var(--surface)] border border-[var(--border)]
                text-[var(--text)] placeholder:text-[var(--dim)] text-sm outline-none
                focus:border-[#58a6ff] focus:shadow-[0_0_0_3px_rgba(88,166,255,0.12)] transition-all"
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer
                  ${
                    activeCategory === cat
                      ? "border-[#58a6ff] text-[#58a6ff] bg-[#58a6ff]/10"
                      : "border-[var(--border)] text-[var(--muted)] bg-[var(--surface)] hover:border-[#58a6ff]/40 hover:text-[#58a6ff]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Cards */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-[var(--muted)]">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-base">No results for &ldquo;{search}&rdquo;</p>
          </div>
        ) : grouped ? (
          /* Grouped by category */
          Array.from(grouped.entries()).map(([cat, catItems]) => (
            <section key={cat} className="mb-10">
              <h2 className="text-xl font-extrabold tracking-wide uppercase text-blue-900 mb-3 px-0.5">
                {cat}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {catItems.map((item, i) => (
                  <div key={item.id} className="relative" style={{ animationDelay: `${i * 30}ms` }}>
                    <Card item={item} />
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          /* Flat filtered grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map((item, i) => (
              <div key={item.id} className="relative" style={{ animationDelay: `${i * 25}ms` }}>
                <Card item={item} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] text-center py-5 text-xs text-[var(--dim)]">
        DevCommands Hub · {items.length} tools · {totalCommands}+ commands · Built with Next.js & Tailwind CSS
      </footer>
    </>
  );
}
