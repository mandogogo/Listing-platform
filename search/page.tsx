import Link from "next/link";
import { Header } from "@/components/Header";
import { VerificationSeal } from "@/components/VerificationSeal";
import { getDictionary } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/locale";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; city?: string };
}) {
  const { locale, t } = await getDictionary();
  const isAr = locale === "ar";
  const { q, category, city } = searchParams;

  const where: any = { publishStatus: "PUBLISHED" };
  if (city) where.city = { slug: city };
  if (category) where.categories = { some: { category: { slug: category } } };
  if (q) {
    where.OR = [
      { nameAr: { contains: q, mode: "insensitive" } },
      { nameEn: { contains: q, mode: "insensitive" } },
    ];
  }

  const results = await prisma.organization.findMany({
    where,
    include: { city: true, categories: { include: { category: true } } },
    orderBy: [{ verificationStatus: "desc" }, { createdAt: "desc" }],
    take: 50,
  });

  return (
    <main className="min-h-screen bg-sand">
      <Header />

      <div className="mx-auto max-w-4xl px-6 py-10">
        <form action="/search" className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder={t.common.searchPlaceholder}
            className="flex-1 rounded-lg border border-ink/20 bg-white px-5 py-3 text-ink placeholder:text-ink/40 focus:border-copper focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-copper px-6 py-3 font-medium text-white hover:bg-copper-dark transition-colors"
          >
            {t.common.search}
          </button>
        </form>

        <p className="mt-6 mb-3 font-mono text-sm text-ink/50">
          {results.length} {isAr ? "نتيجة" : "results"}
        </p>

        {results.length === 0 ? (
          <div className="rounded-xl bg-sand-light p-10 text-center text-ink/60">
            {t.common.noResults}
          </div>
        ) : (
          <div className="ledger-rule">
            {results.map((org) => (
              <Link
                key={org.id}
                href={`/business/${org.id}`}
                className="group flex items-start justify-between gap-4 border-b border-ink/10 py-5 hover:bg-sand-light transition-colors"
              >
                <div>
                  <div className="mb-1 flex flex-wrap gap-2">
                    {org.categories.map((c) => (
                      <span
                        key={c.id}
                        className="rounded-full border border-ink/15 px-2.5 py-0.5 font-mono text-xs text-ink/60"
                      >
                        {localize(c.category, "name", locale)}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-medium text-ink group-hover:text-copper transition-colors">
                    {localize(org, "name", locale)}
                  </h3>
                  <p className="font-mono text-sm text-ink/50">
                    {localize(org.city, "name", locale)}
                  </p>
                </div>
                {org.verificationStatus === "VERIFIED" && (
                  <VerificationSeal label={t.common.verified} />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
