import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { ReviewQueue } from "./ReviewQueue";

export default async function AdminPage() {
  const session = await auth();
  const { locale } = await getDictionary();
  const role = (session?.user as any)?.platformRole;

  if (!session?.user) redirect("/login?next=/admin");
  if (role !== "ADMIN" && role !== "MODERATOR") redirect("/");

  return (
    <main className="min-h-screen bg-sand">
      <div className="border-b border-ink/10 bg-ink">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-copper-light">
            {locale === "ar" ? "لوحة الإدارة" : "Admin"}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-sand">
            {locale === "ar" ? "طلبات مراجعة الأنشطة" : "Business review queue"}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <ReviewQueue locale={locale} />
      </div>
    </main>
  );
}
