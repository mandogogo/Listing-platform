"use client";

import { useRouter } from "next/navigation";

export function LanguageToggle({ locale }: { locale: "ar" | "en" }) {
  const router = useRouter();

  function toggle() {
    const next = locale === "ar" ? "en" : "ar";
    document.cookie = `locale=${next};path=/;max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      className="rounded-full border border-ink/20 px-4 py-1.5 text-sm font-medium text-ink hover:bg-ink hover:text-sand transition-colors"
    >
      {locale === "ar" ? "English" : "العربية"}
    </button>
  );
}
