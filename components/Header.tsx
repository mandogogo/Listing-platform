import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";

export async function Header() {
  const { locale, t } = await getDictionary();

  return (
    <header className="bg-sand-light">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono text-lg font-semibold tracking-tight text-ink">
            {locale === "ar" ? "السجل" : "The Register"}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink md:flex">
          <Link href="/" className="hover:text-copper transition-colors">
            {t.nav.browse}
          </Link>
          <Link href="/business/new" className="hover:text-copper transition-colors">
            {t.nav.addBusiness}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle locale={locale} />
          <Link
            href="/login"
            className="rounded-full bg-ink px-5 py-1.5 text-sm font-medium text-sand hover:bg-ink-light transition-colors"
          >
            {t.nav.login}
          </Link>
        </div>
      </div>
      <div className="ledger-rule" />
    </header>
  );
}
