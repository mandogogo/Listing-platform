import Link from "next/link";
import { Header } from "@/components/Header";
import { getDictionary } from "@/lib/i18n";

export default async function SubmittedPage() {
  const { locale } = await getDictionary();
  const isAr = locale === "ar";

  return (
    <main className="min-h-screen bg-sand">
      <Header />
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <span className="seal mx-auto" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1 className="mt-6 text-2xl font-semibold text-ink">
          {isAr ? "تم استلام طلبك" : "Your submission was received"}
        </h1>
        <p className="mt-3 text-ink/70">
          {isAr
            ? "فريقنا هيراجع بيانات النشاط وينشره في السجل خلال 24-48 ساعة."
            : "Our team will review your business details and publish it within 24–48 hours."}
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-ink px-6 py-3 font-medium text-sand hover:bg-ink-light transition-colors"
        >
          {isAr ? "العودة للرئيسية" : "Back to home"}
        </Link>
      </div>
    </main>
  );
}
