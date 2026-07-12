import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { getDictionary } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/locale";
import { auth } from "@/lib/auth";
import { NewBusinessForm } from "./NewBusinessForm";

export default async function NewBusinessPage() {
  const session = await auth();
  const { locale } = await getDictionary();

  if (!session?.user) {
    redirect("/login?next=/business/new");
  }

  const [categories, countries, cities] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: null, categoryType: "BUSINESS", isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.country.findMany(),
    prisma.city.findMany({ include: { country: true } }),
  ]);

  const categoryOptions = categories.map((c) => ({
    id: c.id,
    label: localize(c, "name", locale),
  }));
  const countryOptions = countries.map((c) => ({
    id: c.id,
    label: localize(c, "name", locale),
  }));
  const cityOptions = cities.map((c) => ({
    id: c.id,
    countryId: c.countryId,
    label: localize(c, "name", locale),
  }));

  return (
    <main className="min-h-screen bg-sand">
      <Header />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-copper">
          {locale === "ar" ? "قيد إضافي للسجل" : "New Register Entry"}
        </p>
        <h1 className="mb-8 text-3xl font-semibold text-ink">
          {locale === "ar" ? "أضف نشاطك التجاري" : "Add your business"}
        </h1>

        <NewBusinessForm
          locale={locale}
          categories={categoryOptions}
          countries={countryOptions}
          cities={cityOptions}
        />
      </div>
    </main>
  );
}
