import Link from "next/link";
import { Header } from "@/components/Header";
import { getDictionary } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/locale";

export default async function HomePage() {
  const { locale, t } = await getDictionary();

  const categories = await prisma.category.findMany({
    where: { parentId: null, categoryType: "BUSINESS", isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { listings: true } } },
  });

  return (
    <main className="min-h-screen bg-sand">
      <Header />

      {/* Hero — the thesis: this is a register of verified businesses, not a social feed */}
      <section className="border-b border-ink/10 bg-sand-light">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-copper">
            {locale === "ar" ? "دليل موثّق · الإمارات · السعودية · مصر" : "Verified Register · UAE · Saudi · Egypt"}
          </p>
          <h1 className="max-w-2xl text-5xl font-semibold leading-tight text-ink md:text-6xl">
            {locale === "ar"
              ? "كل شركة، مصنع، أو محل — في سجل واحد موثّق"
              : "Every company, factory, or shop — in one verified register"}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink/70">
            {locale === "ar"
              ? "من تأسيس الشركات للطباعة والشحن واستلام السيارات — ابحث واتواصل مباشرة."
              : "From business setup to printing, shipping, and car pickup — search and connect directly."}
          </p>

          <form action="/search" className="mt-10 flex max-w-xl gap-2">
            <input
              type="text"
              name="q"
              placeholder={t.common.searchPlaceholder}
              className="flex-1 rounded-lg border border-ink/20 bg-white px-5 py-3.5 text-ink placeholder:text-ink/40 focus:border-copper focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-copper px-6 py-3.5 font-medium text-white hover:bg-copper-dark transition-colors"
            >
              {t.common.search}
            </button>
          </form>
        </div>
      </section>

      {/* Category ledger — structural device that encodes real content: each row is an indexed sector */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-2 text-2xl font-semibold text-ink">{t.common.categories}</h2>
        <p className="mb-8 text-ink/60">
          {locale === "ar" ? "تصفّح حسب القطاع" : "Browse by sector"}
        </p>

        <div className="ledger-rule" />
        {categories.map((cat, i) => (
          <Link
            key={cat.id}
            href={`/search?category=${cat.slug}`}
            className="group flex items-center justify-between border-b border-ink/10 py-5 transition-colors hover:bg-sand-light"
          >
            <div className="flex items-center gap-6">
              <span className="font-mono text-sm text-ink/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-lg font-medium text-ink group-hover:text-copper transition-colors">
                {localize(cat, "name", locale)}
              </span>
            </div>
            <span className="font-mono text-sm text-ink/50">
              {cat._count.listings} {locale === "ar" ? "نشاط" : "listed"}
            </span>
          </Link>
        ))}
      </section>

      {/* CTA */}
      <section className="border-t border-ink/10 bg-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
          <div>
            <h3 className="text-2xl font-semibold text-sand">
              {locale === "ar" ? "عندك نشاط تجاري؟" : "Have a business?"}
            </h3>
            <p className="mt-2 text-sand/60">
              {locale === "ar" ? "أضفه للسجل ووصّل لعملاء جدد" : "List it in the register and reach new customers"}
            </p>
          </div>
          <Link
            href="/business/new"
            className="rounded-full bg-copper px-8 py-3.5 font-medium text-white hover:bg-copper-light transition-colors"
          >
            {t.nav.addBusiness}
          </Link>
        </div>
      </section>
    </main>
  );
}
