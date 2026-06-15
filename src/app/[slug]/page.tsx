import Link from "next/link";
import { notFound } from "next/navigation";
import { ITEMS, getItemById, getTotalCommands } from "@/lib/data";
import CopyButton from "@/components/CopyButton";

export function generateStaticParams() {
  return ITEMS.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItemById(slug);
  if (!item) return { title: "Not Found" };
  return {
    title: `${item.name} Commands — DevCommands Hub`,
    description: item.shortDesc,
  };
}

function categoryBadgeClass(cat: string) {
  const map: Record<string, string> = {
    Language: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Package Manager": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Framework: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "AI/ML": "bg-green-500/10 text-green-400 border-green-500/20",
    DevOps: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return map[cat] ?? "bg-white/5 text-[var(--muted)] border-white/10";
}

export default async function DetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItemById(slug);
  if (!item) notFound();

  const totalCmds = item.sections.reduce((sum, s) => sum + s.commands.length, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      {/* Sticky header */}
      <header
        className="sticky top-0 z-40 border-b border-[var(--border)] px-4 sm:px-6 py-3 flex items-center gap-3"
        style={{ background: "rgba(13,17,23,0.88)", backdropFilter: "blur(16px)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] border border-[var(--border)]
            rounded-lg px-3 py-1.5 bg-[var(--surface)] hover:text-[#58a6ff] hover:border-[#58a6ff]/50
            transition-all duration-150 whitespace-nowrap flex-shrink-0"
        >
          ← Back
        </Link>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl flex-shrink-0">{item.icon}</span>
          <span className="font-bold text-[var(--text)] truncate">{item.name}</span>
          <span
            className={`hidden sm:inline text-[0.65rem] px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${categoryBadgeClass(item.category)}`}
          >
            {item.category}
          </span>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-[var(--border)]" style={{ background: "var(--surface)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl sm:text-6xl">{item.icon}</span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none"
              style={{ color: item.color }}
            >
              {item.name}
            </h1>
          </div>
          <p className="text-[var(--muted)] text-sm sm:text-base max-w-2xl mb-5 leading-relaxed">
            {item.shortDesc}
          </p>
          <div className="flex items-center gap-5 text-xs text-[var(--dim)]">
            <span>📚 {item.sections.length} sections</span>
            <span>⌨️ {totalCmds} commands</span>
          </div>
        </div>
      </div>

      {/* Quick jump */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-2 items-center">
          <span className="text-[0.65rem] font-bold tracking-widest uppercase text-[var(--dim)] mr-1 flex-shrink-0">
            Jump to
          </span>
          {item.sections.map((sec) => {
            const anchor = sec.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
            return (
              <a
                key={sec.title}
                href={`#${anchor}`}
                className="text-[0.72rem] px-2.5 py-1 rounded-full bg-[var(--surface2)] border border-[var(--border)]
                  text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--muted)]/40 transition-all duration-150"
              >
                {sec.title.replace(/^[^\w\s]+\s*/, "")}
              </a>
            );
          })}
        </div>
      </div>

      {/* Command sections */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-20 flex flex-col gap-6">
        {item.sections.map((section) => {
          const anchor = section.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
          return (
            <section key={section.title} id={anchor} className="scroll-mt-20">
              {/* Section header */}
              <div
                className="flex items-center gap-3 px-4 py-2.5 rounded-t-xl border border-b-0 border-[var(--border)]"
                style={{ background: "var(--surface2)" }}
              >
                <span className="text-sm font-bold text-[var(--text)]">{section.title}</span>
                <span
                  className="ml-auto text-[0.68rem] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${item.color}18`,
                    color: item.color,
                  }}
                >
                  {section.commands.length}
                </span>
              </div>

              {/* Commands table */}
              <div className="border border-[var(--border)] rounded-b-xl overflow-hidden">
                {section.commands.map((cmd, idx) => (
                  <div
                    key={idx}
                    className="group/row grid grid-cols-[1fr_1fr_36px] sm:grid-cols-[1fr_1fr_36px] border-b border-[var(--border)] last:border-b-0 transition-colors duration-100 hover:bg-[var(--surface2)]"
                    style={{
                      background:
                        idx % 2 === 0 ? "var(--surface)" : "rgba(255,255,255,0.012)",
                    }}
                  >
                    {/* Command */}
                    <code
                      className="cmd-font text-[0.78rem] px-3 sm:px-4 py-2.5 border-r border-[var(--border)] break-all items-center flex"
                      style={{ color: "#7ee787" }}
                    >
                      {cmd.cmd}
                    </code>

                    {/* Description */}
                    <span className="text-[0.78rem] px-3 sm:px-4 py-2.5 text-[var(--muted)] items-center flex leading-snug">
                      {cmd.desc}
                    </span>

                    {/* Copy button */}
                    <CopyButton text={cmd.cmd} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Bottom nav */}
      <div className="border-t border-[var(--border)] px-4 sm:px-6 py-4 flex justify-between items-center text-xs text-[var(--dim)]">
        <Link href="/" className="hover:text-[#58a6ff] transition-colors">
          ← All Languages &amp; Tools
        </Link>
        <span>{totalCmds} commands in {item.sections.length} sections</span>
      </div>
    </div>
  );
}
