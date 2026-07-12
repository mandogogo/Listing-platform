import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { VerificationSeal } from "@/components/VerificationSeal";
import { getDictionary } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/locale";

export default async function BusinessPage({
  params,
}: {
  params: { id: string };
}) {
  const { locale, t } = await getDictionary();

  const org = await prisma.organization.findUnique({
    where: { id: params.id },
    include: {
      city: true,
      categories: { include: { category: true } },
      media: { orderBy: { sortOrder: "asc" } },
      workingHours: { orderBy: { dayOfWeek: "asc" } },
    },
  });

  if (!org || org.publishStatus !== "PUBLISHED") notFound();

  const isVerified = org.verificationStatus === "VERIFIED";
  const name = localize(org, "name", locale);
  const description = localize(org, "description", locale);

  return (
    <main className="min-h-screen bg-sand">
      <Header />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          {org.categories.map((c) => (
            <span
              key={c.id}
              className="rounded-full border border-ink/15 px-3 py-1 font-mono text-xs text-ink/60"
            >
              {localize(c.category, "name", locale)}
            </span>
          ))}
        </div>

        <div className="flex items-start justify-between gap-6">
          <h1 className="text-4xl font-semibold text-ink">{name}</h1>
          {isVerified && <VerificationSeal label={t.common.verified} />}
        </div>

        <p className="mt-2 font-mono text-sm text-ink/50">
          {localize(org.city, "name", locale)}
          {org.address ? ` · ${org.address}` : ""}
        </p>

        {description && (
          <section className="mt-10">
            <h2 className="mb-3 text-lg font-semibold text-ink">{t.business.aboutUs}</h2>
            <p className="leading-relaxed text-ink/80">{description}</p>
          </section>
        )}

        {org.workingHours.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-lg font-semibold text-ink">{t.business.workingHours}</h2>
            <div className="ledger-rule">
              {org.workingHours.map((wh) => (
                <div
                  key={wh.id}
                  className="flex justify-between border-b border-ink/10 py-2.5 text-sm"
                >
                  <span className="text-ink/70">
                    {["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"][wh.dayOfWeek]}
                  </span>
                  <span className="font-mono text-ink">
                    {wh.isClosed ? "مغلق" : `${wh.openTime} – ${wh.closeTime}`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact actions */}
        <section className="mt-12 flex flex-wrap gap-3 rounded-xl bg-sand-light p-6">
          {org.phone && (
            <a
              href={`tel:${org.phone}`}
              className="rounded-lg bg-ink px-6 py-3 font-medium text-sand hover:bg-ink-light transition-colors"
            >
              {t.common.call}
            </a>
          )}
          {org.whatsapp && (
            <a
              href={`https://wa.me/${org.whatsapp.replace(/[^0-9]/g, "")}`}
              className="rounded-lg bg-emerald px-6 py-3 font-medium text-white hover:bg-emerald-light transition-colors"
            >
              {t.common.whatsapp}
            </a>
          )}
          {org.latitude && org.longitude && (
            <a
              href={`https://maps.google.com/?q=${org.latitude},${org.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-ink/20 px-6 py-3 font-medium text-ink hover:bg-white transition-colors"
            >
              {t.common.directions}
            </a>
          )}
        </section>

        {org.claimStatus !== "CLAIMED" && (
          <p className="mt-8 text-center text-sm text-ink/50">{t.business.claimThisBusiness}</p>
        )}
      </div>
    </main>
  );
}
